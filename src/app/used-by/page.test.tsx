import { afterEach, describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoopVideo } from "@/components/media/LoopVideo";
import UsedByPage, { metadata } from "./page";

class IO {
  static last: IO | null = null;
  constructor(public cb: IntersectionObserverCallback) {
    IO.last = this;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
  /** Test helper: pretend the element scrolled into view. */
  enter() {
    this.cb([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
}
vi.stubGlobal("IntersectionObserver", IO);

const clip = { mp4: "/video/skate.mp4", webm: "/video/skate.webm", poster: "/video/skate-poster.webp" };

describe("LoopVideo", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(navigator, "connection", { value: undefined, configurable: true });
  });

  test("Data Saver on: poster image only, no video", () => {
    Object.defineProperty(navigator, "connection", { value: { saveData: true }, configurable: true });
    const { container } = render(<LoopVideo src={clip} label="Skate clip" />);
    expect(container.querySelector("video")).toBeNull();
    expect(screen.getByRole("img", { name: "Skate clip" })).toHaveAttribute("src", clip.poster);
  });

  test("video is muted, inline, loads nothing up front, has a poster", () => {
    const { container } = render(<LoopVideo src={clip} label="Skate clip" />);
    const video = container.querySelector("video")!;
    expect(video.muted).toBe(true);
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveAttribute("preload", "none");
    expect(video).toHaveAttribute("poster", clip.poster);
  });

  test("blocked autoplay keeps the poster and never throws", async () => {
    vi.spyOn(window.HTMLMediaElement.prototype, "play").mockRejectedValue(new Error("NotAllowedError"));
    const unhandled = vi.fn();
    process.on("unhandledRejection", unhandled);
    const { container } = render(<LoopVideo src={clip} label="Skate clip" />);
    IO.last!.enter();
    await new Promise((r) => setTimeout(r, 0));
    process.off("unhandledRejection", unhandled);
    expect(unhandled).not.toHaveBeenCalled();
    expect(container.querySelector("video")).toHaveAttribute("poster", clip.poster);
  });
});

describe("Used By page", () => {
  test("6 world sections with anchor ids, in order", () => {
    const { container } = render(<UsedByPage />);
    const ids = [...container.querySelectorAll("section[id]")].map((s) => s.id);
    expect(ids).toEqual(["motocross", "skate", "bmx", "surf", "esports", "music"]);
  });

  test("each world has its own heading", () => {
    render(<UsedByPage />);
    for (const name of ["MOTOCROSS", "SKATE", "BMX", "SURF", "ESPORTS", "MUSIC"]) {
      expect(screen.getByRole("region", { name })).toBeInTheDocument();
    }
  });

  test("before clips are added: placeholders, no broken video or image requests", () => {
    const { container } = render(<UsedByPage />);
    expect(container.querySelectorAll('[data-placeholder="video"]')).toHaveLength(6);
    expect(container.querySelector("video, img")).toBeNull();
  });

  test("page title is Used By", () => {
    expect(metadata.title).toBe("Used By");
  });
});
