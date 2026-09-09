# Testing, Verification & Temporary Test Cleanup

> Split from the original `AGENTS.md`. The numbered rule sections below are preserved verbatim.

**# 32. TESTING RULE**

Every meaningful behavioral change should be tested when practical.

Tests should verify behavior, not implementation details.

Prefer:

1\. Existing tests

2\. Focused new tests

3\. Integration tests when necessary

4\. End-to-end tests for critical flows

Do not create meaningless tests just to increase coverage.

\---
**# 33. BUG FIX RULE**

When fixing a bug:

1\. Understand the root cause.

2\. Reproduce the issue if possible.

3\. Add a failing regression test when practical.

4\. Fix the root cause.

5\. Verify the regression test passes.

6\. Check related behavior.

Avoid symptom-only fixes when the actual root cause can reasonably be addressed.

\---
**# 34. DO NOT CHANGE TESTS JUST TO MAKE THEM PASS**

A failing test may reveal broken production code.

Do not weaken, delete, skip, or modify tests merely because they fail after your implementation.

Change a test only when:

\* the requirement intentionally changed,

\* the old test is incorrect,

\* and the change is justified.

\---
**# 35. VERIFY AFTER CHANGES**

After implementation, run the relevant available checks.

Examples:

\`\`\`text

unit tests

integration tests

type checker

linter

formatter

build

\`\`\`

Use the project's actual commands.

Do not invent commands without inspecting project configuration.

\---
**# 36. SELF-REVIEW**

Before reporting completion:

1\. Read the final diff.

2\. Check for accidental changes.

3\. Check naming.

4\. Check duplicated logic.

5\. Check unnecessary complexity.

6\. Check error handling.

7\. Check security issues.

8\. Check edge cases.

9\. Check tests.

10\. Remove debug code.

Look specifically for:

\`\`\`text

console.log

print()

TODO created accidentally

temporary comments

debug flags

hardcoded test values

unused imports

dead code

\`\`\`

\---
**# 98. REQUIREMENT VERIFICATION IS MANDATORY**

After implementing any behavioral change, the agent MUST verify that the result actually matches the approved requirement.

Writing code successfully is NOT enough.

The agent must confirm:

\* the requested behavior works,

\* the expected output is correct,

\* important edge cases still work,

\* existing related behavior has not been broken,

\* the implementation matches the user's approved requirement.

Do not report a feature as completed until it has been verified.

\---
**# 99. TEST AGAINST THE ORIGINAL REQUIREMENT**

Before testing, re-read the approved requirement.

Do not test only whether:

\`\`\`text

the code compiles

the function returns something

the server starts

the test suite is green

\`\`\`

Test whether the actual user requirement is satisfied.

Example:

User requirement:

\`\`\`text

When the access token expires, the user should be logged out

and redirected to the login page.

\`\`\`

Insufficient verification:

\`\`\`text

Authentication unit test passes.

\`\`\`

Required verification:

\`\`\`text

1\. Simulate an expired access token.

2\. Confirm the API rejects the token.

3\. Confirm the frontend clears authentication state.

4\. Confirm the user is redirected to the login page.

5\. Confirm a valid token still works normally.

\`\`\`

Tests must reflect real expected behavior.

\---
**# 100. TEST AFTER EVERY RELEVANT PHASE**

If a phase changes executable behavior, test it before reporting that phase as completed.

Workflow:

\`\`\`text

IMPLEMENT PHASE

     ↓

RUN RELEVANT TESTS

     ↓

VERIFY REQUIREMENT

     ↓

IF FAILED → FIX

     ↓

TEST AGAIN

     ↓

ONLY WHEN CORRECT

     ↓

REPORT PHASE COMPLETED

\`\`\`

Never report:

\`\`\`text

Phase completed

\`\`\`

when the implementation has not been tested where testing is practical.

\---
**# 101. TEST → FIX → RETEST LOOP**

When a test fails:

1\. Read the failure.

2\. Determine whether the test or implementation is wrong.

3\. Identify the root cause.

4\. Fix the root cause.

5\. Run the relevant test again.

6\. Repeat until the expected behavior is verified.

Do not blindly change code until tests become green.

Do not blindly change tests to match incorrect behavior.

The requirement is the source of truth.

\---
**# 102. MANUAL VERIFICATION WHEN NECESSARY**

Automated tests are preferred, but some features also require manual or runtime verification.

Examples:

\* UI flows,

\* animations,

\* browser navigation,

\* file uploads,

\* authentication flows,

\* third-party integrations,

\* deployment behavior,

\* visual layout.

When appropriate:

1\. Run automated tests.

2\. Start the relevant application/service.

3\. Exercise the actual workflow.

4\. Verify expected behavior.

5\. Report exactly what was verified.

Do not assume passing unit tests means the entire user workflow works.

\---
**# 103. TEMPORARY VERIFICATION TESTS**

The agent may create temporary tests, scripts, fixtures, or debug files specifically to verify a change.

Examples:

\`\`\`text

tmp-auth-check.ts

verify-upload.py

debug-payment-flow\.test.ts

temporary-test-data.json

\`\`\`

Temporary verification files must be clearly distinguishable from permanent project tests.

They must NOT be mixed carelessly into the permanent test suite.

\---
**# 104. DELETE TEMPORARY TEST FILES AFTER SUCCESSFUL VERIFICATION**

After temporary verification tests have:

1\. been executed,

2\. passed,

3\. confirmed the approved requirement,

the agent MUST remove temporary test files that were created only for one-time verification.

Workflow:

\`\`\`text

CREATE TEMPORARY TEST

        ↓

RUN TEST

        ↓

FAILED?

   YES → FIX → RETEST

        ↓

PASSED

        ↓

VERIFY REQUIREMENT

        ↓

DELETE TEMPORARY TEST FILE

        ↓

RUN FINAL CHECKS

\`\`\`

Do not leave temporary verification files in the repository.

\---
**# 105. DO NOT DELETE VALUABLE PERMANENT TESTS**

The rule above applies ONLY to temporary one-time verification files.

Do NOT automatically delete:

\* existing project tests,

\* regression tests,

\* unit tests that protect important business logic,

\* integration tests,

\* end-to-end tests,

\* tests explicitly requested by the user,

\* tests that prevent the same bug from returning.

Permanent tests are part of the maintainability of the project.

Example:

A bug is fixed:

\`\`\`text

User can create duplicate accounts with the same email.

\`\`\`

A regression test such as:

\`\`\`text

should reject registration when email already exists

\`\`\`

should normally remain in the repository.

It protects against the bug returning later.

\---
**# 106. TEMPORARY TEST VS PERMANENT TEST**

Before creating a test, decide which category it belongs to.

**## Temporary Test**

Purpose:

\* inspect current behavior,

\* debug an issue,

\* verify implementation quickly,

\* investigate an unknown condition,

\* reproduce something locally.

Expected lifecycle:

\`\`\`text

create

→ run

→ verify

→ delete

\`\`\`

**## Permanent Test**

Purpose:

\* protect business behavior,

\* prevent regression,

\* document expected behavior,

\* validate reusable logic,

\* protect critical flows.

Expected lifecycle:

\`\`\`text

create

→ run

→ keep in repository

\`\`\`

Do not confuse the two.

\---
**# 107. DEFAULT TEST RETENTION POLICY**

Use this default rule:

\`\`\`text

Temporary debugging / verification test

→ DELETE after successful verification.

Useful regression / unit / integration / E2E test

→ KEEP.

Existing test

→ NEVER DELETE simply because implementation is finished.

\`\`\`

If uncertain whether a new test should remain:

\* explain why the test may be useful,

\* ask the user if the decision materially affects the repository.

\---
**# 108. CLEAN TEMPORARY ARTIFACTS**

After testing, remove temporary artifacts created by the agent.

Examples:

\`\`\`text

temporary test files

debug scripts

temporary JSON files

temporary databases

screenshots used only for debugging

generated test output

temporary logs

temporary fixtures

temporary environment files

\`\`\`

Do not delete project-owned files.

Do not delete anything whose purpose is unclear.

\---
**# 109. REMOVE DEBUG CODE AFTER TESTING**

Before completing a phase, remove debugging code such as:

\`\`\`text

console.log(...)

print(...)

debugger

dump(...)

dd(...)

temporary return values

fake API responses

hardcoded IDs

hardcoded tokens

test-only conditionals

temporary feature flags

\`\`\`

Unless the project intentionally requires them.

\---
**# 110. TEST CLEANUP MUST NOT BREAK THE PROJECT**

After deleting temporary tests or debugging files:

1\. Check the diff.

2\. Ensure no production code imports the deleted files.

3\. Ensure no configuration references them.

4\. Run relevant tests again if necessary.

5\. Verify the repository remains clean.

Never delete a temporary file and assume cleanup is safe.

\---
**# 111. FINAL VERIFICATION AFTER CLEANUP**

The final verification MUST happen after temporary test/debug cleanup.

Recommended order:

\`\`\`text

IMPLEMENT

   ↓

TEST

   ↓

FIX

   ↓

RETEST

   ↓

REQUIREMENT VERIFIED

   ↓

REMOVE TEMPORARY TESTS / DEBUG FILES

   ↓

RUN PERMANENT TEST SUITE

   ↓

TYPE CHECK

   ↓

LINT

   ↓

BUILD

   ↓

REVIEW DIFF

   ↓

FINAL REPORT

\`\`\`

This prevents situations where temporary files accidentally hide a problem.

\---
**# 112. TEST REPORT AFTER EACH PHASE**

Every phase report involving code changes should include a test section.

Required format:

**## Phase X Completed — [Name]**

Status:

\* COMPLETED

Implemented:

\* ...

Requirement verified:

\* Yes

Tests performed:

\* ...

Test result:

\* PASS

Temporary test files created:

\* ...

Temporary test files removed:

\* ...

Permanent tests added/updated:

\* ...

Remaining issues:

\* None

Next phase:

\* ...

Never simply say:

\`\`\`text

Tested successfully.

\`\`\`

Provide enough information for the user to understand what was tested.

\---
**# 113. REPORT FAILED TESTS CLEARLY**

If testing fails, report it clearly.

Example:

**## Phase 3 — PARTIALLY COMPLETE**

Implementation:

\* Completed

Verification:

\* FAILED

Expected:

\* Expired session redirects to \`/login\`.

Actual:

\* Session is cleared but user remains on the current page.

Root cause:

\* Router redirect is not triggered after authentication state changes.

Next action:

\* Fix redirect handling and retest.

Do not mark the phase completed.

\---
**# 114. TEST IMPORTANT NEGATIVE CASES**

Do not test only the happy path.

Where relevant, verify:

\`\`\`text

valid input

invalid input

missing input

unauthorized access

forbidden access

missing record

duplicate request

external service failure

timeout

empty state

boundary values

\`\`\`

Only test realistic cases relevant to the requirement.

Do not create unnecessary test complexity.

\---
**# 115. TEST EXISTING BEHAVIOR AROUND THE CHANGE**

When changing existing code, test both:

\`\`\`text

NEW BEHAVIOR

\`\`\`

and important:

\`\`\`text

OLD BEHAVIOR THAT MUST STILL WORK

\`\`\`

Example:

If adding expired-token handling:

Test:

\`\`\`text

expired token → rejected

valid token → still accepted

missing token → existing behavior preserved

\`\`\`

This reduces accidental regression.

\---
**# 116. BUG FIXES SHOULD PREFER PERMANENT REGRESSION TESTS**

For bug fixes, prefer keeping a focused regression test when practical.

Workflow:

\`\`\`text

REPRODUCE BUG

     ↓

CREATE FAILING REGRESSION TEST

     ↓

CONFIRM TEST FAILS

     ↓

FIX ROOT CAUSE

     ↓

CONFIRM TEST PASSES

     ↓

KEEP REGRESSION TEST

\`\`\`

This is an exception to the rule of deleting temporary verification tests.

Reason:

A regression test protects the project from the same bug returning.

\---
**# 117. DO NOT WRITE TESTS ONLY TO DELETE ALL EVIDENCE**

Testing should improve confidence, not merely satisfy a procedural requirement.

If a test represents an important permanent behavior, do not delete it simply because the current implementation passed once.

Use judgment:

\`\`\`text

one-time diagnostic test

→ delete

important behavioral contract

→ keep

\`\`\`

\---
**# 118. CRITICAL FLOW TESTING**

Critical functionality requires stronger verification.

Examples:

\`\`\`text

authentication

authorization

payments

orders

data deletion

file storage

database migrations

permissions

security controls

production deployment

\`\`\`

For these areas, test:

\* expected success,

\* expected failure,

\* permission boundaries,

\* data integrity,

\* relevant regressions.

Do not rely on a single happy-path test.

\---
**# 119. DATABASE CHANGE VERIFICATION**

For database changes, verify when practical:

\`\`\`text

migration applies successfully

existing data remains valid

new writes work

new reads work

rollback behavior where required

constraints behave correctly

\`\`\`

Temporary databases or test fixtures may be removed after verification.

Migration files required for the project must NOT be deleted.

\---
**# 120. API CHANGE VERIFICATION**

For API changes, verify:

\`\`\`text

request validation

status code

response body

error response

authentication

authorization

existing client compatibility

\`\`\`

Do not verify only the internal service function.

Test the actual boundary when practical.

\---
**# 121. UI CHANGE VERIFICATION**

For UI changes, verify:

\`\`\`text

correct state is shown

expected action works

loading state works

error state works

empty state works when relevant

user interaction triggers expected behavior

backend integration works

\`\`\`

For visual changes, verify the rendered result when tooling allows.

\---
**# 122. FINAL DEFINITION OF DONE — UPDATED**

A task is complete only when:

\* the approved requirement is implemented,

\* relevant functionality has been tested,

\* actual expected behavior has been verified,

\* failed tests have been resolved or honestly reported,

\* temporary verification tests have been removed,

\* temporary debug files have been removed,

\* valuable regression tests have been preserved,

\* existing related behavior still works,

\* permanent tests pass,

\* lint passes when available,

\* type checks pass when available,

\* build passes when available,

\* final diff has been reviewed,

\* no accidental changes remain.

\---
**# 123. UPDATED PHASE WORKFLOW WITH TESTING**

Every implementation phase should follow:

\`\`\`text

PHASE START

     ↓

UNDERSTAND PHASE GOAL

     ↓

IMPLEMENT

     ↓

CREATE TEMPORARY VERIFICATION IF NEEDED

     ↓

TEST ACTUAL REQUIREMENT

     ↓

FAILED?

     ├── YES

     │     ↓

     │   FIND ROOT CAUSE

     │     ↓

     │   FIX

     │     ↓

     │   RETEST

     │     ↓

     │   REPEAT

     │

     └── NO

           ↓

     REQUIREMENT VERIFIED

           ↓

     DECIDE TEST TYPE

           ↓

     TEMPORARY?

       ├── YES → DELETE

       └── NO  → KEEP

           ↓

     REMOVE DEBUG ARTIFACTS

           ↓

     RUN FINAL RELEVANT CHECKS

           ↓

     REVIEW DIFF

           ↓

     REPORT PHASE

\`\`\`

\---
**# 124. FINAL TESTING PRINCIPLE**

Never confuse:

\`\`\`text

"I wrote the code."

\`\`\`

with:

\`\`\`text

"The requirement works."

\`\`\`

The correct workflow is:

\*\*Implement.

Run it.

Test it.

Compare it with the approved requirement.

Fix failures.

Retest.

Remove temporary test/debug artifacts.

Keep valuable regression tests.

Run final checks.

Only then report success.\*\*
