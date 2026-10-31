---
name: work-on-issue
description: Pick up a drift-ui GitHub issue and take it to an open pull request. Use when asked to work on, fix, implement or pick up an issue, when given an issue number or URL, or when asked what to work on next.
argument-hint: "[issue-number]"
---

# Work on an issue

Issue: $ARGUMENTS

Follow "Working on a GitHub issue" in `AGENTS.md` step by step. This skill adds the order of operations and the checkpoints.

1. **Choose.** If no issue number was given, run the candidate queries from AGENTS.md step 1, show the top five with labels, and ask which one to take. Stop until the human answers.
2. **Understand.** `gh issue view <n> --comments`. Summarize the ask in three lines, list the files you expect to touch, and name any open questions. If anything about the API or behavior is unclear, ask now.
3. **Claim and branch.** Ask before assigning or commenting. Create `<type>/<n>-<slug>` from an up-to-date `main`.
4. **Implement.** For a `new component` issue, read two similar components in `registry/default/ui` first, then work through the seven-step checklist in AGENTS.md. Track each step as a todo so none is skipped. For a `bug`, write the failing test first.
5. **Verify.** Run typecheck, lint, test and `registry:build`. Fix failures and re-run until clean. Do not open the pull request with failures, and report any you could not fix.
6. **Show the work.** Before pushing, summarize the diff (`git diff main --stat`) and the verification results, and ask whether to push and open the pull request.
7. **Open the pull request.** Use the template, include `Closes #<n>`, tick only checks that ran, and give the human the URL.

There is nothing to edit to credit anyone. `/contributors` reads GitHub's contributors API, so a merged pull request adds its author.
