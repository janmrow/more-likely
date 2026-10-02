# More Likely — Product Specification

## 1. Purpose

More Likely is a fast decision game about reasoning under uncertainty.

The player repeatedly:

1. sees a small amount of information;
2. chooses which of two outcomes is more likely;
3. decides how much bankroll to risk;
4. sees the probabilistic result;
5. receives immediate feedback.

The game should help the player distinguish between:

- **probability** — what was more likely;
- **risk** — how much was exposed;
- **outcome** — what happened this time.

The primary goal is a satisfying game loop. Learning should emerge naturally from play.

---

## 2. Core gameplay

Each round follows the same short loop:

### Situation → choice → stake → reveal → next round

The player starts with a bankroll of **100 chips**.

Each round has two outcomes:

**A** and **B**.

The player:

- chooses one outcome;
- selects one of four fixed stake sizes;
- sees the result;
- sees how the bankroll changed;
- sees the true probability behind the round.

The initial payout model is intentionally simple:

- win: `bankroll += stake`
- loss: `bankroll -= stake`

This payout model is a hypothesis, not a permanent rule. It should change only if playtesting gives a concrete reason.

The bankroll cannot fall below zero.

A stake can only be selected if it does not exceed the current bankroll.

If no available stake can be afforded, the session ends early.

A loss always deducts the full selected stake; losses are never capped after the bet is placed.

---

## 3. Round design

Every round must have a defensible true probability.

The probability must come from:

- information shown in the round; or
- a small, explicit and internally consistent model used to construct it.

It must not be an arbitrary number chosen because it feels plausible.

The author of a round must be able to explain why:

```text
P(A) = x
P(B) = 1 - x
```

The player should normally **estimate**, not calculate, the probability.

A good round:

- communicates only a few relevant signals;
- can be understood within a few seconds;
- makes one outcome objectively more likely;
- gives enough evidence to infer the direction of the advantage;
- avoids long text and unnecessary calculation.

The model should be calculable. The experience should be intuitive.

There should be no exact 50/50 rounds in the initial game.

---

## 4. Probability, risk, and feedback

Choosing the more likely outcome and deciding how much to risk are separate decisions.

A good probabilistic choice can still lose.
A weak probabilistic choice can still win.

After each round, the player should quickly see:

- the outcome;
- bankroll change;
- true probabilities;
- whether the chosen outcome was the more likely or less likely one;
- the stake that was risked.

The initial game should **not** claim that a stake was mathematically optimal or objectively bad.

Do not use feedback such as:

- perfect stake;
- bad bet;
- you risked too much;
- optimal bet.

That would require a defined bankroll-management model that the first version does not need.

---

## 5. Player experience

The game should feel:

- fast;
- clear;
- slightly tense;
- visually minimal;
- polished;
- easy to understand without a long tutorial.

Game feel takes priority over educational exposition.

The player should not feel like they are solving probability exercises.

All primary actions must work by tap or click.

Desktop may additionally support keyboard shortcuts such as:

```text
A / B
1 / 2 / 3 / 4
```

The same interaction model should serve mobile and desktop.

Routine flow should avoid unnecessary confirmations, dialogs, page navigation, or repeated “Next” buttons.

---

## 6. First playable

The first playable should be intentionally small.

Target:

- approximately **5 handcrafted rounds**;
- one short session;
- one bankroll;
- two outcomes per round;
- four fixed stake options;
- immediate feedback;
- no backend.

Its purpose is to answer whether the core loop is enjoyable and understandable.

The exact:

- stake values;
- number of rounds;
- reveal timing;
- round types;

should remain easy to change and be decided through playtesting.

---

## 7. Product constraints

The game should remain compatible with static deployment on GitHub Pages.

The initial product therefore does not require:

- a backend;
- user accounts;
- a database;
- server-side sessions.

Random outcomes are part of the core mechanic.

The implementation must make randomness controllable enough that a particular sequence can be reproduced when needed for development, debugging, testing, or playtesting.

The eventual player-facing interface should support:

- **Polish** — default;
- **English**.

The first playable does not need full localization, but implementation choices should not make later extraction of player-facing text unnecessarily expensive.

Code, identifiers, comments, and developer documentation use English.

---

## 8. Non-goals

The initial product does not include:

- authentication;
- online leaderboards;
- multiplayer;
- AI-generated rounds;
- procedural content generation;
- achievements;
- levels;
- shops;
- advertising;
- elaborate story systems;
- advanced bankroll optimization;
- sophisticated scoring systems;
- large analytics infrastructure.

These ideas are not permanently rejected. They simply have not earned their complexity yet.

---

## 9. Open questions

The following remain intentionally unresolved until implementation or playtesting provides useful evidence:

- exact stake values;
- exact session length;
- reveal duration;
- which round types are most enjoyable;
- how much end-of-session feedback is useful;
- whether stake sizing should later receive explicit feedback;
- whether the simple `+stake / -stake` economy should change;
- when English localization should be introduced.

Do not resolve these questions merely to make the specification look complete.
