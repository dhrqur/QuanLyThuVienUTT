# Clean Code, Architecture & Maintainability

> Split from the original `AGENTS.md`. The numbered rule sections below are preserved verbatim.

**# 10. CLEAN CODE PRINCIPLES**

Code should be understandable by a developer who recently graduated.

Prefer code that is:

\* obvious,

\* explicit,

\* easy to debug,

\* easy to modify,

\* easy to test,

\* easy to delete,

\* easy to reuse when reuse is actually needed.

Avoid clever solutions.

A simple solution that takes 20 lines is often better than a clever solution that takes 5 lines but requires explanation.

\---
**# 11. JUNIOR-FRIENDLY CODE**

Write code that a junior developer can follow without needing deep knowledge of advanced patterns.

Prefer:

\`\`\`text

validateInput()

createUser()

sendWelcomeEmail()

\`\`\`

over complicated abstraction chains.

Avoid unnecessary:

\* metaprogramming,

\* reflection,

\* decorators,

\* complex generics,

\* advanced functional tricks,

\* inheritance trees,

\* factories,

\* dependency injection layers,

\* design patterns used only for appearance.

Use advanced techniques only when the existing project already depends on them or the problem clearly requires them.

\---
**# 12. SINGLE RESPONSIBILITY**

A function should have one clear responsibility.

A module/file should represent one coherent concept.

Avoid functions that:

\* validate data,

\* query database,

\* transform data,

\* send email,

\* update analytics,

all at once.

Split responsibilities where it improves understanding and maintenance.

Do not split code just to make files artificially small.

\---
**# 13. FUNCTION DESIGN**

Functions should normally:

\* have descriptive names,

\* perform one task,

\* have limited side effects,

\* have predictable inputs and outputs,

\* be easy to test independently.

Avoid extremely long functions.

If a function requires excessive scrolling to understand, consider splitting it into meaningful helpers.

Do not create meaningless helpers such as:

\`\`\`text

executeProcess()

performAction()

handleThing()

doLogic()

\`\`\`

Names should explain intent.

\---
**# 14. NAMING RULES**

Use names that describe business intent.

Bad:

\`\`\`text

data

tmp

result2

obj

arr

x

process()

handle()

manager

helper

utils2

\`\`\`

Better:

\`\`\`text

activeUsers

invoiceTotal

refreshToken

calculateShippingFee()

validatePassword()

\`\`\`

Avoid abbreviations unless they are widely understood in the project.

\---
**# 15. FILE ORGANIZATION**

Organize code by responsibility or feature.

Keep related logic close together.

Avoid giant generic folders containing unrelated code.

Prefer structures such as:

\`\`\`text

users/

  user.service.ts

  user.repository.ts

  user.validation.ts

  user.types.ts

\`\`\`

when appropriate for the existing project.

Do not reorganize the repository unless necessary.

Follow the project's existing structure before introducing a new structure.

\---
**# 16. REUSABILITY**

Reuse code when there is real duplication or a clearly shared concept.

Do NOT create abstractions only because something might become reusable later.

Before extracting reusable code, ask:

\* Is this logic actually used more than once?

\* Is this the same business concept?

\* Will extracting it make the code easier to understand?

\* Does the abstraction have a clear name?

Duplication is sometimes cheaper than a bad abstraction.

\---
**# 17. MODULARITY**

Separate logic so bugs can be isolated and fixed without affecting unrelated components.

Prefer:

\`\`\`text

Controller

   ↓

Service

   ↓

Repository

\`\`\`

when this matches the project's architecture.

Keep:

\* business logic,

\* database access,

\* UI logic,

\* external APIs,

\* validation,

reasonably separated.

Do not create unnecessary architectural layers.

\---
**# 18. DEPENDENCY RULE**

Do not add a new dependency without a good reason.

Before adding a package:

1\. Check whether the project already has something suitable.

2\. Check whether the standard library can solve it simply.

3\. Consider implementing small logic locally.

4\. Evaluate maintenance and security impact.

If adding a dependency is necessary, explain why.

Never add a large package for a trivial function.

\---
**# 19. EXISTING CONVENTIONS FIRST**

Before writing code, inspect how the repository already handles similar problems.

Follow existing:

\* naming,

\* formatting,

\* folder structure,

\* error handling,

\* testing style,

\* architecture,

\* state management,

\* API patterns,

\* logging.

Do not introduce a completely different style unless explicitly approved.

Repository consistency is usually more important than personal preference.

\---
**# 20. READ BEFORE EDIT**

Never edit a file without understanding its surrounding context.

Before modifying important logic:

\* read the relevant file,

\* inspect callers,

\* inspect dependencies,

\* inspect related tests,

\* understand data flow.

Do not modify a function based only on its name.

\---
**# 21. SEARCH BEFORE CREATING**

Before creating:

\* helper,

\* utility,

\* service,

\* component,

\* hook,

\* type,

\* interface,

\* validation,

\* API client,

search the repository for an existing equivalent.

Avoid duplicate implementations.

\---
**# 37. COMMENTS**

Comments should explain WHY, not repeat WHAT the code obviously does.

Bad:

\`\`\`text

// Increment index

index++;

\`\`\`

Useful:

\`\`\`text

// Retry once because this provider occasionally returns a stale token

// immediately after token rotation.

\`\`\`

If code requires many comments to explain what it does, simplify the code.

\---
**# 38. DOCUMENTATION**

Update documentation when your change affects:

\* public APIs,

\* setup steps,

\* environment variables,

\* CLI commands,

\* configuration,

\* important workflows.

Do not update documentation unrelated to the task.

\---
**# 39. API COMPATIBILITY**

Do not break an existing public interface unless the user explicitly approves the breaking change.

Consider:

\* old clients,

\* frontend consumers,

\* integrations,

\* stored data,

\* URLs,

\* event payloads.

Prefer backward-compatible changes when practical.

\---
**# 40. PERFORMANCE**

Do not optimize without evidence.

Correctness and readability come first.

However, avoid obviously inefficient behavior such as:

\`\`\`text

N+1 database queries

unbounded loops

loading huge datasets unnecessarily

repeated expensive API calls

repeated parsing

unnecessary network requests

\`\`\`

If performance optimization makes code significantly more complex, explain the tradeoff.

\---
**# 41. NO PREMATURE ABSTRACTION**

Do not immediately introduce:

\* factories,

\* strategies,

\* adapters,

\* generic repositories,

\* base classes,

\* plugin systems,

\* event buses,

\* complex dependency injection,

for simple problems.

Start with the simplest clear implementation.

Abstract when actual requirements justify abstraction.

\---
**# 42. KISS**

Keep It Simple.

When two solutions satisfy the same requirement, prefer the one with:

\* fewer moving parts,

\* fewer files,

\* fewer dependencies,

\* easier debugging,

\* easier reading.

\---
**# 43. DRY — WITH CAUTION**

Avoid harmful duplication.

But do not blindly apply DRY.

Two pieces of code that look similar are not necessarily the same concept.

Only combine them when they are expected to change for the same reason.

\---
**# 44. YAGNI**

Do not build functionality that is not required.

Do not add:

\* future configuration,

\* speculative hooks,

\* unused interfaces,

\* unused extension points,

\* generic frameworks,

without an actual requirement.

\---
**# 45. SOLID — PRACTICAL, NOT DOGMATIC**

Use SOLID principles when they improve maintainability.

Do not use SOLID as an excuse to create excessive layers.

Practical readability beats theoretical architectural purity.

\---
**# 46. EXPLICIT OVER MAGIC**

Prefer explicit code.

Avoid behavior that is difficult to trace.

A developer should be able to answer:

"Where does this value come from?"

without navigating through many hidden layers.

\---
**# 47. SIDE EFFECT CONTROL**

Keep side effects near system boundaries when practical.

Business logic should preferably be easy to test without:

\* network,

\* database,

\* filesystem,

\* global mutable state.

Separate pure calculations from I/O when this improves clarity.

\---
**# 48. CONFIGURATION**

Do not make everything configurable.

Configuration increases complexity.

Create configuration only when different environments/users genuinely require different values.

Use sensible defaults for non-critical choices.

Never silently create defaults for security-sensitive behavior.

\---
**# 49. LOGGING**

Logging should help diagnose problems.

Useful logs usually contain:

\* operation,

\* relevant identifier,

\* failure reason,

\* useful context.

Avoid excessive logging.

Never expose sensitive information.

\---
**# 53. EDGE CASES**

Before finishing, consider:

\* empty input,

\* null/undefined,

\* malformed input,

\* duplicate requests,

\* missing records,

\* network failure,

\* timeout,

\* partial failure,

\* unauthorized users,

\* concurrent actions,

\* large inputs,

\* Unicode where relevant.

Do not add unnecessary handling for impossible states, but do not ignore realistic edge cases.

\---
