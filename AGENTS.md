# AGENTS.md

## Start here

Before making product changes, read [SPEC.md](SPEC.md).

Use [README.md](README.md) only for the high-level project overview.

`SPEC.md` is the authoritative source for current product behavior, constraints, non-goals, and intentionally open questions.

---

## Just Enough

Treat complexity as a cost that must earn its place.

For each meaningful design or implementation choice:

- start from the actual outcome the task needs;
- identify what value the added complexity creates now;
- identify which real constraint or meaningful risk it addresses;
- compare it with a simpler plausible alternative;
- prefer the simpler option when both provide similar value;
- prefer choices that are easier to understand, change, reverse, or remove;
- do not generalize for hypothetical future requirements unless changing later would be materially expensive;
- preserve complexity required for correctness, accessibility, reliability, security, testability, or an explicit product requirement;
- distinguish **“could be improved”** from **“needs to be improved”**;
- stop when the solution is sufficient for the current goal.

When in doubt, ask:

- What materially breaks if this is simpler?
- Are we solving a current problem or a possible future one?
- Is this necessary, or merely possible to improve?

Do not solve uncertainty by building more machinery.

---

## Scope

Implement the smallest coherent change that satisfies the task.

Do not add adjacent features simply because they are easy to add.

Respect the non-goals and open questions in `SPEC.md`.

Avoid speculative:

- abstractions;
- configuration;
- extension points;
- architecture layers;
- dependencies;
- infrastructure.

A small amount of duplication is acceptable when removing it would require a larger abstraction with no current benefit.

---

## Implementation

Prefer explicit, readable code over premature abstraction.

Keep game rules separate enough from presentation that they can be understood and tested independently.

Follow the product rules and constraints defined in `SPEC.md`, including round design, randomness, deployment, and localization requirements.

Player-facing language requirements are defined in `SPEC.md`.
Code and developer documentation use English.

---

## Verification

Use the repository's existing verification workflow when one exists.

Do not assume commands or tooling exist without checking the repository first.

When a task explicitly introduces the initial development or verification setup, add only the minimum tooling needed for that task.

Add tests when they provide meaningful confidence.

Prefer the lowest-cost test level that adequately protects the behavior being changed.

Before considering a task complete:

1. verify the requested behavior;
2. run the existing relevant checks;
3. review the diff for unnecessary scope;
4. remove accidental complexity;
5. update documentation only when behavior, requirements, or workflow actually changed.

---

## Documentation

Keep documentation concise and non-duplicative.

- `README.md` explains the project.
- `SPEC.md` defines the product.
- `AGENTS.md` defines how work should be done.

Prefer linking to the authoritative document over repeating the same rule in multiple places.
