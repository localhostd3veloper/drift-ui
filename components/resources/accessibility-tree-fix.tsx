import Image from "next/image"

import { DocSection } from "@/components/docs/doc-section"
import {
  Callout,
  CodeSample,
  Commands,
  Table,
} from "@/components/resources/article-blocks"
import { siteConfig } from "@/lib/site-config"

const FIX_PR = `${siteConfig.repo}/pull/56`
const WEB_DEV_TREE = "https://web.dev/articles/the-accessibility-tree"
const LABEL_IN_NAME =
  "https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html"
const GOOD_FIRST_ISSUES = `${siteConfig.repo}/labels/good%20first%20issue`

const LIGHTHOUSE_COMMAND = `npx lighthouse https://your-site.dev \\
  --only-categories=accessibility,agentic-browsing \\
  --view`

const NAME_BEFORE_AND_AFTER = `// Before: the name is "Status value", the button shows "Open"
<button aria-label={\`\${field.label} value\`}>
  <ValueLabel text={label} />
</button>

// After: the name is "Status value: Open"
<button>
  <span className="sr-only">{field.label} value:</span>{" "}
  <ValueLabel text={label} />
</button>`

const REVEAL_KEYFRAMES = `@keyframes reveal-in {
  from {
    transform: translate3d(0, 24px, 0);
  }
}`

