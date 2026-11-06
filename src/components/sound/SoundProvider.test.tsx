import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SoundProvider, useSound } from "./SoundProvider";
import { SoundToggle } from "./SoundToggle";

const wrapper = ({ children }: { children: React.ReactNode }) => <SoundProvider>{children}</SoundProvider>;

describe("sound", () => {
  let playSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    playSpy = vi.spyOn(window.HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    vi.spyOn(window.HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  test("is off by default and plays nothing", () => {
    const { result } = renderHook(() => useSound(), { wrapper });
    expect(result.current.enabled).toBe(false);
    act(() => result.current.play("crack"));
    expect(playSpy).not.toHaveBeenCalled();
  });

  test("toggle button flips state and aria-pressed", async () => {
    render(<SoundToggle />, { wrapper });
    const button = screen.getByRole("button", { name: /sound/i });
    expect(button).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  test("plays clips once enabled", () => {
    const { result } = renderHook(() => useSound(), { wrapper });
    act(() => result.current.toggle());
    playSpy.mockClear();
    act(() => result.current.play("whoosh"));
    expect(playSpy).toHaveBeenCalledTimes(1);
  });

  test("a failing audio file never crashes the page", async () => {
    playSpy.mockRejectedValue(new Error("NotAllowedError"));
    const unhandled = vi.fn();
    process.on("unhandledRejection", unhandled);
    const { result } = renderHook(() => useSound(), { wrapper });
    act(() => result.current.toggle());
    act(() => result.current.play("crack"));
    await new Promise((r) => setTimeout(r, 0));
    process.off("unhandledRejection", unhandled);
    expect(unhandled).not.toHaveBeenCalled();
    expect(result.current.enabled).toBe(true);
  });

  test("useSound outside the provider throws a clear error", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useSound())).toThrow(/SoundProvider/);
  });
});
