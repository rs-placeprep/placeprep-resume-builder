import { ArrowUpRight, Check, X } from 'lucide-react'
import { AppHeader } from '@/components/app-header'
import { AppFooter } from '@/components/app-footer'
import { GuideCoverArt } from '@/components/guide-cover-art'
import { GuideToc } from '@/components/guide-toc'
import { GuideResumeCompare } from '@/components/guide-resume-compare'
import { StripedPattern } from '@/components/ui/striped-pattern'

function Bad({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-red-500/25 bg-red-500/[0.05] p-3">
      <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
      <p className="m-0 text-sm leading-relaxed text-foreground/85">{children}</p>
    </div>
  )
}

function Good({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.05] p-3">
      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
      <p className="m-0 text-sm leading-relaxed text-foreground/85">{children}</p>
    </div>
  )
}

function Compare({ bad, good }: { bad: React.ReactNode; good: React.ReactNode }) {
  return (
    <div className="my-5 grid gap-2.5 sm:grid-cols-2">
      <Bad>{bad}</Bad>
      <Good>{good}</Good>
    </div>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="mb-3 mt-12 text-2xl font-bold tracking-tight">{title}</h2>
      {children}
    </section>
  )
}

const CONTENTS = [
  { id: 'what-recruiters-do', label: 'What actually happens to your resume' },
  { id: 'shape', label: 'The shape of a good resume' },
  { id: 'example', label: 'A real before and after' },
  { id: 'summary', label: 'The summary' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education and extras' },
  { id: 'numbers', label: 'Finding numbers when you think you have none' },
  { id: 'formatting', label: 'Formatting and typography' },
  { id: 'mistakes', label: 'Mistakes I see constantly' },
  { id: 'checklist', label: 'The final checklist' },
]

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader variant="guide" />

      <div className="relative overflow-hidden border-b border-border">
        <StripedPattern className="text-border/40 [mask-image:radial-gradient(600px_circle_at_50%_0%,white,transparent)]" />
        <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-primary">Resume tips</p>
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              What a good resume actually looks like
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Most resumes fail for the same small set of reasons. This is everything I wish someone had told me before
              I sent out my first hundred applications.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <a
                href="https://rohansrma.me"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
              >
                Rohan Sharma
              </a>
              <span>·</span>
              <span>Founder, R&apos;s PlacePrep</span>
              <span>·</span>
              <span>12 min read</span>
            </div>
          </div>

          <div className="mt-8 sm:mt-10">
            <GuideCoverArt title="What a good resume actually looks like" />
          </div>
        </div>
      </div>

      <main className="mx-auto grid min-w-0 max-w-[1400px] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_240px] lg:py-14">
        <article className="mx-auto w-full min-w-0 max-w-3xl">
          <p className="text-lg leading-relaxed text-foreground/90">
            I have written resumes that got ignored and resumes that got replies within hours. The content of my career
            barely changed between the two. What changed was how much of it was <em>verifiable</em>.
          </p>

          <p className="mt-4 leading-relaxed text-foreground/80">
            A resume is not an autobiography and it is not a personality test. It is a short evidence document. Every
            line either gives someone a reason to talk to you or takes up space that a better line could have used.
            That is the entire game.
          </p>

          <Section id="what-recruiters-do" title="What actually happens to your resume">
            <p className="leading-relaxed text-foreground/80">
              Two things read your resume, usually in this order. First, an applicant tracking system parses it into
              structured fields. If your PDF is an image, or your layout uses multiple columns and text boxes, the
              parser mangles it and your experience section can arrive empty.
            </p>
            <p className="mt-4 leading-relaxed text-foreground/80">
              Second, a human skims it. Not reads, skims. Six to ten seconds on the first pass, and in that window they
              are looking for three things: does this person do the kind of work we need, have they done it at real
              scale, and is there a number anywhere that proves it. If none of those land, you are in the no pile before
              anyone has read your third bullet.
            </p>
            <p className="mt-4 leading-relaxed text-foreground/80">
              Everything below follows from that. Write for a parser and a skimmer, not for a careful reader who does
              not exist.
            </p>
          </Section>

          <Section id="shape" title="The shape of a good resume">
            <p className="leading-relaxed text-foreground/80">
              One page. Single column. Sections in the order of what makes you hireable. For a student or a fresher
              that usually means:
            </p>
            <ol className="mt-4 space-y-1.5 pl-5 leading-relaxed text-foreground/80 [list-style:decimal]">
              <li>Name and contact details</li>
              <li>Summary, two or three lines</li>
              <li>Experience, if you have any</li>
              <li>Projects</li>
              <li>Skills</li>
              <li>Education</li>
              <li>Achievements or certifications, only the relevant ones</li>
            </ol>
            <p className="mt-4 leading-relaxed text-foreground/80">
              If you have two or more real internships, experience goes above projects. If your projects are stronger
              than your internships, flip them. The rule is simple: the strongest evidence goes highest, because the
              skim starts at the top and stops early.
            </p>
          </Section>

          <Section id="example" title="A real before and after">
            <p className="leading-relaxed text-foreground/80">
              Same person, same experience, same projects. The only thing that changed is how specific and verifiable
              every line is. This is the exact difference between a resume that gets skimmed and ignored, and one that
              gets a reply.
            </p>
            <GuideResumeCompare />
            <p className="leading-relaxed text-foreground/80">
              Notice the before version is not badly written, it just hedges everywhere: vague adjectives, a bullet
              list of skills nobody can verify, an email address that looks unprofessional, and duties instead of
              outcomes. The after version says less overall and lands harder, because every line either proves scale,
              proves difficulty, or proves impact.
            </p>
          </Section>

          <Section id="summary" title="The summary">
            <p className="leading-relaxed text-foreground/80">
              Your summary has one job: make the next ten seconds worth spending. Three sentences, maximum. Who you
              are, your single strongest proof point with a number in it, and what you are looking for.
            </p>
            <p className="mt-4 leading-relaxed text-foreground/80">
              The adjectives everyone uses, like hardworking, passionate, detail-oriented and quick learner, carry zero
              information because nobody has ever written the opposite. Delete them and use the space for a fact.
            </p>

            <Compare
              bad={
                <>
                  &ldquo;Passionate and hardworking final-year CS student with a strong interest in web development and
                  a good grasp of data structures. Eager to learn and contribute to a dynamic team.&rdquo;
                </>
              }
              good={
                <>
                  &ldquo;Final-year CS student who has shipped two production apps, one used by 500+ students with 1M+
                  requests in its first 60 days. Solved 400+ DSA problems, currently 1850 on LeetCode. Looking for a
                  backend SDE role.&rdquo;
                </>
              }
            />

            <p className="leading-relaxed text-foreground/80">
              Both are three sentences. The second one tells a recruiter you can ship, you handle traffic, and you can
              pass a DSA screen. The first one tells them nothing they could not assume about any applicant.
            </p>
          </Section>

          <Section id="experience" title="Experience">
            <p className="leading-relaxed text-foreground/80">
              This is where most resumes quietly collapse into a job description. People list what they were assigned
              instead of what changed because they were there.
            </p>
            <p className="mt-4 leading-relaxed text-foreground/80">Use this pattern for every bullet:</p>
            <p className="my-4 rounded-xl border border-border bg-muted/40 p-4 text-sm font-medium leading-relaxed">
              Action verb → what you built or changed → the measurable result → how you did it
            </p>

            <Compare
              bad={<>&ldquo;Worked on the backend team and helped improve website performance.&rdquo;</>}
              good={
                <>
                  &ldquo;Cut API p95 latency from 820ms to 210ms by adding Redis caching and eliminating N+1 queries
                  across the 12 highest-traffic endpoints.&rdquo;
                </>
              }
            />

            <Compare
              bad={<>&ldquo;Responsible for writing tests and fixing bugs in the application.&rdquo;</>}
              good={
                <>
                  &ldquo;Raised test coverage from 41% to 78% across 60+ modules, cutting production incidents from
                  roughly 6 to 1 per month.&rdquo;
                </>
              }
            />

            <p className="leading-relaxed text-foreground/80">
              Notice what the good versions share. They contain a before and an after. They name the technique, so a
              technical interviewer has something to ask about. And they are falsifiable, which is exactly why they are
              believed.
            </p>
            <p className="mt-4 leading-relaxed text-foreground/80">
              One more thing about the word <em>increased</em>. &ldquo;Increased website traffic by 60%&rdquo; is
              weaker than it looks, because it says nothing about what you actually did. The number sits there with no
              mechanism attached, and an interviewer cannot follow up on it. Write{' '}
              <em>
                &ldquo;Grew organic traffic 60% in 4 months by publishing 24 technical tutorials and rewriting the docs
                IA&rdquo;
              </em>{' '}
              instead. Same metric, but now it is a story about your work rather than a statistic that happened near
              you.
            </p>
            <p className="mt-4 leading-relaxed text-foreground/80">
              Three to four bullets per role. The fifth bullet is almost always your weakest one, and it drags the
              average down.
            </p>
          </Section>

          <Section id="projects" title="Projects">
            <p className="leading-relaxed text-foreground/80">
              For students and freshers, projects often carry more weight than internships, because they show what you
              do when nobody assigns you anything. But a project only counts if it shows evidence of engineering rather
              than evidence of following a tutorial.
            </p>
            <p className="mt-4 leading-relaxed text-foreground/80">Three things make a project entry land:</p>
            <ul className="mt-3 space-y-2 pl-5 leading-relaxed text-foreground/80 [list-style:disc]">
              <li>
                <span className="font-medium text-foreground">Real usage.</span> Users, requests, downloads, stars,
                anything that proves it left your laptop.
              </li>
              <li>
                <span className="font-medium text-foreground">A hard problem you solved.</span> Not &ldquo;built a CRUD
                app&rdquo; but the specific thing that was difficult and how you handled it.
              </li>
              <li>
                <span className="font-medium text-foreground">A stack that matches the job.</span> Trim the projects
                that do not, even if you are proud of them.
              </li>
            </ul>

            <Compare
              bad={
                <>
                  &ldquo;E-commerce Website: Built a full-stack e-commerce site using MERN stack with login, cart and
                  payment features.&rdquo;
                </>
              }
              good={
                <>
                  &ldquo;PlacePrep Tracker: Placement-prep platform for 500+ students across 3 colleges; handled 1M+
                  requests in 60 days. Built role-based exam access with Permit.io and cut quiz load times 4x with
                  cursor pagination.&rdquo;
                </>
              }
            />

            <p className="leading-relaxed text-foreground/80">
              The first one describes a tutorial that ten thousand other applicants also built. The second one
              describes an engineer. Same effort, different framing, and the framing is the part you control.
            </p>
            <p className="mt-4 leading-relaxed text-foreground/80">
              Link the repo or the live site. A recruiter who clicks is a recruiter who is interested, and a dead link
              is worse than no link at all.
            </p>
          </Section>

          <Section id="skills" title="Skills">
            <p className="leading-relaxed text-foreground/80">
              Group them by category and keep them honest. Languages, frameworks, tools. That is usually enough.
            </p>
            <p className="mt-4 leading-relaxed text-foreground/80">
              Do not list proficiency bars or star ratings, they are unverifiable and they eat space. Do not list
              twenty technologies you touched once in a weekend, because the interviewer picks the one you are weakest
              at and asks about it. Every item in that section is something you are volunteering to be tested on.
            </p>
            <p className="mt-4 leading-relaxed text-foreground/80">
              If a skill matters, it should also appear inside an experience or project bullet doing actual work. A
              skill that appears only in the skills list reads like a keyword, because that is usually what it is.
            </p>
          </Section>

          <Section id="education" title="Education and extras">
            <p className="leading-relaxed text-foreground/80">
              Degree, institution, years, and your CGPA if it is above roughly 7.5. Below that, leave it out and let
              your projects carry the page. Coursework lists are filler unless the role specifically asks for a subject
              you studied deeply.
            </p>
            <p className="mt-4 leading-relaxed text-foreground/80">
              Certifications and achievements belong at the bottom and only if they are relevant. A hackathon win, a
              competitive-programming rank, a real open-source contribution, a cloud certification for a cloud role:
              those earn their space. A generic six-hour course completion certificate does not.
            </p>
          </Section>

          <Section id="numbers" title="Finding numbers when you think you have none">
            <p className="leading-relaxed text-foreground/80">
              &ldquo;I do not have any metrics&rdquo; is the most common objection I hear, and it is almost never true.
              You have not measured them yet, which is a different problem with an easy fix. Go looking for:
            </p>
            <ul className="mt-3 space-y-2 pl-5 leading-relaxed text-foreground/80 [list-style:disc]">
              <li>Scale: users, requests, records, files, rows, concurrent sessions, repositories</li>
              <li>Time: build time, load time, latency, hours saved per week, deployment frequency</li>
              <li>Quality: test coverage, bug count, crash rate, incidents per month, review turnaround</li>
              <li>Reach: stars, forks, downloads, readers, attendees, community members</li>
              <li>Scope: team size, number of services touched, number of endpoints, features shipped</li>
            </ul>
            <p className="mt-4 leading-relaxed text-foreground/80">
              Open your analytics, your repo insights, your database, your project board. The numbers are sitting
              there. If something is genuinely unmeasurable, describe the scope and difficulty concretely instead.
              &ldquo;Migrated 40+ components from JavaScript to TypeScript with zero runtime regressions&rdquo; works
              perfectly well without a percentage.
            </p>
            <p className="mt-4 leading-relaxed text-foreground/80">
              Estimates are fine as long as they are honest and you can defend them in an interview. &ldquo;Roughly
              200 daily active users&rdquo; is far better than silence.
            </p>
          </Section>

          <Section id="formatting" title="Formatting and typography">
            <p className="leading-relaxed text-foreground/80">
              Good formatting is invisible. It should never be the thing someone notices. A few settings do most of the
              work:
            </p>
            <div className="my-5 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ['Font', 'Inter, Aptos, Helvetica, Arial, Source Sans 3, IBM Plex Sans, Roboto, Calibri, Georgia'],
                    ['Name', '20–24 pt, bold'],
                    ['Section headings', '11–12 pt, semibold'],
                    ['Body text', '10–10.5 pt'],
                    ['Dates and location', '9–9.5 pt'],
                    ['Line spacing', '1.05–1.15'],
                    ['Margins', '14–18 mm on all sides'],
                    ['Columns', 'One. Always.'],
                  ].map(([k, v]) => (
                    <tr key={k} className="border-b border-border last:border-0">
                      <td className="w-40 bg-muted/40 px-4 py-2.5 font-medium text-foreground">{k}</td>
                      <td className="px-4 py-2.5 text-foreground/80">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="leading-relaxed text-foreground/80">
              Export as a text-based PDF, never an image and never a screenshot. Open the file afterwards and try to
              select your name with the cursor. If you cannot highlight it, no parser can read it either, and you have
              effectively submitted a blank application.
            </p>
            <p className="mt-4 leading-relaxed text-foreground/80">
              Name the file properly too. <code className="rounded bg-muted px-1.5 py-0.5 text-[13px]">Rohan_Sharma_Resume.pdf</code>{' '}
              rather than <code className="rounded bg-muted px-1.5 py-0.5 text-[13px]">resume_final_v3_updated.pdf</code>.
            </p>
          </Section>

          <Section id="mistakes" title="Mistakes I see constantly">
            <ul className="mt-3 space-y-3 pl-5 leading-relaxed text-foreground/80 [list-style:disc]">
              <li>
                <span className="font-medium text-foreground">Writing duties instead of outcomes.</span> If your bullet
                could appear in the job posting, it is describing the role and not you.
              </li>
              <li>
                <span className="font-medium text-foreground">One resume for every application.</span> Reorder your
                projects and rewrite two bullets per role. Fifteen minutes of tailoring beats fifty untailored sends.
              </li>
              <li>
                <span className="font-medium text-foreground">Photos, graphics and colour blocks.</span> They break
                parsers, and in most markets a photo introduces bias you do not want.
              </li>
              <li>
                <span className="font-medium text-foreground">Padding to fill the page.</span> A dense two-thirds page
                beats a padded full page every time.
              </li>
              <li>
                <span className="font-medium text-foreground">Vague seniority words.</span> &ldquo;Led&rdquo; and
                &ldquo;spearheaded&rdquo; mean nothing without a team size or a scope attached.
              </li>
              <li>
                <span className="font-medium text-foreground">Typos in the first three lines.</span> Read it backwards,
                bullet by bullet. It breaks the autocomplete your brain runs when re-reading your own writing.
              </li>
              <li>
                <span className="font-medium text-foreground">Dead links.</span> Click every one before you send.
              </li>
            </ul>
          </Section>

          <Section id="checklist" title="The final checklist">
            <p className="leading-relaxed text-foreground/80">Before you send it anywhere, go line by line:</p>
            <ul className="mt-3 space-y-2 pl-5 leading-relaxed text-foreground/80 [list-style:disc]">
              <li>Does every bullet contain either a number or a concrete technical detail?</li>
              <li>Could a stranger tell what you actually built from the top third of the page alone?</li>
              <li>Is it one page, one column, with selectable text in the PDF?</li>
              <li>Have you removed every adjective that describes your personality rather than your work?</li>
              <li>Does the strongest thing you have ever done appear above the fold?</li>
              <li>Do the links work, and does the filename have your name in it?</li>
            </ul>
            <p className="mt-6 leading-relaxed text-foreground/80">
              If all six are yes, send it. Then keep a copy of every version you send, because six months from now you will want to know which one got replies.
            </p>
          </Section>

          <div className="mt-14 rounded-2xl border border-border bg-muted/30 p-6 sm:p-8">
            <h2 className="text-xl font-bold tracking-tight">Now go write it</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              The builder handles the formatting, the sizing and the ATS-safe PDF export, so you can spend your time on
              the part that actually matters: the words.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a href="/" className="btn-solid">
                Build my resume
              </a>
              <a
                href="https://placeprep.app"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1 rounded-xl border border-border px-4 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
              >
                Try now placeprep.app
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </article>

        <aside>
          <GuideToc items={CONTENTS} />
        </aside>
      </main>

      <AppFooter />
    </div>
  )
}
