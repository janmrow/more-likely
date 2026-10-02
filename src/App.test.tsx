// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "./App";

afterEach(() => {
  cleanup();
});

describe("App", () => {
  it("shows the starting bankroll, the situation and both outcomes", () => {
    render(<App />);

    expect(screen.getByText("100")).toBeTruthy();
    expect(screen.getByText(/7 czerwonych i 3 niebieskie kule/)).toBeTruthy();
    expect(screen.getByRole("button", { name: "A — Czerwona" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "B — Niebieska" })).toBeTruthy();
  });

  it.each(["A", "B"] as const)(
    "moves to stake selection after choosing %s",
    (outcome) => {
      render(<App />);

      fireEvent.click(
        screen.getByRole("button", { name: new RegExp(`^${outcome} — `) }),
      );

      expect(screen.getByText("Wybierz stawkę")).toBeTruthy();
      for (const stake of ["1", "5", "10", "20"]) {
        expect(screen.getByRole("button", { name: stake })).toBeTruthy();
      }
      expect(screen.queryByRole("button", { name: "A — Czerwona" })).toBeNull();
    },
  );

  it("reveals a win with the outcome, the true probabilities and the updated bankroll", () => {
    render(<App random={() => 0.1} />);

    fireEvent.click(screen.getByRole("button", { name: "A — Czerwona" }));
    fireEvent.click(screen.getByRole("button", { name: "10" }));

    expect(screen.getByText("Wypadło: Czerwona (A)")).toBeTruthy();
    expect(screen.getByText("+10")).toBeTruthy();
    expect(screen.getByText("A 70% · B 30%")).toBeTruthy();
    expect(
      screen.getByText("Twój wybór był bardziej prawdopodobny."),
    ).toBeTruthy();
    expect(screen.getByText("100 → 110")).toBeTruthy();
  });

  it("reveals a loss with the reduced bankroll", () => {
    render(<App random={() => 0.99} />);

    fireEvent.click(screen.getByRole("button", { name: "A — Czerwona" }));
    fireEvent.click(screen.getByRole("button", { name: "20" }));

    expect(screen.getByText("Wypadło: Niebieska (B)")).toBeTruthy();
    expect(screen.getByText("-20")).toBeTruthy();
    expect(screen.getByText("100 → 80")).toBeTruthy();
  });

  it("tells the player when the chosen outcome was less likely", () => {
    render(<App random={() => 0.1} />);

    fireEvent.click(screen.getByRole("button", { name: "B — Niebieska" }));
    fireEvent.click(screen.getByRole("button", { name: "5" }));

    expect(screen.getByText("-5")).toBeTruthy();
    expect(
      screen.getByText("Twój wybór był mniej prawdopodobny."),
    ).toBeTruthy();
    expect(screen.getByText("100 → 95")).toBeTruthy();
  });

  it.each([
    ["a", "A"],
    ["b", "B"],
  ])(
    "moves to stake selection with the %s keyboard shortcut",
    (key, outcome) => {
      render(<App />);

      fireEvent.keyDown(window, { key });

      expect(screen.getByText("Wybierz stawkę")).toBeTruthy();
      expect(screen.getByText(new RegExp(`Wybrałeś: ${outcome}`))).toBeTruthy();
    },
  );

  it.each([
    ["1", "1"],
    ["2", "5"],
    ["3", "10"],
    ["4", "20"],
  ])("resolves the round with stake %s from the keyboard", (key, stake) => {
    render(<App random={() => 0.1} />);

    fireEvent.click(screen.getByRole("button", { name: "A — Czerwona" }));
    fireEvent.keyDown(window, { key });

    expect(screen.getByText(`+${stake}`)).toBeTruthy();
    expect(screen.getByText(`100 → ${100 + Number(stake)}`)).toBeTruthy();
  });

  it("ignores stake shortcuts before the outcome is chosen", () => {
    render(<App />);

    fireEvent.keyDown(window, { key: "1" });

    expect(
      screen.getByText("Który kolor jest bardziej prawdopodobny?"),
    ).toBeTruthy();
    expect(screen.queryByText("Wybierz stawkę")).toBeNull();
  });
});
