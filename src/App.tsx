import { useEffect, useState } from "react";
import {
  type Outcome,
  type Round,
  type RoundResult,
  resolveRound,
} from "./game/round";

const STARTING_BANKROLL = 100;
const STAKE_OPTIONS = [1, 5, 10, 20];
const STAKE_KEYS = ["1", "2", "3", "4"];

// One handcrafted round: 7 red and 3 blue balls.
// Drawing red has probability 7/10; drawing blue has probability 3/10.
const ROUND: Round = { probabilityA: 0.7 };
const SITUATION =
  "W torbie jest 7 czerwonych i 3 niebieskie kule. Losujesz jedną kulę bez patrzenia.";
const QUESTION = "Który kolor jest bardziej prawdopodobny?";
const OPTION_LABELS: Record<Outcome, string> = {
  A: "Czerwona",
  B: "Niebieska",
};

type Phase =
  | { stage: "choosing-outcome" }
  | { stage: "choosing-stake"; choice: Outcome }
  | { stage: "reveal"; result: RoundResult };

function formatProbability(probability: number) {
  return `${Math.round(probability * 100)}%`;
}

type AppProps = {
  random?: () => number;
};

export function App({ random = Math.random }: AppProps) {
  const [bankroll, setBankroll] = useState(STARTING_BANKROLL);
  const [phase, setPhase] = useState<Phase>({ stage: "choosing-outcome" });

  function chooseOutcome(choice: Outcome) {
    if (phase.stage !== "choosing-outcome") {
      return;
    }
    setPhase({ stage: "choosing-stake", choice });
  }

  function chooseStake(stake: number) {
    if (phase.stage !== "choosing-stake" || stake > bankroll) {
      return;
    }

    const result = resolveRound({
      round: ROUND,
      choice: phase.choice,
      stake,
      bankroll,
      random,
    });

    setBankroll(result.bankrollAfter);
    setPhase({ stage: "reveal", result });
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === "a") {
        chooseOutcome("A");
        return;
      }
      if (key === "b") {
        chooseOutcome("B");
        return;
      }

      const stakeIndex = STAKE_KEYS.indexOf(key);
      if (stakeIndex !== -1) {
        chooseStake(STAKE_OPTIONS[stakeIndex]);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <main className="game">
      <header className="topbar">
        <h1 className="brand">More Likely</h1>
        <p className="bankroll">
          Bankroll <strong>{bankroll}</strong>
        </p>
      </header>

      {phase.stage === "choosing-outcome" && (
        <section className="panel" aria-label="Sytuacja">
          <p className="situation">{SITUATION}</p>
          <h2 className="question">{QUESTION}</h2>
          <div className="options">
            {(["A", "B"] as const).map((outcome) => (
              <button
                key={outcome}
                type="button"
                className="option"
                aria-label={`${outcome} — ${OPTION_LABELS[outcome]}`}
                onClick={() => chooseOutcome(outcome)}
              >
                <span className="option-key">{outcome}</span>
                <span>{OPTION_LABELS[outcome]}</span>
              </button>
            ))}
          </div>
          <p className="hint">Na klawiaturze: A / B</p>
        </section>
      )}

      {phase.stage === "choosing-stake" && (
        <section className="panel" aria-label="Wybór stawki">
          <p className="situation">
            Wybrałeś: {phase.choice} — {OPTION_LABELS[phase.choice]}
          </p>
          <h2 className="question">Wybierz stawkę</h2>
          <div className="stakes">
            {STAKE_OPTIONS.map((stake) => (
              <button
                key={stake}
                type="button"
                className="stake"
                disabled={stake > bankroll}
                onClick={() => chooseStake(stake)}
              >
                {stake}
              </button>
            ))}
          </div>
          <p className="hint">Na klawiaturze: 1 / 2 / 3 / 4</p>
        </section>
      )}

      {phase.stage === "reveal" && (
        <section
          className="panel reveal"
          aria-label="Wynik rundy"
          role="status"
        >
          <p className="reveal-outcome">
            Wypadło: {OPTION_LABELS[phase.result.actualOutcome]} (
            {phase.result.actualOutcome})
          </p>
          <p className={`delta ${phase.result.won ? "win" : "loss"}`}>
            {phase.result.won ? "+" : "-"}
            {phase.result.stake}
          </p>
          <dl className="facts">
            <div>
              <dt>Twój wybór</dt>
              <dd>
                {phase.result.chosenOutcome} —{" "}
                {OPTION_LABELS[phase.result.chosenOutcome]}
              </dd>
            </div>
            <div>
              <dt>Stawka</dt>
              <dd>{phase.result.stake}</dd>
            </div>
            <div>
              <dt>Prawdziwe szanse</dt>
              <dd>
                A {formatProbability(phase.result.probabilityA)} · B{" "}
                {formatProbability(phase.result.probabilityB)}
              </dd>
            </div>
            <div>
              <dt>Bankroll</dt>
              <dd>
                {phase.result.bankrollBefore} → {phase.result.bankrollAfter}
              </dd>
            </div>
          </dl>
          <p className="verdict">
            {phase.result.chosenOutcome === phase.result.moreLikelyOutcome
              ? "Twój wybór był bardziej prawdopodobny."
              : "Twój wybór był mniej prawdopodobny."}
          </p>
        </section>
      )}
    </main>
  );
}
