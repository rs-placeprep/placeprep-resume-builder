import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ResumeData, StyleSettings } from '@/types'
import { getFontStack } from '@/lib/fonts'
import { getTemplateSpec } from '@/lib/templates'

interface Props {
  data: ResumeData
  style: StyleSettings
  onOverflowChange?: (overflowing: boolean) => void
}

const A4_HEIGHT_PX = 1123
const A4_WIDTH_PX = 794
const PT_TO_PX = 96 / 72
const MIN_DENSITY = 0.62
const TOLERANCE = 0.004

interface FitState {
  lo: number
  hi: number
  probe: number
  settled: boolean
}

const INITIAL_FIT: FitState = { lo: MIN_DENSITY, hi: 1, probe: 1, settled: false }

export function ResumePreview({ data, style, onOverflowChange }: Props) {
  const contentRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const [widthScale, setWidthScale] = useState(1)
  const [fit, setFit] = useState<FitState>(INITIAL_FIT)
  const [fontEpoch, setFontEpoch] = useState(0)

  useLayoutEffect(() => {
    setFit(INITIAL_FIT)
  }, [data, style, fontEpoch])

  // Web fonts land after first paint and change the measured height, so re-run the fit once ready.
  useEffect(() => {
    let cancelled = false
    document.fonts?.ready.then(() => {
      if (!cancelled) setFontEpoch((n) => n + 1)
    })
    return () => {
      cancelled = true
    }
  }, [style.fontFamily])

  // Binary-searches the largest density that fits one page. A single proportional guess overshoots because text reflows into fewer lines as it shrinks. The search always ends on `lo`, which is the last probe measured as fitting.
  useLayoutEffect(() => {
    if (fit.settled) return
    const el = contentRef.current
    if (!el) return

    const natural = el.scrollHeight
    if (!natural) return

    const fits = natural <= A4_HEIGHT_PX

    if (fits && fit.probe >= 1) {
      setFit({ ...fit, settled: true })
      onOverflowChange?.(false)
      return
    }

    const lo = fits ? fit.probe : fit.lo
    const hi = fits ? fit.hi : fit.probe

    if (hi - lo <= TOLERANCE) {
      setFit({ lo, hi, probe: lo, settled: true })
      // Reaching this branch means density=1 never fit, so any shrinking was applied.
      onOverflowChange?.(true)
      return
    }

    setFit({ lo, hi, probe: (lo + hi) / 2, settled: false })
  }, [fit, onOverflowChange])

  const density = fit.probe

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const fit = () => setWidthScale(Math.min(1, frame.clientWidth / A4_WIDTH_PX))
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  const p = data.personal
  const t = getTemplateSpec(style.template)
  const fontStack = getFontStack(style.fontFamily)

  const nameSize = style.nameSize * PT_TO_PX * density
  const headingSize = style.headingSize * PT_TO_PX * density
  const bodySize = style.bodySize * PT_TO_PX * density
  const metaSize = style.metaSize * PT_TO_PX * density
  const lineSpacing = style.lineSpacing
  const u = (n: number) => n * density

  const contactLine = [p.email, p.phone, p.location, p.linkedin, p.github, p.website].filter(Boolean).join('  ·  ')

  const bodyStyle = { fontSize: bodySize, lineHeight: lineSpacing }
  const metaStyle = { fontSize: metaSize, lineHeight: lineSpacing }

  const sectionProps = { size: headingSize, spec: t, density }

  return (
    <div ref={frameRef} className="mx-auto w-full max-w-[794px]">
      <div
        className="overflow-hidden rounded-md border border-border bg-white shadow-lg shadow-black/5"
        style={{ height: A4_HEIGHT_PX * widthScale }}
      >
        <div
          className="origin-top-left bg-white"
          style={{ width: A4_WIDTH_PX, height: A4_HEIGHT_PX, transform: `scale(${widthScale})` }}
        >
          <div
            id="resume-print-root"
            ref={contentRef}
            className="w-[794px] bg-white text-black"
            style={{
              fontFamily: fontStack,
              paddingTop: u(t.padY),
              paddingBottom: u(t.padY),
              paddingLeft: u(t.padX),
              paddingRight: u(t.padX),
            }}
          >
            <header style={{ textAlign: t.headerAlign }}>
              <h1
                style={{
                  fontSize: nameSize,
                  fontWeight: 700,
                  letterSpacing: t.nameTracking,
                  textTransform: t.nameCase,
                  lineHeight: 1.14,
                }}
              >
                {p.name || 'Your Name'}
              </h1>

              {p.title && (
                <p style={{ fontSize: bodySize * 1.02, lineHeight: lineSpacing, marginTop: u(3), color: '#333' }}>
                  {p.title}
                </p>
              )}

              {contactLine && <p style={{ ...metaStyle, marginTop: u(5), color: '#333' }}>{contactLine}</p>}

              {t.headerRule && (
                <div
                  style={{
                    marginTop: u(10),
                    borderBottom: `${t.headerRuleWidth}px solid #000`,
                  }}
                />
              )}
            </header>

            {data.summary && (
              <p style={{ ...bodyStyle, marginTop: u(t.sectionGap) }}>{data.summary}</p>
            )}

            {data.experience.length > 0 && (
              <Section title="Experience" {...sectionProps}>
                <div style={{ display: 'grid', gap: u(t.itemGap) }}>
                  {data.experience.map((exp) => (
                    <div key={exp.id}>
                      <Row
                        left={<span style={{ fontSize: bodySize * 1.06, fontWeight: 700 }}>{exp.title}</span>}
                        right={exp.period}
                        metaStyle={metaStyle}
                        stacked={t.stackMeta}
                        gap={u(2)}
                      />
                      <p style={{ ...metaStyle, color: '#333', fontStyle: t.subtitleItalic ? 'italic' : 'normal' }}>
                        {[exp.company, exp.location].filter(Boolean).join(' · ')}
                      </p>
                      {exp.duties.filter(Boolean).length > 0 && (
                        <ul
                          style={{
                            ...bodyStyle,
                            listStyleType: 'disc',
                            paddingLeft: u(16),
                            marginTop: u(3),
                            display: 'grid',
                            gap: u(1.5),
                          }}
                        >
                          {exp.duties.filter(Boolean).map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {data.projects.length > 0 && (
              <Section title="Projects" {...sectionProps}>
                <div style={{ display: 'grid', gap: u(t.itemGap * 0.8) }}>
                  {data.projects.map((proj) => (
                    <div key={proj.id}>
                      <Row
                        left={
                          <span style={{ fontSize: bodySize * 1.04, fontWeight: 700 }}>
                            {proj.name}
                            {proj.link && (
                              <span style={{ ...metaStyle, fontWeight: 400, color: '#333', marginLeft: u(5) }}>
                                ({proj.link})
                              </span>
                            )}
                          </span>
                        }
                        right={proj.tech}
                        metaStyle={{ ...metaStyle, fontStyle: t.subtitleItalic ? 'italic' : 'normal' }}
                        stacked={t.stackMeta}
                        gap={u(2)}
                      />
                      {proj.desc && <p style={{ ...bodyStyle, marginTop: u(2) }}>{proj.desc}</p>}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {data.skills.length > 0 && (
              <Section title="Skills" {...sectionProps}>
                <div style={{ display: 'grid', gap: u(2) }}>
                  {data.skills.map((group) => (
                    <p key={group.id} style={bodyStyle}>
                      <span style={{ fontWeight: 700 }}>{group.label}: </span>
                      {group.items}
                    </p>
                  ))}
                </div>
              </Section>
            )}

            {data.education.length > 0 && (
              <Section title="Education" {...sectionProps}>
                <div style={{ display: 'grid', gap: u(t.itemGap * 0.6) }}>
                  {data.education.map((edu) => (
                    <div key={edu.id}>
                      <Row
                        left={<span style={{ fontSize: bodySize * 1.04, fontWeight: 700 }}>{edu.degree}</span>}
                        right={edu.period}
                        metaStyle={metaStyle}
                        stacked={t.stackMeta}
                        gap={u(2)}
                      />
                      <p style={{ ...metaStyle, color: '#333', fontStyle: t.subtitleItalic ? 'italic' : 'normal' }}>
                        {[edu.institution, edu.detail].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {data.certifications.length > 0 && (
              <Section title="Certifications" {...sectionProps}>
                <p style={bodyStyle}>
                  {data.certifications.map((c) => `${c.name}${c.year ? ` (${c.year})` : ''}`).join(' · ')}
                </p>
              </Section>
            )}

            {data.achievements.filter(Boolean).length > 0 && (
              <Section title="Achievements" {...sectionProps}>
                <ul
                  style={{
                    ...bodyStyle,
                    listStyleType: 'disc',
                    paddingLeft: u(16),
                    display: 'grid',
                    gap: u(1.5),
                  }}
                >
                  {data.achievements.filter(Boolean).map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </Section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({
  left,
  right,
  metaStyle,
  stacked,
  gap,
}: {
  left: React.ReactNode
  right?: string
  metaStyle: React.CSSProperties
  stacked: boolean
  gap: number
}) {
  if (stacked || !right) {
    return (
      <div>
        <div>{left}</div>
        {right && <div style={{ ...metaStyle, color: '#333', marginTop: gap }}>{right}</div>}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
      {left}
      <span style={{ ...metaStyle, color: '#333', flexShrink: 0 }}>{right}</span>
    </div>
  )
}

function Section({
  title,
  children,
  size,
  spec,
  density,
}: {
  title: string
  children: React.ReactNode
  size: number
  spec: ReturnType<typeof getTemplateSpec>
  density: number
}) {
  const u = (n: number) => n * density

  return (
    <section style={{ marginTop: u(spec.sectionGap) }}>
      <h2
        style={{
          fontSize: size,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: spec.headingTracking,
          color: '#000',
          paddingBottom: spec.sectionRule ? u(3) : 0,
          marginBottom: u(spec.headingGap),
          borderBottom: spec.sectionRule ? `${spec.sectionRuleWidth}px solid #000` : 'none',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}
