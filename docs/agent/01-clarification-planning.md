# Clarification & Planning

> Split from the original `AGENTS.md`. The numbered rule sections below are preserved verbatim.

**# 3. CLARIFICATION-FIRST RULE**

Never silently guess important requirements.

If something can materially change:

\* architecture,

\* API behavior,

\* database schema,

\* UI behavior,

\* business logic,

\* authentication,

\* permissions,

\* external integrations,

\* data format,

\* backward compatibility,

\* deployment,

\* security,

ask before implementing.

Continue clarification until you understand the task well enough to explain:

\* What needs to change?

\* Why does it need to change?

\* What should happen after the change?

\* What should NOT change?

\* Which users/features are affected?

\* What edge cases matter?

\* How will success be verified?

\---
**# 4. KEEP QUESTIONS SIMPLE**

Questions to the user must be easy to understand.

Do NOT ask unnecessarily technical questions when a simpler question can communicate the same thing.

Bad:

"Should the persistence abstraction maintain transactional semantics across the existing repository layer?"

Better:

"Nếu lưu dữ liệu bị lỗi giữa chừng, bạn muốn hủy toàn bộ thay đổi hay vẫn giữ phần đã lưu?"

Bad:

"Should this endpoint maintain backward-compatible response semantics?"

Better:

"API cũ có cần tiếp tục trả dữ liệu giống hiện tại không?"

Rules:

\* Prefer short questions.

\* Ask one topic at a time.

\* Use simple language.

\* Avoid unnecessary jargon.

\* Give examples when useful.

\* If there are multiple choices, present 2–4 clear options.

\* Recommend one option when appropriate.

\* Explain consequences briefly.

Example:

"Bạn muốn khi token hết hạn:

A. Tự đăng xuất người dùng — khuyên dùng

B. Tự refresh token

C. Hiện thông báo rồi để người dùng đăng nhập lại"

\---
**# 5. DO NOT ASK QUESTIONS THAT CODE CAN ANSWER**

Clarification does NOT mean asking the user everything.

Before asking a technical question:

1\. Inspect the repository.

2\. Search existing implementations.

3\. Read configuration.

4\. Read relevant tests.

5\. Check existing conventions.

Do NOT ask things such as:

\* "Project dùng framework gì?"

\* "File này nằm đâu?"

\* "Project dùng npm hay pnpm?"

\* "Có test framework chưa?"

when the repository already contains the answer.

Ask the user only when human intent or product decisions are required.

\---
**# 6. REQUIRED PRE-IMPLEMENTATION SUMMARY**

Before presenting the plan, summarize your understanding using this format:

**## Understanding**

Goal:

\* ...

Current behavior:

\* ...

Expected behavior:

\* ...

Affected areas:

\* ...

Must NOT change:

\* ...

Important assumptions:

\* ...

Open questions:

\* None

Do not proceed to planning while important open questions remain.

\---
**# 7. REQUIRED IMPLEMENTATION PLAN**

Before coding, produce a concrete plan.

Example:

**## Proposed Plan**

1\. Inspect the current authentication flow.

2\. Update token validation logic.

3\. Extract reusable token helper if necessary.

4\. Update error handling.

5\. Add/update unit tests.

6\. Run relevant tests.

7\. Review the final diff for unrelated changes.

Files likely affected:

\* \`src/auth/service.ts\`

\* \`src/auth/token.ts\`

\* \`tests/auth.test.ts\`

Risks:

\* Existing clients may depend on the old error response.

Out of scope:

\* Changing login UI.

\* Changing database structure.

Then ask:

"Approve this plan?"

Do not implement before approval.

\---
