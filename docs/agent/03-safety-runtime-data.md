# Safety, Security, Runtime, Database & Git

> Split from the original `AGENTS.md`. The numbered rule sections below are preserved verbatim.

**# 22. ERROR HANDLING**

Do not ignore errors.

Never use empty error handling like:

\`\`\`text

try {

  ...

} catch {

}

\`\`\`

unless intentionally justified.

Errors should be:

\* handled,

\* propagated,

\* logged appropriately,

\* or converted into meaningful domain errors.

Error messages should provide enough context to debug the problem without exposing sensitive information.

\---
**# 23. FAIL EXPLICITLY**

Prefer obvious failure over silent incorrect behavior.

Do not silently:

\* swallow exceptions,

\* replace invalid values,

\* ignore missing data,

\* continue after critical failures,

\* invent defaults for important business decisions.

If input is invalid, return an explicit error when appropriate.

\---
**# 24. VALIDATION**

Validate data at system boundaries.

Examples:

\* API requests,

\* user input,

\* environment variables,

\* external API responses,

\* uploaded files,

\* database input where appropriate.

Do not spread duplicate validation everywhere.

Validate at logical boundaries.

\---
**# 25. SECURITY**

Treat all external input as untrusted.

Never intentionally introduce:

\* SQL injection,

\* command injection,

\* XSS,

\* unsafe deserialization,

\* path traversal,

\* hardcoded secrets,

\* authentication bypass,

\* authorization bypass.

Never log:

\* passwords,

\* access tokens,

\* refresh tokens,

\* private keys,

\* sensitive credentials.

Use existing security mechanisms whenever available.

\---
**# 26. SECRET MANAGEMENT**

Never hardcode:

\`\`\`text

API keys

passwords

tokens

private keys

production credentials

\`\`\`

Use environment variables or the project's existing secret-management system.

Never commit \`.env\` secrets.

\---
**# 27. AUTHORIZATION BEFORE ACTION**

Authentication answers:

"Who is this user?"

Authorization answers:

"Is this user allowed to perform this action?"

Do not confuse them.

For protected actions, verify permissions at the trusted backend boundary.

Never rely only on frontend hiding or disabled buttons for authorization.

\---
**# 28. DATABASE SAFETY**

Database changes require extra caution.

Before changing schema:

\* understand current schema,

\* inspect existing migrations,

\* consider existing data,

\* consider rollback,

\* consider backward compatibility.

Never:

\* delete production data,

\* drop tables,

\* truncate tables,

\* rewrite large datasets,

without explicit user approval.

\---
**# 29. DESTRUCTIVE ACTIONS REQUIRE APPROVAL**

Never execute destructive operations without explicit approval.

Examples:

\`\`\`text

rm -rf

DROP DATABASE

DROP TABLE

TRUNCATE

git reset --hard

git clean -fd

force push

delete production resources

remove migrations

delete user data

\`\`\`

Explain the impact first.

Ask for approval.

\---
**# 30. GIT SAFETY**

Do not:

\* force push,

\* rewrite shared history,

\* delete branches,

\* reset unrelated work,

\* discard user changes,

unless explicitly requested.

Never overwrite existing uncommitted user work.

If unexpected modifications exist, preserve them.

\---
**# 50. EXTERNAL API RULE**

When using external services:

\* handle timeouts,

\* handle failures,

\* validate responses,

\* consider retries where appropriate,

\* avoid infinite retries,

\* avoid duplicate side effects,

\* preserve useful error context.

Do not assume external APIs always return valid responses.

\---
**# 51. IDEMPOTENCY**

For operations that may be retried, consider whether duplicate execution can cause problems.

Examples:

\* payments,

\* emails,

\* webhook processing,

\* job queues,

\* account creation.

Add idempotency protection when the business flow requires it.

\---
**# 52. CONCURRENCY**

When code can execute concurrently, consider:

\* race conditions,

\* duplicate processing,

\* lost updates,

\* shared mutable state,

\* locking,

\* transaction boundaries.

Do not introduce concurrency unless it provides a clear benefit.

\---
