import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SoundProvider } from "@/components/sound/SoundProvider";
import { getFlavor } from "@/content/flavors";
import { pickFlavor } from "@/content/picker";

vi.mock("@/lib/canUseWebGL", () => ({ canUseWebGL: () => false, isLowPowerDevice: () => false }));

import { BeastPicker } from "./BeastPicker";
import { WorldsStrip } from "./WorldsStrip";

const renderPicker = () => render(<SoundProvider><BeastPicker /></SoundProvider>);

describe("BeastPicker", () => {
  test("3 answers lead to the matching beast", async () => {
    const user = userEvent.setup();
    renderPicker();
    await user.click(screen.getByRole("button", { name: /2 am\. lights off\./i }));
    await user.click(await screen.findByRole("button", { name: /zero\. keep it clean\./i }));
    await user.click(await screen.findByRole("button", { name: /screens & stages/i }));

    const expected = getFlavor(pickFlavor([0, 1, 2])).name;
    const heading = await screen.findByRole("heading", { level: 3, name: new RegExp(`your beast: ${expected}`, "i") });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveFocus();
    expect(screen.getByRole("img", { name: `${expected} can` })).toBeInTheDocument();
  });

  test("Again goes back to question 1 and focuses it", async () => {
    const user = userEvent.setup();
    renderPicker();
    for (const name of [/midday/i, /full load/i, /dirt & engines/i]) {
      await user.click(await screen.findByRole("button", { name }));
    }
    await user.click(await screen.findByRole("button", { name: "Again" }));
    const q1 = await screen.findByRole("heading", { level: 3, name: "WHEN DO YOU RIDE?" });
    expect(q1).toHaveFocus();
    expect(screen.getByText("Question 1 of 3")).toBeInTheDocument();
  });

  test("official-site link is external, safe and labelled", async () => {
    const user = userEvent.setup();
    renderPicker();
    for (const name of [/sunrise/i, /zero/i, /waves/i]) {
      await user.click(await screen.findByRole("button", { name }));
    }
    const link = await screen.findByRole("link", { name: /official site/i });
    expect(link).toHaveAttribute("href", "https://www.monsterenergy.com/");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});

describe("WorldsStrip", () => {
  test("6 world cards link to their Used By section", () => {
    render(<WorldsStrip />);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual(["motocross", "skate", "bmx", "surf", "esports", "music"].map((id) => `/used-by#${id}`));
  });
});
