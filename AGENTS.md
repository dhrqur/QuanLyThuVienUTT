# AGENTS.md

## Mandatory bootstrap contract

These rules are mandatory constraints for every AI coding agent in this repository.

Priority: **Correctness → clear requirements → simplicity → maintainability → readability → safety → testability → reusability → performance → speed.**

### Before implementation

1. Inspect the repository and relevant existing code before editing.
2. Check whether an installed skill/tool is appropriate for the task; read its instructions before use.
3. Do not ask the user questions that the repository/code can answer.
4. Ask short, simple clarification questions for unresolved product/behavior decisions. Do not silently guess material requirements.
5. Summarize the understood goal, expected behavior, affected areas, non-goals, assumptions, and remaining questions.
6. For every non-trivial task, create a phased implementation plan and obtain explicit user approval **before modifying source code**.
7. If scope, architecture, security, database behavior, API behavior, or another material assumption changes, stop and obtain approval for the revised plan.

### While implementing

- Implement only the approved scope and make the smallest correct change.
- Follow existing repository conventions before introducing new patterns.
- Prefer simple, explicit, junior-friendly, reusable and maintainable code over clever abstractions.
- Never overwrite unrelated user work or perform destructive actions without explicit approval.
- Work phase by phase. Keep each phase focused and report after every phase.
- If strict phase approval is requested, stop after every phase and wait for approval before continuing.

### Verification

- A task is not complete because code was written; verify the actual approved requirement.
- For executable behavior changes: test → identify root cause on failure → fix → retest until verified.
- Temporary one-time verification/debug tests and artifacts must be removed after successful verification.
- Valuable regression/unit/integration/E2E tests must be kept; never delete existing useful tests merely because implementation is complete.
- After temporary cleanup, run relevant permanent tests/checks again and review the final diff.
- Never claim success without stating what was actually verified and what was not run.

## Rule loading — do NOT load every file blindly

Read only the detailed rule files relevant to the current task. The bootstrap contract above always applies.

| Situation | Required detailed rules |
|---|---|
| Requirements are unclear, planning a non-trivial task, product behavior decision | `docs/agent/01-clarification-planning.md` |
| Writing/refactoring/reviewing source code | `docs/agent/02-clean-code-architecture.md` |
| Security, auth, authorization, secrets, database, migrations, Git, destructive actions, external APIs, concurrency | `docs/agent/03-safety-runtime-data.md` |
| Any non-trivial multi-step implementation | `docs/agent/04-phase-workflow.md` |
| Bug fix, behavioral code change, tests, validation, verification | `docs/agent/05-testing-verification.md` |
| A relevant installed skill/tool/plugin/workflow exists or may exist | `docs/agent/06-skills-tools.md` |
| Scope/communication/completion rules need detail, or a conflict/edge decision arises | `docs/agent/00-core-contract.md` |

### Loading rules

- Do **not** read `docs/agent/ORIGINAL_FULL.md` during normal work. It exists only as a lossless backup/reference.
- Do **not** load all detailed rule files "just in case". Load the smallest relevant set.
- If a task changes category while working, load the newly relevant rule file before continuing.
- More specific repository instructions may add constraints, but explicit user-approved requirements and safety constraints remain authoritative.

## Required default workflow

`Inspect → check relevant skills → clarify → summarize → phased plan → user approval → implement one phase → test/verify → clean temporary artifacts → report phase → next phase → final review → final report`

For the complete original 146-rule source and audit trail, see `docs/agent/MANIFEST.md` and `docs/agent/ORIGINAL_FULL.md`.