export function AccessibilityTreeFix() {
  return (
    <>
      <p>
        We ran Lighthouse on the drift-ui home page and got 88 for
        Accessibility. Agentic Browsing passed two of its three checks, and the
        third said “Accessibility tree is not well-formed.”
      </p>
      <p>
        Those two results had one cause. The failing check is built from the
        same accessibility rules, so fixing the tree fixed both. Here’s what
        failed, what we changed in <a href={FIX_PR}>pull request #56</a>, and
        which numbers didn’t move.
      </p>

      <DocSection id="what-the-tree-is" title="What the accessibility tree is">
        <p>
          The browser turns the DOM into a smaller tree for assistive technology
          to read. <a href={WEB_DEV_TREE}>web.dev’s explainer</a> is a good
          short introduction. Each node has a role, a name and sometimes a
          state, so a filter button might read as{" "}
          <code>button &quot;Status value: Open&quot;</code>.
        </p>
        <p>
          Screen readers announce those nodes. AI agents use the same tree to
          work out what’s on a page, which is why Lighthouse now checks it in a
          second category.
        </p>
        <p>
          To see yours, inspect an element in Chrome DevTools and open the
          Accessibility tab in the Elements panel.
        </p>
      </DocSection>

      <DocSection id="every-page" title="Audit more than the home page">
        <p>
          The home page showed five failing elements. Running all 74 component
          pages showed more. 24 of them scored below 100, nearly all because of
          the footer wordmark, and the rest of the report listed bugs in
          components people install from the registry. If we’d stopped at the
          home page, those bugs would have stayed in other people’s projects.
        </p>
        <Table label="Failures and fixes">
          <thead>
            <tr>
              <th>Failure</th>
              <th>Where</th>
              <th>Fix</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Button with no name</td>
              <td>Landing page stepper</td>
              <td>
                Hide titles with <code>sr-only</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>aria-controls</code> pointing nowhere
              </td>
              <td>Stepper without panels</td>
              <td>Leave the attribute off</td>
            </tr>
            <tr>
              <td>Visible text missing from the name</td>
              <td>Five registry components, two site controls</td>
              <td>Keep the text, add a hidden prefix</td>
            </tr>
            <tr>
              <td>Role the element can’t have</td>
              <td>Mention textarea</td>
              <td>Use the built-in textbox role</td>
            </tr>
            <tr>
              <td>Low contrast</td>
              <td>Footer, scroll animation, tabs, a demo card</td>
              <td>Different for each, covered below</td>
            </tr>
          </tbody>
        </Table>
      </DocSection>

      <DocSection id="no-name" title="A step with no name">
        <p>
          The stepper on our landing page hid its inactive titles on narrow
          screens with <code>hidden</code>. That removes them from the tree too.
          A completed step shows only a check icon, so its button had no text
          left and no name.
        </p>
        <p>
          Swapping to <code>sr-only</code> kept the same look and put the name
          back. Use <code>hidden</code> when content should disappear for
          everyone, and <code>sr-only</code> when it should only disappear from
          the screen.
        </p>
      </DocSection>

      <DocSection id="missing-panel" title="An ID that pointed nowhere">
        <p>
          The stepper is built on Radix Tabs, and each tab sets{" "}
          <code>aria-controls</code> to the ID of its panel. Our landing page
          stepper has no panels, so the active tab referenced an element that
          didn’t exist.
        </p>
        <p>
          The fix went into the component. <code>StepperContent</code> now tells
          the stepper it exists, and tabs only set the attribute once it does.
          Every stepper without panels gets the fix, including the ones in other
          people’s apps.
        </p>
      </DocSection>

      <DocSection id="visible-text" title="Names that hid the visible text">
        <p>
          This was the biggest group. Our filter chip showed “Open” but was
          named “Status value”, because <code>aria-label</code> replaces the
          button’s text entirely. Color picker, inline edit, phone input and
          shortcut recorder had the same problem.
        </p>
        <p>
          It matters for voice control. Someone who sees “Open” on screen will
          say “click Open”, and that fails if “Open” isn’t in the name. WCAG
          calls this <a href={LABEL_IN_NAME}>Label in Name</a>. Lighthouse lists
          the check but doesn’t count it toward the score, so a page can hit 100
          with this bug still in it. Read the full report as well as the number.
        </p>
        <CodeSample title="filter-chip.tsx" code={NAME_BEFORE_AND_AFTER} />
        <p>
          With a hidden prefix the name is built from what’s on screen, so the
          two can’t drift apart when the value changes.
        </p>
      </DocSection>

      <DocSection id="wrong-role" title="A role a textarea can’t have">
        <p>
          Mention textarea set <code>role=&quot;combobox&quot;</code> on a{" "}
          <code>&lt;textarea&gt;</code>. ARIA in HTML doesn’t allow that, and it
          was the last failure holding Agentic Browsing back on{" "}
          <code>/themes</code>.
        </p>
        <p>
          We removed the role and kept <code>aria-autocomplete</code> and{" "}
          <code>aria-activedescendant</code>, which the built-in textbox role
          supports. <code>aria-expanded</code> had to go, because textboxes
          don’t support it.
        </p>
      </DocSection>

      <DocSection id="contrast" title="Contrast that depended on scrolling">
        <p>
          Our <code>reveal</code> scroll animation faded sections in. A section
          resting at the bottom of the screen stayed partly transparent until
          you scrolled, which put text on <code>/contributors</code> at 2:1
          contrast. The animation now only moves content, so text is readable
          from the first frame.
        </p>
        <CodeSample title="globals.css" code={REVEAL_KEYFRAMES} />
        <p>
          The next audit flagged the inactive tabs in our Principles section at
          3.66:1, which hadn’t shown up before, so we raised those too. Rerun
          the audit after every fix, because one failure can hide another.
        </p>
        <p>
          The footer wordmark was a different case. It’s decorative and already
          had <code>aria-hidden</code>, but the contrast check still measured
          it. We moved the text into a CSS <code>::before</code>, where it looks
          the same and isn’t page text anymore. That’s only fair for text that
          really is decoration.
        </p>
      </DocSection>

      <DocSection id="results" title="What the scores did">
        <p>
          These runs use Lighthouse Metrics, which tests the live site on mobile
          from six regions. Each column is one run.
        </p>
        <Table label="Lighthouse results before and after">
          <thead>
            <tr>
              <th>Check</th>
              <th>Before</th>
              <th>After</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Accessibility</td>
              <td>88</td>
              <td>100</td>
            </tr>
            <tr>
              <td>Agentic Browsing</td>
              <td>2 of 3</td>
              <td>3 of 3</td>
            </tr>
            <tr>
              <td>Best Practices and SEO</td>
              <td>100</td>
              <td>100</td>
            </tr>
            <tr>
              <td>Performance</td>
              <td>58 to 77</td>
              <td>59 to 76</td>
            </tr>
            <tr>
              <td>Total Blocking Time</td>
              <td>422 ms to 2.6 s</td>
              <td>402 ms to 2 s</td>
            </tr>
            <tr>
              <td>Largest Contentful Paint</td>
              <td>1.9 s to 3.9 s</td>
              <td>3.7 s to 4 s</td>
            </tr>
          </tbody>
        </Table>
        <figure className="flex flex-col gap-3">
          <Image
            src="/images/resources/accessibility-tree-fix-scores.png"
            alt="Lighthouse report for drift-ui.dev showing 32 of 32 accessibility audits, 4 of 4 best practices, 5 of 5 SEO and 2 of 2 agentic browsing audits passing."
            width={1160}
            height={355}
            sizes="(min-width: 1024px) 720px, 100vw"
            className="rounded-2xl border"
          />
          <figcaption className="text-sm text-muted-foreground">
            Lighthouse in DevTools on the live site after the fix.
          </figcaption>
        </figure>
        <Callout title="Fractions mean Snapshot mode">
          <p>
            That screenshot shows fractions because it’s a Snapshot run, which
            audits the page as it stands. It doesn’t load the page, so it can’t
            tell you anything about speed. Use Navigation mode for a Performance
            score.
          </p>
        </Callout>
      </DocSection>

      <DocSection id="what-didnt-change" title="What didn’t improve">
        <p>
          Performance barely moved, and the accessibility work was never going
          to change it. We also turned off link prefetching for heavy routes,
          which took the home page from 813 KiB to 534 KiB in a local build. On
          Lighthouse Metrics, US West reported 33 requests and 542 kB both
          before and after, so we can’t claim that saving for production yet.
        </p>
        <p>
          Total Blocking Time is the main cost, and it comes from hydrating the
          landing page. We tried <code>content-visibility</code> on its sections
          and rendering time halved, but blocking time stayed the same, so we
          dropped it. The real fix is to ship less client JavaScript.
        </p>
        <p>
          Largest Contentful Paint went up in three regions. These are single
          runs and we haven’t found the cause, so it’s the next thing to look
          at.
        </p>
        <p>
          The same page scored Performance 100 when we ran Lighthouse on a
          laptop, and 59 to 76 from cloud machines. A fast computer hides slow
          pages, so test from somewhere closer to your users.
        </p>
        <p>
          A perfect Accessibility score has limits as well. The report itself
          says automated checks find only some issues, and it lists ten things
          to check by hand. Lighthouse and our unit tests covered this work. A
          pass with a real screen reader is still on our list.
        </p>
      </DocSection>

      <DocSection id="try-it" title="Try it on your project">
        <p>
          This runs the same two categories from your terminal and opens the
          report:
        </p>
        <Commands code={LIGHTHOUSE_COMMAND} />
        <p>
          Run it on an inner page as well as your home page. To practice on a
          real codebase, our <a href={GOOD_FIRST_ISSUES}>good first issues</a>{" "}
          are open to you.
        </p>
      </DocSection>
    </>
  )
}
