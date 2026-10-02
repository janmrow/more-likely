import { describe, expect, it } from "vitest";
import { type Outcome, resolveRound } from "./round";

type ResolveOptions = {
  probabilityA?: number;
  choice?: Outcome;
  stake?: number;
  bankroll?: number;
  randomValue?: number;
};

function resolve({
  probabilityA = 0.7,
  choice = "A",
  stake = 10,
  bankroll = 100,
  randomValue = 0.1,
}: ResolveOptions = {}) {
  return resolveRound({
    round: { probabilityA },
    choice,
    stake,
    bankroll,
    random: () => randomValue,
  });
}

describe("resolveRound", () => {
  it("resolves outcome A when the random value is below probabilityA", () => {
    expect(resolve({ randomValue: 0.69 }).actualOutcome).toBe("A");
  });

  it("resolves outcome B when the random value is above probabilityA", () => {
    expect(resolve({ randomValue: 0.71 }).actualOutcome).toBe("B");
  });

  it("treats a random value exactly at probabilityA as outcome B", () => {
    expect(resolve({ randomValue: 0.7 }).actualOutcome).toBe("B");
  });

  it("adds the stake to the bankroll on a win", () => {
    const result = resolve({
      choice: "A",
      stake: 10,
      bankroll: 100,
      randomValue: 0.1,
    });

    expect(result.chosenOutcome).toBe("A");
    expect(result.actualOutcome).toBe("A");
    expect(result.bankrollBefore).toBe(100);
    expect(result.bankrollAfter).toBe(110);
    expect(result.won).toBe(true);
  });

  it("wins when the chosen outcome B occurs", () => {
    const result = resolve({
      choice: "B",
      stake: 10,
      bankroll: 100,
      randomValue: 0.9,
    });

    expect(result.chosenOutcome).toBe("B");
    expect(result.actualOutcome).toBe("B");
    expect(result.won).toBe(true);
    expect(result.bankrollAfter).toBe(110);
  });

  it("subtracts the stake from the bankroll on a loss", () => {
    const result = resolve({
      choice: "A",
      stake: 10,
      bankroll: 100,
      randomValue: 0.9,
    });

    expect(result.bankrollAfter).toBe(90);
    expect(result.won).toBe(false);
  });

  it("rejects a stake greater than the bankroll", () => {
    expect(() => resolve({ stake: 101, bankroll: 100 })).toThrow(RangeError);
  });

  it("rejects a non-positive stake", () => {
    expect(() => resolve({ stake: 0 })).toThrow(RangeError);
    expect(() => resolve({ stake: -10 })).toThrow(RangeError);
  });

  it("rejects a non-finite bankroll", () => {
    expect(() => resolve({ bankroll: Number.NaN })).toThrow(RangeError);
  });

  it("rejects a negative bankroll", () => {
    expect(() => resolve({ bankroll: -1 })).toThrow(RangeError);
  });

  it("never drops the bankroll below zero", () => {
    const result = resolve({ stake: 100, bankroll: 100, randomValue: 0.9 });

    expect(result.bankrollAfter).toBe(0);
  });

  it("identifies the more likely outcome", () => {
    expect(resolve({ probabilityA: 0.7 }).moreLikelyOutcome).toBe("A");
    expect(resolve({ probabilityA: 0.3 }).moreLikelyOutcome).toBe("B");
  });

  it("derives probabilityB as 1 - probabilityA", () => {
    expect(resolve({ probabilityA: 0.3 }).probabilityB).toBe(0.7);
  });

  it.each([0, 1, 0.5, -0.1, 1.1, Number.NaN])(
    "rejects an invalid probabilityA: %s",
    (probabilityA) => {
      expect(() => resolve({ probabilityA })).toThrow(RangeError);
    },
  );
});
