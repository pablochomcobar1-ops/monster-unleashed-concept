import { FlavorStory } from "@/components/home/FlavorStory";

export default function Home() {
  return (
    <>
      <FlavorStory />
      {/* Worlds strip + "Pick your beast" land here in Task 7 */}
      <section id="picker" aria-label="Pick your beast" className="min-h-[40vh]" />
    </>
  );
}
