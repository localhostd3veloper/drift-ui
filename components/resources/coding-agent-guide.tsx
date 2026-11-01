import Link from "next/link"

import { DocSection } from "@/components/docs/doc-section"
import { Commands, Table } from "@/components/resources/article-blocks"
import { siteConfig } from "@/lib/site-config"

export function CodingAgentGuide() {
  return (
    <>
      <p>
        A coding agent can read a repo, write a change and run the tests. It
        can’t answer for the pull request, so that part stays with you.
      </p>
      <p>
        Maintainers notice when nobody did. In an October 2026{" "}
        <a href="https://www.linuxfoundation.org/press/new-lf-research-survey-shows-generative-ai-cuts-open-source-coding-time-in-half-but-25-of-incoming-pull-requests-are-considered-ai-slop">
          Linux Foundation study
        </a>
        , an estimated 25% of incoming pull requests were low quality, and{" "}
        <Link href="/resources/what-is-open-source">
          Hacktoberfest stopped counting pull requests
        </Link>{" "}
        in 2026 partly because AI tools made junk so easy to send.
      </p>

      <DocSection id="check-the-rules" title="Check the project’s rules first">
        <p>
          Policies vary a lot.{" "}
          <a href="https://ziglang.org/code-of-conduct/">Zig</a> bans LLM use
          across its repos and chat. drift-ui allows coding agents, and{" "}
          <a href={`${siteConfig.repo}/blob/main/CONTRIBUTING.md`}>
            CONTRIBUTING.md
          </a>{" "}
          asks you to review agent output the same way you would review your own
          code.
        </p>
        <p>
          Read the contributing guide and code of conduct before you start. If
          neither mentions AI, ask on the issue.
        </p>
      </DocSection>

      <DocSection
        id="agents-md"
        title="Give the agent the project’s instructions"
      >
        <p>
          <a href="https://agents.md/">AGENTS.md</a> is an open format for
          telling coding agents how a project works, like a README written for
          them. The Agentic AI Foundation stewards it under the Linux
          Foundation, and tools including Codex, Cursor, Gemini CLI and VS Code
          support it.
        </p>
        <p>
          <a href={`${siteConfig.repo}/blob/main/AGENTS.md`}>drift-ui’s file</a>{" "}
          holds the commands, where each kind of file lives, the issue workflow,
          and the rules reviewers enforce. If your tool doesn’t load it on its
          own, tell the agent to read it first. In Claude Code, one command runs
          the workflow from start to finish:
        </p>
        <Commands code="/work-on-issue <number>" />
      </DocSection>

      <DocSection id="who-does-what" title="Who does what">
        <p>
          That workflow stops and asks you at each point that matters. Keep the
          same split with any agent.
        </p>
        <Table label="What the agent and the contributor each do">
          <thead>
            <tr>
              <th>Stage</th>
              <th>The agent</th>
              <th>You</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Choose</td>
              <td>Lists open issues</td>
              <td>Pick one you understand</td>
            </tr>
            <tr>
              <td>Understand</td>
              <td>Summarizes the ask, lists files and open questions</td>
              <td>
                Check the summary against the issue and answer the questions
              </td>
            </tr>
            <tr>
              <td>Claim</td>
              <td>Asks before doing anything public</td>
              <td>Decide, and comment on the issue</td>
            </tr>
            <tr>
              <td>Implement</td>
              <td>Reads similar code, writes the change and tests</td>
              <td>Watch what it touches and stop it if it wanders</td>
            </tr>
            <tr>
              <td>Verify</td>
              <td>Runs typecheck, lint and tests</td>
              <td>Run the app and try it, including with the keyboard</td>
            </tr>
            <tr>
              <td>Open the pull request</td>
              <td>Summarizes the diff and asks before pushing</td>
              <td>Read every line, then approve the push</td>
            </tr>
          </tbody>
        </Table>
      </DocSection>

      <DocSection id="review-it" title="Review it like your name is on it">
        <p>Your name is on it. Before you push:</p>
        <ul>
          <li>Read the whole diff, not the agent’s summary of it.</li>
          <li>
            Break the code on purpose and confirm a test fails. A test that
            can’t fail proves nothing.
          </li>
          <li>
            Look for edits nobody asked for: renamed variables, reformatted
            files, a new dependency.
          </li>
          <li>
            Open the page in the browser. Tests don’t see a broken layout.
          </li>
          <li>
            Check that you can explain each change. If you can’t, ask the agent
            until you can, or cut it.
          </li>
        </ul>
      </DocSection>

      <DocSection id="stays-human" title="What stays with you">
        <p>
          Answer review comments yourself. A reviewer who asks why you did
          something wants your reasoning, and a pasted reply wastes both your
          time. If the honest answer is that the agent chose it and you don’t
          know why, go and find out.
        </p>
        <p>
          Work on one issue at a time, and tick only the checklist boxes for
          checks that really ran. Our template doesn’t ask, but saying you used
          an agent helps a reviewer know where to look.
        </p>
      </DocSection>

      <DocSection id="using-components" title="Using drift-ui from an agent">
        <p>
          Installing components is a separate job, and it has its own docs for
          agents. <a href="/llms.txt">llms.txt</a> lists the components,{" "}
          <a href="/llms-full.txt">llms-full.txt</a> adds props and usage
          examples, and the <Link href="/#install">install section</Link> has a
          prompt you can copy into your agent.
        </p>
      </DocSection>
    </>
  )
}
