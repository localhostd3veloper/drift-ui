import Link from "next/link"

import { DocSection } from "@/components/docs/doc-section"
import {
  Callout,
  Commands,
  Step,
  StepList,
  Table,
} from "@/components/resources/article-blocks"
import { siteConfig } from "@/lib/site-config"

const FORK_COMMANDS = `git clone https://github.com/<you>/<project>.git
cd <project>
git remote add upstream https://github.com/<owner>/<project>.git
git switch -c fix/123-install-command`

const PUSH_COMMANDS = `git add README.md
git commit -m "docs: fix install command"
git push -u origin HEAD`

export function OpenSourceGuide() {
  return (
    <>
      <p>
        You can make your first open source contribution this week, and it can
        be a one-line docs fix. If you have run <code>git commit</code> or{" "}
        <code>npm install</code>, you already depend on open source: Git,
        Node.js and React are public code that anyone can read and change.
      </p>

      <DocSection id="what-open-source-means" title="What open source means">
        <p>
          Open source software is published with its source code under a license
          that lets anyone use, study, change and share it. The license is what
          counts. A public GitHub repo with no license is still under{" "}
          <a href="https://choosealicense.com/no-permission/">
            exclusive copyright
          </a>
          : you can view and fork it on GitHub, but that gives you no right to
          use or modify the code.
        </p>
        <p>
          The Open Source Initiative publishes the{" "}
          <a href="https://opensource.org/osd">Open Source Definition</a>, a
          list of ten criteria. Two of them catch people out: a license cannot
          restrict who uses the software or what field they use it in. So “free
          for non-commercial use” is not open source, even when the code is
          public.
        </p>
        <p>
          You will also hear “free software”. That term comes from the Free
          Software Foundation, whose{" "}
          <a href="https://www.gnu.org/philosophy/free-sw.en.html">
            definition
          </a>{" "}
          lists four freedoms: to run a program, to study and change it, to
          share copies, and to share your changed versions. The “free” is about
          liberty, as in free speech, and has nothing to do with price.
        </p>
        <p>Licenses fall into two broad groups:</p>
        <Table label="Open source license types">
          <thead>
            <tr>
              <th>Type</th>
              <th>Examples</th>
              <th>What it asks of you</th>
              <th>Used by</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Permissive</td>
              <td>MIT, Apache-2.0, BSD</td>
              <td>Keep the copyright and license notice</td>
              <td>React (MIT), Kubernetes (Apache-2.0)</td>
            </tr>
            <tr>
              <td>Copyleft</td>
              <td>GPL, AGPL, MPL</td>
              <td>
                Share your changes under the same license when you distribute
                the software
              </td>
              <td>Linux (GPL-2.0), Firefox (MPL-2.0)</td>
            </tr>
          </tbody>
        </Table>
      </DocSection>

      <DocSection id="why-contribute" title="Why contribute">
        <p>
          A merged pull request is public proof of work. Anyone can read your
          code, the review comments, and what you changed after feedback. A line
          on a resume can’t show that.
        </p>
        <p>
          You also practice what coursework skips: reading a codebase you didn’t
          write, running someone else’s test suite, and taking review from a
          stranger. And if a library you use has a bug that annoys you, you can
          fix it yourself.
        </p>
      </DocSection>

      <DocSection
        id="non-code-contributions"
        title="You don’t have to write code"
      >
        <p>
          We would take a bug report with exact reproduction steps over a
          drive-by refactor every time. Projects also need:
        </p>
        <ul>
          <li>Docs fixes, especially from someone who just got confused</li>
          <li>Translations</li>
          <li>A failing test that proves a reported bug</li>
          <li>Issue triage, like confirming a bug still happens</li>
        </ul>
      </DocSection>

      <DocSection
        id="how-a-contribution-works"
        title="How a contribution works"
      >
        <p>
          The flow is the same on almost every GitHub project. You copy the repo
          to your account, change your copy, and ask the project to pull your
          change in.
        </p>
        <StepList>
          <Step title="Pick a project you use">
            <p>
              You already know what it does. Check that it’s alive: recent
              commits, and pull requests that get replies.
            </p>
          </Step>
          <Step title="Find an issue">
            <p>
              Filter by the <code>good first issue</code> label. Skip anything
              already assigned or linked to an open pull request.
            </p>
          </Step>
          <Step title="Read the rules">
            <p>
              Most projects have a <code>CONTRIBUTING.md</code> that covers
              setup, tests and how to claim work. Read it before you touch code.
            </p>
          </Step>
          <Step title="Claim the issue">
            <p>
              Comment that you’re taking it, so two people don’t do the same
              work.
            </p>
          </Step>
          <Step title="Fork, clone and branch">
            <p>Click Fork on GitHub, then:</p>
            <Commands code={FORK_COMMANDS} />
          </Step>
          <Step title="Make the change and run the tests">
            <p>
              Change only what the issue asks for. Then commit and push to your
              fork:
            </p>
            <Commands code={PUSH_COMMANDS} />
          </Step>
          <Step title="Open the pull request">
            <p>
              GitHub shows a{" "}
              <a href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork">
                Compare &amp; pull request
              </a>{" "}
              banner on the original repo. Say what changed and why, add a
              screenshot for visual changes, and write <code>Closes #123</code>{" "}
              so the issue closes on merge.
            </p>
          </Step>
          <Step title="Answer the review">
            <p>
              Maintainers will ask for changes, and that’s normal. Push fixes to
              the same branch and the pull request updates on its own.
            </p>
          </Step>
        </StepList>
      </DocSection>

      <DocSection
        id="hacktoberfest"
        title="What Hacktoberfest is, and what changed in 2026"
      >
        <p>
          Hacktoberfest is a month-long open source event held every October.{" "}
          <a href="https://dev.to/0shuvo0/hacktoberfest-2026-what-changed-1g3g">
            DigitalOcean ran it from 2014 through 2025
          </a>
          , and for most of that time the deal was simple: get pull requests
          accepted in October and earn a T-shirt.
        </p>
        <p>
          The shirt caused the event’s worst year. In 2020,{" "}
          <a href="https://developerrelations.com/case-studies/overcoming-hacktoberfest-spam">
            a viral YouTube video
          </a>{" "}
          showed people how to submit low-effort pull requests to reach the four
          needed for a shirt, and thousands copied it. Maintainers were buried
          in junk. Within days the organizers made the event opt-in: a repo had
          to add the <code>hacktoberfest</code> topic, and a pull request
          counted only once a maintainer accepted it.
        </p>
        <p>
          In 2026 the rule went away entirely. The{" "}
          <a href="https://hacktoberfest.com/questions/">official FAQ</a> says
          “pull requests and merge requests will no longer count toward
          Hacktoberfest rewards”. MLH and DEV now manage the event in
          partnership with DigitalOcean, and{" "}
          <a href="https://blog.mlh.com/everything-you-need-to-know-about-hacktoberfest-2026-ai-belongs-to-everyone-mdk">
            MLH’s announcement
          </a>{" "}
          gives the reason: AI tools make low-effort pull requests easy to
          generate, and maintainers were paying for it.
        </p>
        <p>
          The 2026 edition ran on virtual stickers, earned by attending local
          Fests, joining livestreams and Global Hack Week, and entering DEV
          Challenges. Three stickers got you a sticker pack in the mail. Its
          theme was “AI belongs to everyone”, with a focus on open-weight
          models.
        </p>
        <Callout title="A guide that says “four pull requests” is out of date">
          <p>
            Check <a href="https://hacktoberfest.com/">hacktoberfest.com</a> for
            next year’s rules. The FAQ still encourages open source work, and no
            project needs you to wait for October.
          </p>
        </Callout>
      </DocSection>

      <DocSection
        id="paid-programs"
        title="Programs that pay you to contribute"
      >
        <p>
          Once you have a few merged pull requests, these programs are worth an
          application. Check each site for current dates and terms.
        </p>
        <Table label="Paid open source programs">
          <thead>
            <tr>
              <th>Program</th>
              <th>Who it’s for</th>
              <th>What you get</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <a href="https://developers.google.com/open-source/gsoc/faq">
                  Google Summer of Code
                </a>
              </td>
              <td>Students and open source beginners, 18 or older</td>
              <td>
                A 90, 175 or 350 hour project with a mentor.{" "}
                <a href="https://developers.google.com/open-source/gsoc/help/student-stipends">
                  Stipends
                </a>{" "}
                run from $750 to $6,600 by project size and country. India’s are
                $750, $1,500 and $3,000.
              </td>
            </tr>
            <tr>
              <td>
                <a href="https://docs.linuxfoundation.org/lfx/mentorship">
                  LFX Mentorship
                </a>
              </td>
              <td>People who want to work under a project mentor</td>
              <td>
                A mentored term on a Linux Foundation program. Check each
                listing for its length and stipend.
              </td>
            </tr>
            <tr>
              <td>
                <a href="https://www.outreachy.org/">Outreachy</a>
              </td>
              <td>
                People who face under-representation, systemic bias or
                discrimination in tech where they live
              </td>
              <td>
                A three-month remote internship with a $7,000 stipend, starting
                in May or December
              </td>
            </tr>
          </tbody>
        </Table>
      </DocSection>

      <DocSection
        id="closed-pull-requests"
        title="How not to get your pull request closed"
      >
        <ul>
          <li>
            Don’t skip the claim. Work that duplicates an open pull request gets
            closed however good it is.
          </li>
          <li>
            Keep one issue to one pull request. A fix bundled with a reformatted
            file is hard to review.
          </li>
          <li>
            Don’t open a pull request just to have one. Adding your name to a
            README or rewording a sentence that was fine is how Hacktoberfest
            got its spam problem.
          </li>
          <li>
            Read the project’s AI policy. In an October 2026{" "}
            <a href="https://www.linuxfoundation.org/press/new-lf-research-survey-shows-generative-ai-cuts-open-source-coding-time-in-half-but-25-of-incoming-pull-requests-are-considered-ai-slop">
              Linux Foundation study
            </a>
            , an estimated 25% of incoming pull requests were low quality, and
            some projects have responded with bans:{" "}
            <a href="https://ziglang.org/code-of-conduct/">Zig</a> bans LLM use
            across its repos and chat. Where AI tools are allowed, you still own
            the result. If you can’t explain every line of the diff, don’t open
            it.
          </li>
          <li>
            Give maintainers time. Many are volunteers, so wait a few days
            before you follow up, and follow up once.
          </li>
        </ul>
      </DocSection>

      <DocSection id="start-with-drift-ui" title="Start with drift-ui">
        <p>
          drift-ui is an MIT-licensed set of React components that shadcn/ui
          doesn’t ship, and it was built to take first-time contributors. The
          smallest contribution is a new example on a component’s docs page,
          which means one file and one list entry.
        </p>
        <p>
          Pick from the{" "}
          <a
            href={`${siteConfig.repo}/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22`}
          >
            good first issues
          </a>
          , follow{" "}
          <a href={`${siteConfig.repo}/blob/main/CONTRIBUTING.md`}>
            CONTRIBUTING.md
          </a>
          , and ask on <a href={siteConfig.discord}>Discord</a> if you get
          stuck. A maintainer reads every pull request, and once yours merges,
          your handle goes on the{" "}
          <Link href="/contributors">contributors page</Link>.
        </p>
      </DocSection>
    </>
  )
}
