import type { ResumeData, StyleSettings } from '@/types'
import { defaultStyleSettings } from '@/hooks/use-style-settings'
import { getPdfFont, getEmbeddedFamily } from '@/lib/fonts'
import { getTemplateSpec } from '@/lib/templates'
import { embedFont } from '@/lib/pdf-fonts'

export function resumeBaseName(data: ResumeData) {
  return (data.personal.name || 'Resume').trim().replace(/\s+/g, '_')
}

// Generates a text-based (not image) PDF so it stays ATS-parsable and searchable.
// Renders at a candidate font scale, and if content still overflows one A4 page, retries at progressively smaller scales down to a floor before giving up.
export async function buildResumePdfBlob(data: ResumeData, style: StyleSettings = defaultStyleSettings): Promise<Blob> {
  const { jsPDF } = await import('jspdf')

  const scales = [1, 0.96, 0.92, 0.88, 0.84, 0.8, 0.76, 0.7, 0.65, 0.62]
  let lastResult: { doc: InstanceType<typeof jsPDF>; pages: number } | null = null

  for (const scale of scales) {
    const result = await render(data, style, jsPDF, scale)
    lastResult = result
    if (result.pages <= 1) break
  }

  return lastResult!.doc.output('blob')
}

export async function generateResumePdf(data: ResumeData, style: StyleSettings = defaultStyleSettings) {
  const blob = await buildResumePdfBlob(data, style)
  triggerDownload(blob, `${resumeBaseName(data)}_Resume.pdf`)
}

export function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

