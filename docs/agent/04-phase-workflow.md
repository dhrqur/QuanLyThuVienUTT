# Phase-Based Execution & Reporting

> Split from the original `AGENTS.md`. The numbered rule sections below are preserved verbatim.

**# 72. PHASE-BASED WORKFLOW**

Every non-trivial task MUST be divided into clear working phases.

Do NOT execute the whole task as one large uninterrupted block.

Before implementation begins, define the phases inside the proposed plan.

Example:

\`\`\`text

Phase 1 — Repository analysis

Phase 2 — Design and implementation

Phase 3 — Tests and validation

Phase 4 — Cleanup and review

Phase 5 — Final verification

\`\`\`

The number of phases may vary depending on task complexity.

Each phase must:

\* have one clear goal,

\* have a clear scope,

\* produce a verifiable result,

\* avoid mixing unrelated work,

\* end with a report to the user.

\---
**# 73. PHASE PLAN IS REQUIRED**

The implementation plan must explicitly show phases.

Example:

**## Proposed Plan**

**### Phase 1 — Understand existing implementation**

Goal:

\* Inspect current authentication flow.

\* Identify relevant files.

\* Understand current token behavior.

Expected output:

\* List of affected files.

\* Current flow summary.

\* Risks discovered.

**### Phase 2 — Implement the approved change**

Goal:

\* Update token expiration handling.

\* Reuse existing helpers where possible.

\* Avoid unrelated refactoring.

Expected output:

\* Authentication behavior updated.

\* No public API changes unless approved.

**### Phase 3 — Tests**

Goal:

\* Add/update regression tests.

\* Run relevant test suite.

Expected output:

\* Tests cover the new behavior.

**### Phase 4 — Review**

Goal:

\* Review diff.

\* Remove debug code.

\* Check for unnecessary changes.

Expected output:

\* Clean final diff.

Ask for approval before starting Phase 1 implementation work.

\---
**# 74. REPORT AFTER EVERY PHASE**

After completing EACH phase, stop and report the result to the user.

Do not silently continue through multiple phases without reporting.

Use this format:

**## Phase X Completed — [Phase Name]**

Completed:

\* ...

Files inspected/changed:

\* ...

Findings:

\* ...

Tests/checks:

\* ...

Problems discovered:

\* None / ...

Plan changes required:

\* No / Yes

Next phase:

\* ...

If the next phase still matches the approved plan, the agent may continue unless the repository is configured for explicit phase approval.

\---
**# 75. PHASE CHECKPOINTS**

Every phase is a checkpoint.

At each checkpoint:

1\. Review what was completed.

2\. Verify that the phase goal was achieved.

3\. Report what changed.

4\. Report unexpected findings.

5\. Confirm whether the original plan is still valid.

6\. Identify the next phase.

Never hide problems discovered during a phase.

\---
**# 76. STOP WHEN A PHASE CHANGES THE PLAN**

If a phase reveals information that materially changes:

\* scope,

\* architecture,

\* database design,

\* API design,

\* dependencies,

\* security behavior,

\* product behavior,

\* estimated risk,

STOP before starting the next phase.

Explain the discovery.

Update the proposed plan.

Ask the user to approve the revised plan.

Example:

\`\`\`text

Phase 1 discovered that authentication is shared by both the web app

and mobile app.

The original plan only considered the web app.

This changes the affected scope, so I will not continue yet.

Recommended revised plan:

1\. Update shared authentication service.

2\. Preserve existing mobile response behavior.

3\. Add regression tests for both clients.

Approve revised plan?

\`\`\`

\---
**# 77. DO NOT MIX PHASES**

Do not mix unrelated phase responsibilities.

For example:

During an analysis phase, do not start rewriting production code.

During an implementation phase, do not perform unrelated cleanup.

During a testing phase, do not introduce architectural refactors unless the test reveals a necessary problem.

Keep each phase focused.

\---
**# 78. PHASE SIZE**

Phases should be small enough that the user can understand progress.

Avoid:

\`\`\`text

Phase 1 — Build entire feature

\`\`\`

Prefer:

\`\`\`text

Phase 1 — Inspect current flow

Phase 2 — Update backend behavior

Phase 3 — Update frontend integration

Phase 4 — Add tests

Phase 5 — Final review

\`\`\`

For large tasks, use sub-phases when useful.

Example:

\`\`\`text

Phase 2 — Backend implementation

2.1 Update validation

2.2 Update service logic

2.3 Update repository

2.4 Update API response

\`\`\`

\---
**# 79. LARGE TASK RULE**

For large or risky tasks, prefer more checkpoints rather than fewer.

Tasks involving:

\* authentication,

\* payments,

\* database migrations,

\* permissions,

\* infrastructure,

\* deployment,

\* production data,

\* large refactors,

\* third-party integrations,

should normally use multiple smaller phases.

\---
**# 80. PHASE COMPLETION CRITERIA**

A phase is not complete merely because code was written.

A phase is complete only when its stated expected output has been verified.

Example:

Bad:

\`\`\`text

Phase completed:

\- Code written.

\`\`\`

Better:

\`\`\`text

Phase completed:

\- Token expiration logic updated.

\- Existing refresh behavior preserved.

\- Type checker passes.

\- Relevant authentication tests pass.

\`\`\`

\---
**# 81. PHASE REPORT MUST BE HONEST**

Never report a phase as completed if:

\* tests failed,

\* implementation is partial,

\* verification was skipped,

\* unresolved errors remain,

\* an important requirement is still unclear.

Instead report:

\`\`\`text

Phase status: BLOCKED

\`\`\`

or:

\`\`\`text

Phase status: PARTIALLY COMPLETE

\`\`\`

Explain exactly why.

\---
**# 82. BLOCKED PHASE FORMAT**

If blocked, use:

**## Phase X — BLOCKED**

Completed:

\* ...

Blocked by:

\* ...

Why it matters:

\* ...

Options:

A. ...

B. ...

Recommendation:

\* ...

Do not invent a workaround just to keep progressing.

\---
**# 83. PHASE STATUS**

Every phase report should clearly use one of:

\`\`\`text

NOT STARTED

IN PROGRESS

COMPLETED

PARTIALLY COMPLETE

BLOCKED

\`\`\`

Never use vague wording that makes progress unclear.

\---
**# 84. OPTIONAL STRICT PHASE APPROVAL MODE**

When strict phase approval mode is enabled:

After EACH phase:

1\. Report results.

2\. Stop.

3\. Show the next phase.

4\. Ask for approval.

5\. Do NOT continue until approved.

Example:

\`\`\`text

\## Phase 2 Completed

Changes:

\- Updated user validation.

\- Added duplicate-email handling.

Verification:

\- Unit tests pass.

\- Type check passes.

Next:

Phase 3 — Update API integration tests.

Proceed with Phase 3?

\`\`\`

If strict phase approval mode is NOT enabled, the agent must still report every phase, but may continue automatically when:

\* the approved plan is unchanged,

\* no new risk appears,

\* no user decision is required.

\---
**# 85. DEFAULT PHASE APPROVAL POLICY**

Unless the user explicitly says otherwise:

\* Initial plan approval is mandatory.

\* Phase completion reports are mandatory.

\* Re-approval is mandatory when the plan materially changes.

\* Routine continuation between unchanged phases does not require re-approval.

If the user says:

\`\`\`text

"Wait for me after every phase."

\`\`\`

then enable STRICT PHASE APPROVAL MODE.

\---
**# 86. USER CAN INTERRUPT BETWEEN PHASES**

The user may change direction at any phase checkpoint.

If the user provides new instructions:

\* stop the current progression,

\* incorporate the new requirement,

\* determine whether the plan changes,

\* update the plan if necessary,

\* request approval again when required.

Do not continue using an outdated plan.

\---
**# 87. PROGRESS MUST BE VISIBLE**

For long tasks, the user should always know:

\* what phase is active,

\* what has already been completed,

\* what remains,

\* whether any risk was discovered.

Recommended progress format:

\`\`\`text

Progress

[x] Phase 1 — Repository analysis

[x] Phase 2 — Backend implementation

[ ] Phase 3 — Tests

[ ] Phase 4 — Review

[ ] Phase 5 — Final verification

\`\`\`

Update this after each phase.

\---
**# 88. ONE PHASE = ONE MAIN PURPOSE**

A phase should answer one main question.

Examples:

\`\`\`text

Phase 1:

How does the current system work?

Phase 2:

What code needs to change?

Phase 3:

Does the new behavior work?

Phase 4:

Did the change break anything else?

Phase 5:

Is the final code clean and ready?

\`\`\`

This makes progress easier to understand and review.

\---
**# 89. PHASE ROLLBACK THINKING**

Before making risky changes in a phase, consider:

\* Can this phase be reverted independently?

\* Is user data affected?

\* Is a migration reversible?

\* Can the system remain usable if this phase fails?

Prefer changes that can be isolated and reverted.

\---
**# 90. PHASE-SCOPED DIFFS**

Keep changes inside each phase as focused as practical.

Avoid modifying many unrelated areas in the same phase.

This improves:

\* debugging,

\* review,

\* rollback,

\* testing,

\* user understanding.

\---
**# 91. REPORT FILES PER PHASE**

At the end of each implementation phase, list important files touched.

Example:

\`\`\`text

Files changed:

\- src/auth/auth.service.ts

\- src/auth/token.ts

\- tests/auth/token.test.ts

\`\`\`

Do not dump every generated or irrelevant file.

Focus on meaningful changes.

\---
**# 92. REPORT WHY, NOT ONLY WHAT**

A phase report should briefly explain why important changes were made.

Example:

Bad:

\`\`\`text

Changed \`auth.service.ts\`.

\`\`\`

Better:

\`\`\`text

Changed \`auth.service.ts\` so expired tokens return the existing

UNAUTHORIZED error instead of falling through to the generic error handler.

\`\`\`

\---
**# 93. REPORT UNEXPECTED FINDINGS**

During every phase, report important findings such as:

\* duplicated logic,

\* undocumented behavior,

\* missing tests,

\* risky code,

\* deprecated dependencies,

\* possible security problems,

\* conflicts between requirement and current implementation.

Do not automatically fix them unless they are part of the approved scope.

\---
**# 94. PHASE FINAL REVIEW**

The final implementation phase must be followed by a dedicated review phase.

Do not treat implementation completion as task completion.

The review phase should inspect:

\* final diff,

\* code readability,

\* duplication,

\* unnecessary abstraction,

\* unused code,

\* errors,

\* edge cases,

\* security,

\* tests,

\* documentation.

\---
**# 95. FINAL TASK REPORT**

After all phases are complete, provide one final consolidated report.

Format:

**## Task Completed**

**### Progress**

[x] Phase 1 — ...

[x] Phase 2 — ...

[x] Phase 3 — ...

[x] Phase 4 — ...

**### Final changes**

\* ...

**### Files changed**

\* ...

**### Tests/checks**

\* ...

**### Important decisions**

\* ...

**### Risks**

\* None / ...

**### Not changed**

\* ...

**### Follow-up suggestions**

\* ...

The final report does NOT replace the mandatory per-phase reports.

\---
**# 96. UPDATED DEFAULT WORKFLOW**

Every non-trivial task must follow this workflow:

\`\`\`text

USER REQUEST

     ↓

INSPECT REPOSITORY

     ↓

ASK SIMPLE CLARIFICATION QUESTIONS

     ↓

REPEAT UNTIL IMPORTANT REQUIREMENTS ARE CLEAR

     ↓

SUMMARIZE UNDERSTANDING

     ↓

CREATE PHASED PLAN

     ↓

USER APPROVES PLAN

     ↓

PHASE 1

     ↓

VERIFY PHASE 1

     ↓

REPORT PHASE 1

     ↓

PHASE 2

     ↓

VERIFY PHASE 2

     ↓

REPORT PHASE 2

     ↓

...

     ↓

FINAL REVIEW PHASE

     ↓

FINAL VERIFICATION

     ↓

FINAL REPORT

\`\`\`

Never perform several major phases silently and only report at the end.

\---
**# 97. FINAL PHASE PRINCIPLE**

Work should be transparent and reviewable.

For every task:

\*\*Plan the work.

Split the work into phases.

Complete one phase at a time.

Verify each phase.

Report each phase.

Stop when assumptions change.

Finish with a final review.\*\*
