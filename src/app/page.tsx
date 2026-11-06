import { BeastPicker } from "@/components/home/BeastPicker";
import { FlavorStory } from "@/components/home/FlavorStory";
import { WorldsStrip } from "@/components/home/WorldsStrip";

export default function Home() {
  return (
    <>
      <FlavorStory />
      <WorldsStrip />
      <BeastPicker />
    </>
  );
}
