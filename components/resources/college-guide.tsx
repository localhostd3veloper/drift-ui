import Link from "next/link"

import { DocSection } from "@/components/docs/doc-section"
import { Callout, Table } from "@/components/resources/article-blocks"
import { siteConfig } from "@/lib/site-config"

export function CollegeGuide() {
  return (
    <>
      <p>
        You don’t need a free summer to start. Two or three hours a week across
        one semester can get a pull request merged, if you pick something small
        and start early.
      </p>
      <p>
        This post covers the college side: planning around classes and exams,
        what your student status gets you, and how to put the work on a resume.
        For what open source is and how a pull request works, read{" "}
        <Link href="/resources/what-is-open-source">our first guide</Link>.
      </p>

      <DocSection id="semester-plan" title="A plan for one semester">
        <p>
          Move the weeks around your own calendar, but keep the free stretch.
          Everyone’s plan slips somewhere.
        </p>
        <Table label="Week by week semester plan">
          <thead>
            <tr>
              <th>Weeks</th>
              <th>Do this</th>
              <th>Done when</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1–2</td>
              <td>Set up Git, GitHub and your student benefits</td>
              <td>You can push to a repo of your own</td>
            </tr>
            <tr>
              <td>3–4</td>
              <td>Pick one project and run it locally</td>
              <td>Its tests pass on your machine</td>
            </tr>
            <tr>
              <td>5–6</td>
              <td>Send a docs fix or a small example</td>
              <td>Your first pull request is open</td>
            </tr>
            <tr>
              <td>7–8</td>
              <td>Leave this free for midterms</td>
              <td>Nothing due</td>
            </tr>
            <tr>
              <td>9–12</td>
              <td>Claim a small bug or feature</td>
              <td>A pull request with a test is open</td>
            </tr>
            <tr>
              <td>13–14</td>
              <td>Answer the review and finish</td>
              <td>It’s merged</td>
            </tr>
            <tr>
              <td>After exams</td>
              <td>Write down what you did</td>
              <td>Your resume links to the pull request</td>
            </tr>
          </tbody>
        </Table>
      </DocSection>

      <DocSection id="student-benefits" title="Claim your student benefits">
        <p>
          Do this in week one. The{" "}
          <a href="https://education.github.com/pack">
            GitHub Student Developer Pack
          </a>{" "}
          includes free GitHub Pro while you’re a student, GitHub Copilot
          Student for verified students, and a free annual JetBrains
          subscription. Offers change, so check the page for the current list.
        </p>
      </DocSection>

      <DocSection id="pick-a-project" title="Pick a project you’ll stick with">
        <p>
          Start with something you already use, in a language you’re already
          taking. A library from your coursework or side project is better than
          a famous repo, because you already know what it should do.
        </p>
        <p>
          Before you commit, check three things: open issues labeled{" "}
          <code>good first issue</code>, a <code>CONTRIBUTING.md</code>, and
          pull requests that get replies within a week or two. Skip any repo
          whose main activity is people adding their names to a list.
        </p>
      </DocSection>

      <DocSection id="exams" title="When exams get in the way">
        <p>
          They will. If you’ve claimed an issue and can’t finish, comment and
          say so. Nobody minds, and silence is what blocks the next person. Push
          what you have as a draft pull request, and someone can pick it up, or
          you can when you’re back.
        </p>
        <p>
          Don’t claim a big issue the week before exams, and don’t start on a
          deadline. Maintainers review on their own time, so a pull request you
          need merged by Friday probably won’t be.
        </p>
      </DocSection>

      <DocSection id="friends" title="Do it with a friend or a club">
        <p>
          Reading a friend’s diff before they open it is good practice, and you
          catch each other’s mistakes first. If your college has a coding club,
          run one session where everyone picks an issue and gets the project
          running together. Setup is the part most people quit at.
        </p>
        <p>
          If you enjoy running those,{" "}
          <a href="https://githubcampus.expert/">GitHub Campus Experts</a> is a
          program for students who build tech communities at their schools.
        </p>
      </DocSection>

      <DocSection id="coursework" title="Keep coursework out of it">
        <p>
          Don’t publish solutions to graded assignments, even with the names
          changed, and check your college’s rules before you use class work in a
          public repo. If you want open source to count toward a project or
          credit, ask your instructor before you start.
        </p>
      </DocSection>

      <DocSection id="resume" title="Put it on your resume">
        <p>
          Link the merged pull request, and say what changed. “Contributed to
          open source” tells a recruiter nothing, while a link lets them read
          your code and the review. Replace this made-up example with what you
          really did:
        </p>
        <Callout title="Example resume line">
          <p>
            drift-ui (open source React components): fixed keyboard focus in the
            tree view and added a regression test. Link to the pull request.
          </p>
        </Callout>
        <p>
          One real pull request you can talk about in an interview beats ten
          typo fixes.
        </p>
      </DocSection>

      <DocSection id="dates" title="Dates for your calendar">
        <p>
          Paid programs have fixed windows and you want a merged pull request
          before they open. Check each site for the coming year’s dates.
        </p>
        <Table label="Open source program dates">
          <thead>
            <tr>
              <th>Program</th>
              <th>When</th>
              <th>What to do before</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <a href="https://developers.google.com/open-source/gsoc/timeline">
                  Google Summer of Code
                </a>
              </td>
              <td>
                In 2026: organizations announced February 19, applications March
                16–31, coding from May 25
              </td>
              <td>
                Start talking to an organization as soon as the list is out
              </td>
            </tr>
            <tr>
              <td>
                <a href="https://www.outreachy.org/">Outreachy</a>
              </td>
              <td>Internships run May to August and December to March</td>
              <td>Check if you’re eligible and watch for the next round</td>
            </tr>
            <tr>
              <td>
                <a href="https://hacktoberfest.com/">Hacktoberfest</a>
              </td>
              <td>Every October</td>
              <td>
                Check the rules, since 2026 stopped counting pull requests
              </td>
            </tr>
          </tbody>
        </Table>
      </DocSection>

      <DocSection id="start-here" title="Where to start this week">
        <p>
          Claim your student benefits, then pick a project. drift-ui is built to
          take first-timers: browse the{" "}
          <a href={`${siteConfig.repo}/labels/good%20first%20issue`}>
            good first issues
          </a>{" "}
          or say hello on <a href={siteConfig.discord}>Discord</a>.
        </p>
      </DocSection>
    </>
  )
}