async function render(data: ResumeData, style: StyleSettings, JsPdfCtor: any, scale: number) {
  const doc = new JsPdfCtor({ unit: 'mm', format: 'a4', orientation: 'portrait' })
  const t = getTemplateSpec(style.template)
  const pageW = 210
  const marginL = t.padX * 0.2646
  const marginR = marginL
  const marginT = t.padY * 0.2646
  const maxY = 297 - marginT
  const contentW = pageW - marginL - marginR
  let y = marginT

  const embeddedFamily = getEmbeddedFamily(style.fontFamily)
  let font = getPdfFont(style.fontFamily)
  if (embeddedFamily) {
    const embedded = await embedFont(doc, embeddedFamily)
    if (embedded) font = embeddedFamily as any
  }
  const isClassic = style.template === 'classic'
  const isModern = style.template === 'modern'
  const isMinimal = style.template === 'minimal'
  const black = '#000000'
  const gray = '#333333'
  const bodyGray = '#000000'

  const s = (n: number) => n * scale

  const ensureSpace = (needed: number) => {
    if (y + needed > maxY) {
      doc.addPage()
      y = marginT
    }
  }

  const lineSpacing = isClassic ? style.lineSpacing * 1.12 : style.lineSpacing

  const paragraph = (text: string, x: number, maxW: number, fontSize: number, color: string, fontStyle: 'normal' | 'bold' | 'italic' = 'normal', lineH = lineSpacing) => {
    if (!text) return
    doc.setFontSize(fontSize)
    doc.setTextColor(color)
    doc.setFont(font, fontStyle)
    const lines: string[] = doc.splitTextToSize(text, maxW)
    const lh = fontSize * 0.3528 * lineH
    for (const l of lines) {
      ensureSpace(lh)
      doc.text(l, x, y)
      y += lh
    }
  }

  const bullet = (text: string, x: number, maxW: number, fontSize: number) => {
    if (!text) return
    doc.setFontSize(fontSize)
    doc.setTextColor(bodyGray)
    doc.setFont(font, 'normal')
    const indent = 3.2
    const lines: string[] = doc.splitTextToSize(text, maxW - indent)
    const lh = fontSize * 0.3528 * lineSpacing
    lines.forEach((l, i) => {
      ensureSpace(lh)
      if (i === 0) doc.text('•', x, y)
      doc.text(l, x + indent, y)
      y += lh
    })
  }

  const spaced = (text: string, gapEm: number) => (gapEm > 0 ? text.split('').join(' '.repeat(gapEm)) : text)

  const trackedText = (doc: any, text: string, x: number, yPos: number, trackingMm: number) => {
    let cursor = x
    for (const ch of text) {
      doc.text(ch, cursor, yPos)
      cursor += doc.getTextWidth(ch) + trackingMm
    }
  }

  const sectionTitle = (title: string, fontSize: number) => {
    ensureSpace(s(12))
    y += isMinimal ? s(4) : s(2)
    doc.setFontSize(fontSize)
    doc.setTextColor(black)
    doc.setFont(font, isModern ? 'normal' : 'bold')
    const upperTitle = title.toUpperCase()
    if (isMinimal) {
      doc.text(spaced(upperTitle, 1), marginL, y)
    } else if (isModern) {
      trackedText(doc, upperTitle, marginL, y, 0.35)
    } else {
      doc.text(upperTitle, marginL, y)
    }
    y += s(1.6)
    if (!isMinimal && t.sectionRule) {
      doc.setDrawColor(122, 122, 122)
      doc.setLineWidth(isClassic ? 0.25 : t.sectionRuleWidth * 0.35)
      doc.line(marginL, y, marginL + contentW, y)
    }
    y += isClassic ? s(6) : s(4.2)
  }

  const headerAlign = t.headerAlign
  const headerX = headerAlign === 'left' ? marginL : pageW / 2
  const profileSeparator = isClassic ? ' · ' : ' | '

  const drawProfileRow = (items: Array<{ label: string; href?: string }>, fontSize: number, color: string) => {
    const valid = items.filter((item) => item.label)
    if (valid.length === 0) return

    doc.setFontSize(fontSize)
    doc.setTextColor(color)
    doc.setFont(font, 'normal')

    const sepWidth = doc.getTextWidth(profileSeparator)
    const totalWidth = valid.reduce((sum, item, idx) => sum + doc.getTextWidth(item.label) + (idx > 0 ? sepWidth : 0), 0)
    let cursor = headerAlign === 'left' ? marginL : (pageW - totalWidth) / 2
    const rowY = y
    const linkHeight = fontSize * 0.3528 * 1.15

    valid.forEach((item, index) => {
      if (index > 0) {
        doc.text(profileSeparator, cursor, rowY)
        cursor += sepWidth
      }
      const textWidth = doc.getTextWidth(item.label)
      doc.text(item.label, cursor, rowY)
      if (item.href) {
        doc.link(cursor, rowY - linkHeight * 0.78, textWidth, linkHeight, { url: item.href })
      }
      cursor += textWidth
    })

    y += fontSize * 0.3528 * lineSpacing
  }

  const sizeBoost = 1.08
  const nameSize = style.nameSize * scale * sizeBoost
  const bodySize = style.bodySize * scale * sizeBoost
  const metaSize = style.metaSize * scale * sizeBoost
  const sectionHeadingSize = style.headingSize * scale * sizeBoost

  const nameText = data.personal.name || 'Your Name'
  doc.setFontSize(nameSize)
  doc.setTextColor(black)
  doc.setFont(font, 'bold')
  doc.text(isMinimal ? spaced(nameText.toUpperCase(), 1) : nameText, headerX, y + s(5.5), { align: headerAlign })
  y += s(11.5)

  if (!isModern && data.personal.title) {
    doc.setFontSize(bodySize)
    doc.setTextColor(gray)
    doc.setFont(font, 'normal')
    doc.text(data.personal.title, headerX, y, { align: headerAlign })
    y += s(5)
  }

  const contactItems = [
    { label: data.personal.email, href: data.personal.email ? `mailto:${data.personal.email.trim()}` : undefined },
    { label: data.personal.phone, href: data.personal.phone ? `tel:${data.personal.phone.replace(/[^\d+]/g, '')}` : undefined },
    { label: data.personal.location, href: undefined },
    { label: data.personal.linkedin, href: data.personal.linkedin ? (data.personal.linkedin.startsWith('http') ? data.personal.linkedin : `https://${data.personal.linkedin}`) : undefined },
    { label: data.personal.github, href: data.personal.github ? (data.personal.github.startsWith('http') ? data.personal.github : `https://${data.personal.github}`) : undefined },
    { label: data.personal.website, href: data.personal.website ? (data.personal.website.startsWith('http') ? data.personal.website : `https://${data.personal.website}`) : undefined },
  ].filter((i) => i.label)

  drawProfileRow(contactItems, metaSize, gray)

  y += s(2)
  if (!isMinimal && t.headerRule && !isModern) {
    doc.setDrawColor(122, 122, 122)
    doc.setLineWidth(isClassic ? 0.25 : t.headerRuleWidth * 0.35)
    doc.line(marginL, y, marginL + contentW, y)
  }
  y += isModern ? s(2.5) : isMinimal ? s(3) : s(4.8)

  if (!isModern && data.summary) {
    paragraph(data.summary, marginL, contentW, bodySize, bodyGray)
    y += isClassic ? s(5) : s(2.5)
  }

  const renderEducation = () => {
    if (data.education.length === 0) return
    sectionTitle('Education', sectionHeadingSize)
    data.education.forEach((edu, i) => {
      ensureSpace(s(9))
      doc.setFontSize(bodySize * 1.04)
      doc.setTextColor(black)
      doc.setFont(font, 'bold')
      doc.text(edu.degree || 'Degree', marginL, y)
      if (edu.period) {
        doc.setFontSize(metaSize)
        doc.setFont(font, 'normal')
        doc.setTextColor(gray)
        doc.text(edu.period, marginL + contentW, y, { align: 'right' })
      }
      y += s(4.2)

      const sub = [edu.institution, edu.detail].filter(Boolean).join(' · ')
      if (sub) {
        doc.setFontSize(metaSize)
        doc.setFont(font, t.subtitleItalic ? 'italic' : 'normal')
        doc.setTextColor(gray)
        doc.text(sub, marginL, y)
        y += s(4)
      }
      if (i < data.education.length - 1) y += isClassic ? s(3) : s(1.5)
    })
    y += isClassic ? s(3.5) : s(1.5)
  }

  const renderExperience = () => {
    if (data.experience.length === 0) return
    sectionTitle('Experience', sectionHeadingSize)
    data.experience.forEach((exp, i) => {
      ensureSpace(s(14))
      doc.setFontSize(bodySize * 1.06)
      doc.setTextColor(black)
      doc.setFont(font, 'bold')
      doc.text(exp.title || 'Role', marginL, y)
      if (exp.period) {
        doc.setFontSize(metaSize)
        doc.setTextColor(gray)
        doc.setFont(font, 'normal')
        doc.text(exp.period, marginL + contentW, y, { align: 'right' })
      }
      y += s(4.2)

      const sub = [exp.company, exp.location].filter(Boolean).join(' · ')
      if (sub) {
        doc.setFontSize(metaSize)
        doc.setFont(font, t.subtitleItalic ? 'italic' : 'normal')
        doc.setTextColor(gray)
        doc.text(sub, marginL, y)
        y += s(4.2)
      }

      for (const duty of exp.duties.filter(Boolean)) bullet(duty, marginL + s(1), contentW - s(1), bodySize - 0.1)
      if (i < data.experience.length - 1) y += isClassic ? s(4.5) : s(3.5)
    })
    y += isClassic ? s(3.5) : s(2.5)
  }

  const renderProjects = () => {
    if (data.projects.length === 0) return
    sectionTitle('Projects', sectionHeadingSize)
    data.projects.forEach((proj, i) => {
      ensureSpace(s(10))
      doc.setFontSize(bodySize * 1.04)
      doc.setTextColor(black)
      doc.setFont(font, 'bold')

      const projName = proj.name || 'Project'
      doc.text(projName, marginL, y)
      const nameWidth = doc.getTextWidth(projName)

      if (isModern) {
        if (proj.tech) {
          const techParts = proj.tech.replace(/\s*·\s*/g, ' | ').split('|').map((part) => part.trim()).filter(Boolean)
          doc.setFontSize(metaSize)
          doc.setTextColor(gray)
          let cursorX = marginL + nameWidth + 2
          for (const part of techParts) {
            doc.setFont(font, 'normal')
            doc.text(' | ', cursorX, y)
            cursorX += doc.getTextWidth(' | ')
            doc.setFont(font, 'italic')
            doc.text(part, cursorX, y)
            cursorX += doc.getTextWidth(part)
          }
        }
        if (proj.link) {
          doc.setFontSize(metaSize)
          doc.setFont(font, 'normal')
          doc.setTextColor(gray)
          doc.text(proj.link, marginL + contentW, y, { align: 'right' })
        }
      } else {
        if (proj.link) {
          const linkText = `  (${proj.link})`
          doc.setFontSize(bodySize * 1.04)
          doc.setFont(font, 'normal')
          doc.setTextColor(black)
          doc.text(linkText, marginL + nameWidth, y)
        }
        if (proj.tech) {
          doc.setFontSize(metaSize)
          doc.setFont(font, 'italic')
          doc.setTextColor(gray)
          doc.text(proj.tech, marginL + contentW, y, { align: 'right' })
        }
      }

      y += s(4)
      if (proj.desc) paragraph(proj.desc, marginL, contentW, bodySize, bodyGray)
      if (i < data.projects.length - 1) y += isClassic ? s(4) : s(3)
    })
    y += isClassic ? s(3.5) : s(2.5)
  }

  const renderSkills = () => {
    if (data.skills.length === 0) return
    sectionTitle('Skills', sectionHeadingSize)
    for (const group of data.skills) {
      if (!group.label && !group.items) continue
      const lh = bodySize * 0.3528 * lineSpacing
      ensureSpace(lh)
      doc.setFontSize(bodySize)
      doc.setTextColor(black)
      doc.setFont(font, 'bold')
      const labelText = `${group.label}: `
      const labelW = doc.getTextWidth(labelText)
      doc.text(labelText, marginL, y)

      doc.setFont(font, 'normal')
      doc.setTextColor(bodyGray)
      const lines: string[] = doc.splitTextToSize(group.items, contentW - labelW)
      lines.forEach((l, i) => {
        if (i > 0) {
          y += lh
          ensureSpace(lh)
        }
        doc.text(l, marginL + labelW, y)
      })
      y += lh + (isClassic ? s(2.2) : s(1.4))
    }
    y += isClassic ? s(2) : s(1.5)
  }

  const renderAchievements = () => {
    const achievements = data.achievements.filter(Boolean)
    if (achievements.length === 0) return
    sectionTitle('Achievements', sectionHeadingSize)
    for (const a of achievements) bullet(a, marginL + s(1), contentW - s(1), bodySize)
    y += s(2.5)
  }

  const renderCertifications = () => {
    if (data.certifications.length === 0) return
    sectionTitle('Certifications', sectionHeadingSize)
    const text = data.certifications.map((c) => `${c.name}${c.year ? ` (${c.year})` : ''}`).join(' · ')
    paragraph(text, marginL, contentW, bodySize, bodyGray)
    y += s(2.5)
  }

  if (isModern) {
    renderEducation()
    renderExperience()
    renderProjects()
    renderSkills()
    renderAchievements()
    renderCertifications()
  } else {
    renderExperience()
    renderProjects()
    renderSkills()
    renderEducation()
    renderCertifications()
    renderAchievements()
  }

  return { doc, pages: doc.getNumberOfPages() }
}
