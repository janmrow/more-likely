export type Outcome = "A" | "B";

export type Round = {
  /** Probability of outcome A. Outcome B has probability 1 - probabilityA. */
  probabilityA: number;
};

export type RoundResult = {
  chosenOutcome: Outcome;
  actualOutcome: Outcome;
  moreLikelyOutcome: Outcome;
  stake: number;
  bankrollBefore: number;
  bankrollAfter: number;
  probabilityA: number;
  probabilityB: number;
  won: boolean;
};

export type ResolveRoundInput = {
  round: Round;
  choice: Outcome;
  stake: number;
  bankroll: number;
  /** Returns a value in [0, 1). Injected so randomness is controllable. */
  random: () => number;
};

export function resolveRound({
  round,
  choice,
  stake,
  bankroll,
  random,
}: ResolveRoundInput): RoundResult {
  const { probabilityA } = round;

  // A round always has two possible outcomes and exactly one more likely outcome.
  if (!(probabilityA > 0 && probabilityA < 1) || probabilityA === 0.5) {
    throw new RangeError("probabilityA must be in (0, 1) and not equal to 0.5");
  }
  if (!(stake > 0)) {
    throw new RangeError("stake must be greater than 0");
  }
  if (!Number.isFinite(bankroll) || bankroll < 0) {
    throw new RangeError("bankroll must be a finite, non-negative number");
  }
  if (stake > bankroll) {
    throw new RangeError("stake cannot exceed the bankroll");
  }

  const probabilityB = 1 - probabilityA;
  const actualOutcome: Outcome = random() < probabilityA ? "A" : "B";
  const won = actualOutcome === choice;
  const bankrollAfter = won ? bankroll + stake : bankroll - stake;

  return {
    chosenOutcome: choice,
    actualOutcome,
    moreLikelyOutcome: probabilityA > 0.5 ? "A" : "B",
    stake,
    bankrollBefore: bankroll,
    bankrollAfter,
    probabilityA,
    probabilityB,
    won,
  };
}
