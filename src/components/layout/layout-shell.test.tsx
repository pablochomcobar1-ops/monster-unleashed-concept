import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SoundProvider } from "@/components/sound/SoundProvider";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MobileMenu } from "./MobileMenu";

let pathname = "/";
vi.mock("next/navigation", () => ({ usePathname: () => pathname }));

const withSound = (ui: React.ReactElement) => render(<SoundProvider>{ui}</SoundProvider>);

describe("Footer", () => {
  test("shows the concept disclaimer word for word", () => {
    render(<Footer />);
    expect(document.body.textContent).toContain(
      "Concept by Pablo Chomcobar. Not affiliated with Monster Energy.",
    );
  });

  test("official site link opens safely in a new tab", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: /official monster site/i });
    expect(link).toHaveAttribute("href", "https://www.monsterenergy.com/");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});

describe("Header", () => {
  beforeEach(() => {
    pathname = "/ingredients";
  });

  test("marks the current page in the main nav", () => {
    withSound(<Header />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    const current = nav.querySelector('[aria-current="page"]');
    expect(current).toHaveTextContent("Ingredients");
    expect(nav.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
  });

  test("has all four page links", () => {
    withSound(<Header />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    for (const name of ["Home", "About", "Ingredients", "Used By"]) {
      expect(nav).toHaveTextContent(name);
    }
  });
});

describe("MobileMenu", () => {
  test("opens, and Escape closes it and returns focus to the button", async () => {
    const user = userEvent.setup();
    withSound(<MobileMenu />);
    const button = screen.getByRole("button", { name: "Open menu" });
    expect(button).toHaveAttribute("aria-expanded", "false");

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("navigation", { name: "Mobile" })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
  });
});
