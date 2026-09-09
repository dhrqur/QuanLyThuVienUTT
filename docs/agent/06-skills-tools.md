# Installed Skills & Tool Usage

> Split from the original `AGENTS.md`. The numbered rule sections below are preserved verbatim.

**# 125. USE INSTALLED SKILLS WHEN RELEVANT**

Before starting a non-trivial task, the agent MUST check whether an installed skill, tool, plugin, workflow, or repository-specific capability is relevant to the task.

If a suitable skill already exists, prefer using it instead of manually recreating the same workflow.

The agent should not ignore available capabilities and immediately implement everything from scratch.

\---
**# 126. SKILL DISCOVERY BEFORE EXECUTION**

During the initial analysis phase:

1\. Understand the task.

2\. Inspect the available installed skills/tools.

3\. Identify skills that are relevant.

4\. Read the instructions for the selected skill when needed.

5\. Include the selected skill in the proposed plan.

6\. Use it during the appropriate phase.

Example:

\`\`\`text id="skill-flow-01"

Task:

Create or update a spreadsheet.

Available:

\- Spreadsheet skill

\- Document skill

\- Presentation skill

Correct:

→ Use the Spreadsheet skill.

Incorrect:

→ Manually build spreadsheet logic using unrelated tools while ignoring

  the installed spreadsheet capability.

\`\`\`

\---
**# 127. USE THE MOST SPECIFIC SKILL**

When multiple skills could perform the task, prefer the skill that is most specifically designed for the requested work.

Priority:

\`\`\`text id="skill-priority-01"

Most task-specific installed skill

        ↓

Repository-specific workflow/tool

        ↓

General-purpose tool

        ↓

Manual implementation

\`\`\`

Example:

\`\`\`text id="skill-example-01"

Need to create a presentation:

Preferred:

Presentation skill

Less preferred:

Generic document workflow

Incorrect:

Build a PPTX manually from scratch when an installed presentation skill

already handles the task appropriately.

\`\`\`

\---
**# 128. DO NOT FORCE A SKILL WHEN IT DOES NOT FIT**

Installed skills should be used when relevant.

Do NOT use a skill simply because it exists.

Before using a skill, verify:

\* it matches the requested task,

\* it supports the required operation,

\* it does not conflict with repository rules,

\* it does not add unnecessary complexity.

If the skill is unrelated or less suitable than the existing project workflow, do not force it.

\---
**# 129. READ SKILL INSTRUCTIONS BEFORE USING IT**

Do not assume how a skill works based only on its name.

When a skill contains usage instructions, read those instructions before using it.

Follow:

\* required workflow,

\* supported operations,

\* input/output requirements,

\* safety limitations,

\* required verification steps.

Do not invent unsupported behavior.

\---
**# 130. SKILL USAGE MUST APPEAR IN THE PLAN**

If a skill will materially affect the work, mention it in the plan.

Example:

**## Proposed Plan**

**### Phase 1 — Analyze repository**

\* Inspect current project structure.

\* Identify relevant implementation.

\* Check installed skills/tools.

**### Phase 2 — Use API testing skill**

\* Use the installed API testing workflow to verify endpoints.

\* Compare actual responses with approved requirements.

**### Phase 3 — Implementation**

\* Apply the smallest required code changes.

**### Phase 4 — Verification**

\* Run project tests.

\* Re-run API verification.

\* Remove temporary test artifacts.

This makes tool usage transparent to the user.

\---
**# 131. DO NOT REIMPLEMENT EXISTING SKILL CAPABILITIES WITHOUT REASON**

Avoid recreating functionality already provided by an installed skill.

Examples:

Do not manually:

\`\`\`text id="skill-no-reimplement"

build PDF generation logic

build spreadsheet formatting logic

build slide generation infrastructure

write custom browser automation

create custom deployment scripts

\`\`\`

if an installed, trusted, appropriate skill already provides that capability.

Exceptions:

\* the skill cannot satisfy the requirement,

\* the project requires a custom implementation,

\* the user explicitly requests manual implementation,

\* using the skill would create a worse or less maintainable result.

Explain the reason when intentionally not using an obvious relevant skill.

\---
**# 132. SKILLS DO NOT OVERRIDE PROJECT RULES**

Using an installed skill does NOT allow the agent to bypass:

\* plan approval,

\* phase workflow,

\* testing,

\* security rules,

\* scope restrictions,

\* destructive-action approval,

\* repository conventions.

Skills are execution helpers.

They do not replace engineering judgment.

\---
**# 133. SKILL OUTPUT MUST STILL BE REVIEWED**

Never assume output produced by a skill is automatically correct.

After using a skill:

1\. Inspect its output.

2\. Compare it with the approved requirement.

3\. Check for unrelated changes.

4\. Test the resulting behavior.

5\. Fix problems if necessary.

6\. Report what was verified.

A successful skill execution is NOT the same as a successful task.

\---
**# 134. VERIFY SKILL RESULTS**

Every skill-generated result must pass the same verification standards as manually written work.

Example:

\`\`\`text id="skill-verify-flow"

USE SKILL

   ↓

INSPECT OUTPUT

   ↓

COMPARE WITH REQUIREMENT

   ↓

RUN RELEVANT TESTS

   ↓

FAILED?

   ├── YES → FIX / RECONFIGURE → RETEST

   └── NO

         ↓

      CONTINUE

\`\`\`

Do not report success simply because:

\`\`\`text id="skill-bad-success"

"The skill completed successfully."

\`\`\`

Report whether the actual requirement was satisfied.

\---
**# 135. SKILL SELECTION SHOULD MINIMIZE COMPLEXITY**

When choosing between:

\`\`\`text id="skill-choice"

A. Existing installed skill

B. Custom code

C. New dependency

D. New framework

\`\`\`

prefer the solution that:

\* satisfies the requirement,

\* introduces the least maintenance burden,

\* fits existing project conventions,

\* is easiest to understand,

\* is easiest to verify.

Do not add new dependencies when an installed capability already solves the problem cleanly.

\---
**# 136. REUSE SKILLS ACROSS PHASES WHEN APPROPRIATE**

A skill may be used in multiple phases if useful.

Example:

\`\`\`text id="skill-phases"

Phase 1:

Use repository search skill to understand existing implementation.

Phase 2:

Implement approved changes.

Phase 3:

Use testing skill to verify behavior.

Phase 4:

Use review/static-analysis skill to inspect final changes.

\`\`\`

Do not restrict skills to only one phase when they can safely improve the workflow.

\---
**# 137. REPORT SKILLS USED**

At the end of each relevant phase, include:

\`\`\`text id="skill-report-template"

Skills/tools used:

\- [skill/tool name]

Purpose:

\- ...

Result:

\- ...

\`\`\`

If no special skill was needed:

\`\`\`text id="skill-no-use"

Skills/tools used:

\- None required.

\`\`\`

This keeps the workflow transparent.

\---
**# 138. REPORT WHY AN OBVIOUS SKILL WAS NOT USED**

If a clearly relevant installed skill exists but the agent chooses not to use it, briefly explain why.

Example:

\`\`\`text id="skill-not-used"

Available skill:

\- Database migration skill

Not used because:

\- The repository already contains a project-specific migration command

  that must be used to preserve migration history.

\`\`\`

Do not silently ignore an obvious task-specific capability.

\---
**# 139. SKILL FAILURE HANDLING**

If a skill fails:

1\. Read the failure.

2\. Determine whether configuration, input, or the skill itself caused it.

3\. Do not repeatedly retry without understanding the issue.

4\. Try a reasonable fix when safe.

5\. If another installed skill is more appropriate, consider it.

6\. If the plan must materially change, stop and report to the user.

Do not silently switch to a completely different approach if that materially changes the approved plan.

\---
**# 140. DO NOT INSTALL NEW SKILLS WITHOUT NEED**

The existence of a skill ecosystem does not mean new skills should be installed for every task.

Prefer already-installed and trusted capabilities.

Do not install or enable new:

\* plugins,

\* skills,

\* extensions,

\* packages,

\* external integrations,

unless needed and allowed by the user/environment.

If installation creates security, permission, or dependency implications, ask before proceeding.

\---
**# 141. SKILL SECURITY**

Treat installed skills as privileged tools.

Before using a skill that can:

\* modify files,

\* access credentials,

\* send messages,

\* modify cloud resources,

\* deploy code,

\* delete resources,

\* access production systems,

ensure the operation is within the approved scope.

Destructive or externally visible actions still require the appropriate approval.

\---
**# 142. LEAST-PRIVILEGE SKILL USAGE**

Use only the capabilities required for the task.

Do not give a skill broader access or perform broader actions than necessary.

Example:

If a skill only needs to read logs:

\`\`\`text id="skill-least-privilege"

Correct:

→ Read logs.

Incorrect:

→ Also restart services, modify configuration, or deploy changes

  without requirement.

\`\`\`

\---
**# 143. SKILL-FIRST DOES NOT MEAN BLIND AUTOMATION**

The purpose of using skills is to improve quality, consistency, and efficiency.

It is NOT permission to blindly automate decisions.

The agent remains responsible for:

\* understanding the task,

\* choosing the correct skill,

\* reviewing the output,

\* testing the result,

\* following approved scope,

\* reporting failures honestly.

\---
**# 144. UPDATED INITIAL ANALYSIS WORKFLOW**

Every non-trivial task should begin with:

\`\`\`text id="initial-skill-flow"

USER REQUEST

     ↓

UNDERSTAND REQUEST

     ↓

INSPECT REPOSITORY

     ↓

CHECK AVAILABLE SKILLS / TOOLS

     ↓

SELECT RELEVANT SKILLS

     ↓

READ THEIR INSTRUCTIONS

     ↓

IDENTIFY UNCLEAR REQUIREMENTS

     ↓

ASK SIMPLE QUESTIONS

     ↓

CREATE PHASED PLAN

     ↓

MENTION SKILLS TO BE USED

     ↓

USER APPROVAL

     ↓

EXECUTION

\`\`\`

\---
**# 145. UPDATED PHASE REPORT FORMAT**

Each phase report should now include:

**## Phase X Completed — [Phase Name]**

Status:

\* COMPLETED

Implemented:

\* ...

Files inspected/changed:

\* ...

Skills/tools used:

\* ...

Why they were used:

\* ...

Requirement verified:

\* Yes / No

Tests performed:

\* ...

Test result:

\* PASS / FAIL

Temporary test files removed:

\* ...

Unexpected findings:

\* None / ...

Plan still valid:

\* Yes / No

Next phase:

\* ...

\---
**# 146. FINAL SKILL PRINCIPLE**

Before doing work manually, ask:

\`\`\`text id="skill-final-question"

"Is there already an installed skill or project-specific tool designed

for this task?"

\`\`\`

If yes and it is appropriate:

**\*\*Use it.\*\***

Then:

\*\*Inspect its result.

Test the result.

Verify it matches the requirement.

Report how it was used.\*\*

Installed skills should improve the workflow, not replace engineering judgment.

When in doubt:

**\*\*Understand first. Ask clearly. Plan first. Get approval. Make the smallest correct change. Test it. Review it.\*\***
