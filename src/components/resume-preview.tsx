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
  const isJakeStyle = style.template === 'modern'
  const isClassic = style.template === 'classic'
  const fontStack = getFontStack(style.fontFamily)

  const classicTighten = 1
  const nameSize = style.nameSize * PT_TO_PX * density * classicTighten
  const headingSize = style.headingSize * PT_TO_PX * density * classicTighten
  const bodySize = style.bodySize * PT_TO_PX * density * classicTighten
  const metaSize = style.metaSize * PT_TO_PX * density * classicTighten
  const lineSpacing = style.lineSpacing
  const u = (n: number) => n * density

  const normalizeUrl = (value: string, prefix: string) => {
    const trimmed = value.trim()
    if (!trimmed) return undefined
    return /^https?:\/\//i.test(trimmed) ? trimmed : `${prefix}${trimmed}`
  }

  const contactItems = [
    { label: p.email, href: p.email ? `mailto:${p.email.trim()}` : undefined },
    { label: p.phone, href: p.phone ? `tel:${p.phone.replace(/[^\d+]/g, '')}` : undefined },
    { label: p.location, href: undefined },
    { label: p.linkedin, href: normalizeUrl(p.linkedin, 'https://') },
    { label: p.github, href: normalizeUrl(p.github, 'https://') },
    { label: p.website, href: normalizeUrl(p.website, 'https://') },
  ].filter((item) => item.label)

  const showTitle = !isJakeStyle
  const showSummary = !isJakeStyle

  const bodyStyle = { fontSize: bodySize, lineHeight: lineSpacing }
  const metaStyle = { fontSize: metaSize, lineHeight: lineSpacing }

  const sectionProps = { size: headingSize, spec: t, density, titleWeight: isJakeStyle ? 400 : 700 }

  return (
    <div ref={frameRef} className="mx-auto w-full min-w-0 max-w-[794px]">
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

              {showTitle && p.title && (
                <p style={{ fontSize: bodySize * 1.02, lineHeight: lineSpacing, marginTop: u(3), color: '#333' }}>
                  {p.title}
                </p>
              )}

              {contactItems.length > 0 && (
                <p style={{ ...metaStyle, marginTop: u(5), color: '#333' }}>
                  {contactItems.map((item, index) => {
                    const separator = isClassic ? '·' : '|'
                    return (
                      <span key={`${item.label}-${index}`}>
                        {index > 0 && <span style={{ margin: '0 0.45em' }}>{separator}</span>}
                        {item.href ? (
                          <a href={item.href} target="_blank" rel="noreferrer" style={{ color: '#333', textDecoration: 'none' }}>
                            {item.label}
                          </a>
                        ) : (
                          <span>{item.label}</span>
                        )}
                      </span>
                    )
                  })}
                </p>
              )}

              {t.headerRule && (
                <div
                  style={{
                    marginTop: u(10),
                    borderBottom: `${t.headerRuleWidth}px solid #000`,
                  }}
                />
              )}
            </header>

            {showSummary && data.summary && (
              <p style={{ ...bodyStyle, marginTop: u(t.sectionGap) }}>{data.summary}</p>
            )}

            {isJakeStyle ? (
              <>
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
                      {data.projects.map((proj) => {
                        const techParts = proj.tech
                          ? proj.tech.replace(/\s*·\s*/g, ' | ').split('|').map((part) => part.trim()).filter(Boolean)
                          : []
                        return (
                          <div key={proj.id}>
                            <Row
                              left={
                                <span style={{ fontSize: bodySize * 1.04 }}>
                                  <span style={{ fontWeight: 700, fontStyle: 'normal' }}>{proj.name}</span>
                                  {techParts.length > 0 && (
                                    <span style={{ fontWeight: 400, color: '#333', marginLeft: u(5) }}>
                                      {techParts.map((part, idx) => (
                                        <span key={idx}>
                                          <span style={{ fontStyle: 'normal' }}>{idx === 0 ? ' | ' : ' | '}</span>
                                          <span style={{ fontStyle: 'italic' }}>{part}</span>
                                        </span>
                                      ))}
                                    </span>
                                  )}
                                </span>
                              }
                              right={proj.link || undefined}
                              metaStyle={{ ...metaStyle, fontStyle: 'normal' }}
                              stacked={t.stackMeta}
                              gap={u(2)}
                            />
                            {proj.desc && <p style={{ ...bodyStyle, marginTop: u(2) }}>{proj.desc}</p>}
                          </div>
                        )
                      })}
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

                {data.certifications.length > 0 && (
                  <Section title="Certifications" {...sectionProps}>
                    <p style={bodyStyle}>
                      {data.certifications.map((c) => `${c.name}${c.year ? ` (${c.year})` : ''}`).join(' · ')}
                    </p>
                  </Section>
                )}
              </>
            ) : (
              <>
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
                                  <span style={{ fontWeight: 400 }}>
                                    {'  ('}
                                    {proj.link}
                                    {')'}
                                  </span>
                                )}
                              </span>
                            }
                            right={
                              proj.tech ? (
                                <span style={{ fontStyle: 'italic' }}>{proj.tech}</span>
                              ) : undefined
                            }
                            metaStyle={metaStyle}
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
              </>
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
  right?: React.ReactNode
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
  titleWeight = 700,
}: {
  title: string
  children: React.ReactNode
  size: number
  spec: ReturnType<typeof getTemplateSpec>
  density: number
  titleWeight?: number
}) {
  const u = (n: number) => n * density

  return (
    <section style={{ marginTop: u(spec.sectionGap) }}>
      <h2
        style={{
          fontSize: size,
          fontWeight: titleWeight,
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
