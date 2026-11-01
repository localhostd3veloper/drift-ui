import { DocSection } from "@/components/docs/doc-section"
import { Callout, Commands, Table } from "@/components/resources/article-blocks"
import { siteConfig } from "@/lib/site-config"

const PHONE_INPUT_PR = `${siteConfig.repo}/pull/38`

const LOCAL_CHECKS = `bun run format
bun run typecheck
bun run lint
bun run test`

export function FirstPrReview() {
  return (
    <>
      <p>
        A good first pull request answers a reviewer’s questions before they
        ask. To show what that means, we’ll use a real one:{" "}
        <a href={PHONE_INPUT_PR}>pull request #38</a>, which added the phone
        input.
      </p>
      <Callout title="What this example can’t show">
        <p>
          One of us wrote #38, so it merged without a review thread, and at 29
          changed files it is far bigger than your first pull request should be.
          drift-ui went public on October 31 and no outside contributor has
          merged yet, so yours would be the first to get the full read.
        </p>
      </Callout>

      <DocSection id="closes-an-issue" title="It closes an issue">
        <p>
          The description of #38 opens with “Closes #10”. We read the issue
          first, because <a href={`${siteConfig.repo}/issues/10`}>issue #10</a>{" "}
          says what done looks like: a component, a preview, tests, keyboard and
          screen reader behavior checked, and updated agent docs. Then we hold
          your diff up against that list.
        </p>
        <p>
          Writing <code>Closes #10</code> also closes the issue when the pull
          request merges, so nobody has to do it by hand.
        </p>
      </DocSection>

      <DocSection id="what-and-why" title="The description says what and why">
        <p>
          We can read the diff. The description should say what the diff can’t.
          #38 shows the API in four lines of code, then explains the one
          behavior a reviewer would question: the field hides the dial code
          because the country button already shows it.
        </p>
      </DocSection>

      <DocSection id="scope" title="It stays in scope">
        <p>
          This is where #38 is a warning. It also reworked the docs pages, which
          issue #10 never asked for. The description flags this with “This goes
          beyond #10, so please review it separately”, and flagging it was
          right, but your pull request should cover one issue and nothing else.
          A second pull request is easier to review and easier to merge.
        </p>
      </DocSection>

      <DocSection id="dependencies" title="New dependencies come with a reason">
        <p>
          Issue #10 left one question open: use <code>libphonenumber-js</code>{" "}
          or ship a small metadata set? #38 picks the library and gives its
          reasons with numbers: about 36 KB gzipped for metadata on 245
          countries, and a hand-kept set would go stale. That’s the level of
          detail we want for any new dependency.
        </p>
      </DocSection>

      <DocSection id="tests" title="Tests cover the keyboard">
        <p>
          The rule in{" "}
          <a href={`${siteConfig.repo}/blob/main/CONTRIBUTING.md`}>
            CONTRIBUTING.md
          </a>{" "}
          is to test keyboard interaction, not only clicks. #38 added over 80
          tests. One of them types <code>germany</code> into the country picker,
          presses Enter, and checks that the number the user typed survives the
          switch.
        </p>
      </DocSection>

      <DocSection id="ci" title="CI passes">
        <p>
          <a href={`${siteConfig.repo}/blob/main/.github/workflows/ci.yml`}>
            CI
          </a>{" "}
          runs on every pull request, so a failure here is the first thing we
          see.
        </p>
        <Table label="CI steps">
          <thead>
            <tr>
              <th>Step</th>
              <th>What it catches</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Format</td>
              <td>Files Prettier would change</td>
            </tr>
            <tr>
              <td>Typecheck</td>
              <td>Type errors, against Radix and Base UI</td>
            </tr>
            <tr>
              <td>Lint</td>
              <td>ESLint rule failures</td>
            </tr>
            <tr>
              <td>Test</td>
              <td>A failing Vitest suite, after a registry build</td>
            </tr>
            <tr>
              <td>Build</td>
              <td>Anything that stops the site from building</td>
            </tr>
          </tbody>
        </Table>
        <p>Run the same checks before you push:</p>
        <Commands code={LOCAL_CHECKS} />
      </DocSection>

      <DocSection id="known-gaps" title="It says what you didn’t do">
        <p>
          The best part of #38 is a section called Known gaps. It says the
          keyboard flow was checked but not with a real screen reader, that
          rejected input is announced to screen readers while sighted users see
          nothing, and that JavaScript per docs page grew from 480.6 KB to 511.5
          KB gzipped.
        </p>
        <p>
          A gap you name is something we can decide on together. You won’t lose
          points for writing one down, and only tick the checklist boxes for
          things you actually ran.
        </p>
      </DocSection>

      <DocSection id="screenshots" title="Visual changes have screenshots">
        <p>
          #38 attaches three screenshots, covering dark and light mode. For any
          visual change, add a before and after or a short recording so we can
          see it without checking out your branch.
        </p>
      </DocSection>

      <DocSection id="if-you-get-stuck" title="If you get stuck">
        <p>
          You don’t need all of this finished to ask for help. Open a draft pull
          request with what you have and ask there, or ask on{" "}
          <a href={siteConfig.discord}>Discord</a>. If nobody has replied after
          a few days, say so in Discord too.
        </p>
      </DocSection>
    </>
  )
}
