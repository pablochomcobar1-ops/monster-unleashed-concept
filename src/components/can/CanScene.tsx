"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  type Group,
  LatheGeometry,
  MathUtils,
  type Points,
  Vector2,
} from "three";
import type { Flavor } from "@/content/flavors";
import { makeLabelTexture } from "./labelTexture";

// 500 ml tall-can proportions (diameter : height ≈ 1 : 2.55)
const R = 0.75;
const BODY_H = 3.4;
const NECK_H = 0.22;

export type CanSceneProps = {
  flavor: Flavor;
  /** 0–1: one full spin of the can (driven by scroll in Task 6). */
  progress?: number;
  /** 0–1: scroll speed, makes the particles rush. */
  velocity?: number;
  reduceMotion?: boolean;
  onCanClick?: () => void;
};

/** Top / bottom metal ends: a lathe profile that narrows into the lid. */
function useEndGeometry(top: boolean) {
  return useMemo(() => {
    const s = top ? 1 : -1;
    const pts = [
      new Vector2(R, 0),
      new Vector2(R * 0.97, NECK_H * 0.35 * s),
      new Vector2(R * 0.86, NECK_H * 0.85 * s),
      new Vector2(R * 0.84, NECK_H * s),
      new Vector2(R * 0.8, NECK_H * 1.05 * s),
      new Vector2(0, NECK_H * 0.95 * s),
    ];
    if (!top) pts.reverse();
    return new LatheGeometry(pts, 96);
  }, [top]);
}

function Can({ flavor, progress = 0, reduceMotion, onCanClick }: CanSceneProps) {
  const group = useRef<Group>(null);
  const shake = useRef(0);
  const { pointer } = useThree();
  const topGeo = useEndGeometry(true);
  const bottomGeo = useEndGeometry(false);

  const texture = useMemo(() => makeLabelTexture(flavor), [flavor]);
  useEffect(() => () => texture.dispose(), [texture]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const spin = progress * Math.PI * 2;

    if (reduceMotion) {
      g.rotation.set(0, spin, 0);
      g.position.y = 0;
      return;
    }

    // Idle float + mouse tilt (±8°) + scroll spin
    g.rotation.y = MathUtils.damp(g.rotation.y, spin + pointer.x * 0.35, 6, delta);
    g.rotation.x = MathUtils.damp(g.rotation.x, -pointer.y * 0.14, 6, delta);
    g.rotation.z = MathUtils.damp(g.rotation.z, 0.08 + Math.sin(t * 0.6) * 0.03, 4, delta);
    g.position.y = Math.sin(t * 1.1) * 0.08;

    // Click shake decays quickly
    if (shake.current > 0) {
      shake.current = Math.max(0, shake.current - delta * 3);
      g.position.x = Math.sin(t * 60) * 0.06 * shake.current;
    } else {
      g.position.x = 0;
    }
  });

  return (
    <group
      ref={group}
      onClick={(e) => {
        e.stopPropagation();
        shake.current = 1;
        onCanClick?.();
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "")}
    >
      {/* Label body: thetaStart = π puts the centre of the label facing the camera */}
      <mesh>
        <cylinderGeometry args={[R, R, BODY_H, 96, 1, true, Math.PI]} />
        <meshStandardMaterial map={texture} metalness={0.55} roughness={0.32} envMapIntensity={1.1} />
      </mesh>
      <mesh geometry={topGeo} position={[0, BODY_H / 2, 0]}>
        <meshStandardMaterial color="#c9d1c2" metalness={1} roughness={0.28} />
      </mesh>
      <mesh geometry={bottomGeo} position={[0, -BODY_H / 2, 0]}>
        <meshStandardMaterial color="#8a9483" metalness={1} roughness={0.35} />
      </mesh>
    </group>
  );
}

/** Deterministic pseudo-random numbers, so particles are identical on every render. */
function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function makeParticleGeometry(count: number): BufferGeometry {
  const rand = seeded(42);
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const radius = 2 + rand() * 4;
    const angle = rand() * Math.PI * 2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (rand() - 0.5) * 9;
    positions[i * 3 + 2] = Math.sin(angle) * radius - 2;
  }
  const geo = new BufferGeometry();
  geo.setAttribute("position", new BufferAttribute(positions, 3));
  return geo;
}

const PARTICLE_COUNT = 400;

/** ~400 glowing specks in the flavour colour; they rush when you scroll fast. */
function Particles({ color, velocity = 0, reduceMotion }: { color: string; velocity?: number; reduceMotion?: boolean }) {
  const ref = useRef<Points>(null);
  const geometry = useMemo(() => makeParticleGeometry(PARTICLE_COUNT), []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const tint = useMemo(() => new Color(color), [color]);

  useFrame((_, delta) => {
    if (reduceMotion || !ref.current) return;
    const speed = 0.25 + Math.min(Math.max(velocity, 0), 1) * 6;
    // Read through the ref (not the memo value) so React's rules stay happy.
    const pos = ref.current.geometry.attributes.position as BufferAttribute;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      let y = pos.getY(i) + delta * speed * (0.5 + (i % 5) * 0.15);
      if (y > 4.5) y = -4.5;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
    ref.current.rotation.y += delta * 0.03;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color={tint}
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

/**
 * The 3D can scene. Transparent background, so the Atmosphere shows through.
 * Stops rendering when it scrolls off-screen to save battery.
 */
export default function CanScene(props: CanSceneProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="h-full w-full">
      <Canvas
        dpr={[1, 1.75]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, 7.2], fov: 32 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        aria-label={`${props.flavor.name} can, 3D`}
        role="img"
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 5, 6]} intensity={1.6} />
        <pointLight position={[-3, 1, 2]} intensity={8} color={props.flavor.color} distance={10} />
        {/* Studio reflections built in code: no HDR download needed */}
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={3} position={[0, 2, 5]} scale={[10, 2, 1]} />
          <Lightformer form="rect" intensity={2} position={[-5, 0, 0]} rotation-y={Math.PI / 2} scale={[6, 10, 1]} />
          <Lightformer form="rect" intensity={1.5} color={props.flavor.color} position={[5, 0, -1]} rotation-y={-Math.PI / 2} scale={[4, 10, 1]} />
        </Environment>
        <Can {...props} />
        <Particles color={props.flavor.color} velocity={props.velocity} reduceMotion={props.reduceMotion} />
      </Canvas>
    </div>
  );
}
