import type { ResumeData, StyleSettings } from '@/types'
import { defaultStyleSettings } from '@/hooks/use-style-settings'
import { getPdfFont } from '@/lib/fonts'
import { getTemplateSpec } from '@/lib/templates'

// Generates a text-based (not image) PDF so it stays ATS-parsable and searchable.
// Renders at a candidate font scale, and if content still overflows one A4 page, retries at progressively smaller scales down to a floor before giving up.
export async function generateResumePdf(data: ResumeData, style: StyleSettings = defaultStyleSettings) {
  const { jsPDF } = await import('jspdf')

  const scales = [1, 0.94, 0.88, 0.82, 0.76]
  let lastResult: { doc: InstanceType<typeof jsPDF>; pages: number } | null = null

  for (const scale of scales) {
    const result = render(data, style, jsPDF, scale)
    lastResult = result
    if (result.pages <= 1) break
  }

  const doc = lastResult!.doc
  const fileName = `${(data.personal.name || 'Resume').trim().replace(/\s+/g, '_')}_Resume.pdf`
  const blob = doc.output('blob')
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function render(data: ResumeData, style: StyleSettings, JsPdfCtor: any, scale: number) {
  const doc = new JsPdfCtor({ unit: 'mm', format: 'a4', orientation: 'portrait' })
  const t = getTemplateSpec(style.template)
  const pageW = 210
  const marginL = t.padX * 0.2646
  const marginR = marginL
  const marginT = t.padY * 0.2646
  const maxY = 297 - marginT
  const contentW = pageW - marginL - marginR
  let y = marginT

  const font = getPdfFont(style.fontFamily)
  const isModern = style.template === 'modern'
  const isMinimal = style.template === 'minimal'
  const black = '#000000'
  const gray = '#333333'
  const bodyGray = '#000000'
  const line = '#000000'

  const s = (n: number) => n * scale

  const ensureSpace = (needed: number) => {
    if (y + needed > maxY) {
      doc.addPage()
      y = marginT
    }
  }

  const lineSpacing = style.lineSpacing

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

  const sectionTitle = (title: string, fontSize: number) => {
    ensureSpace(s(12))
    y += isMinimal ? s(4) : s(2)
    doc.setFontSize(fontSize)
    doc.setTextColor(black)
    doc.setFont(font, 'bold')
    doc.text(isMinimal ? spaced(title.toUpperCase(), 1) : title.toUpperCase(), marginL, y)
    y += s(1.6)
    if (!isMinimal) {
      doc.setDrawColor(line)
      doc.setLineWidth(isModern ? 0.5 : 0.3)
      doc.line(marginL, y, marginL + contentW, y)
    }
    y += s(4.2)
  }

  const headerAlign = isModern ? 'left' : 'center'
  const headerX = isModern ? marginL : pageW / 2

  const centeredRow = (parts: string[], fontSize: number, color: string) => {
    const text = parts.filter(Boolean).join('   ·   ')
    if (!text) return
    doc.setFontSize(fontSize)
    doc.setTextColor(color)
    doc.setFont(font, 'normal')
    const lines: string[] = doc.splitTextToSize(text, contentW)
    const lh = fontSize * 0.3528 * lineSpacing
    for (const l of lines) {
      doc.text(l, headerX, y, { align: headerAlign })
      y += lh
    }
  }

  const ptToMm = 0.3528
  const nameSize = style.nameSize * ptToMm * (72 / 25.4) * scale
  const bodySize = style.bodySize * ptToMm * (72 / 25.4) * scale
  const smallSize = style.metaSize * ptToMm * (72 / 25.4) * scale
  const headingSize = style.headingSize * ptToMm * (72 / 25.4) * 0.82 * scale
  const sectionSize = style.headingSize * ptToMm * (72 / 25.4) * 0.85 * scale

  const nameText = data.personal.name || 'Your Name'
  doc.setFontSize(nameSize)
  doc.setTextColor(black)
  doc.setFont(font, 'bold')
  doc.text(isMinimal ? spaced(nameText.toUpperCase(), 1) : nameText, headerX, y + s(5.5), { align: headerAlign })
  y += s(11.5)

  if (data.personal.title) {
    doc.setFontSize(bodySize)
    doc.setTextColor(gray)
    doc.setFont(font, 'normal')
    doc.text(data.personal.title, headerX, y, { align: headerAlign })
    y += s(5)
  }

  centeredRow(
    [
      data.personal.email,
      data.personal.phone,
      data.personal.location,
      data.personal.linkedin,
      data.personal.github,
      data.personal.website,
    ],
    smallSize,
    gray,
  )
  y += s(2)
  if (!isMinimal) {
    doc.setDrawColor(line)
    doc.setLineWidth(isModern ? 0.7 : 0.3)
    doc.line(marginL, y, marginL + contentW, y)
  }
  y += isMinimal ? s(3) : s(4.8)

  if (data.summary) {
    paragraph(data.summary, marginL, contentW, bodySize, bodyGray)
    y += s(2.5)
  }

  if (data.experience.length > 0) {
    sectionTitle('Experience', sectionSize)
    data.experience.forEach((exp, i) => {
      ensureSpace(s(14))
      doc.setFontSize(headingSize)
      doc.setTextColor(black)
      doc.setFont(font, 'bold')
      doc.text(exp.title || 'Role', marginL, y)
      if (exp.period) {
        doc.setFontSize(smallSize)
        doc.setTextColor(gray)
        doc.setFont(font, 'normal')
        doc.text(exp.period, marginL + contentW, y, { align: 'right' })
      }
      y += s(4.2)

      const sub = [exp.company, exp.location].filter(Boolean).join(' · ')
      if (sub) {
        doc.setFontSize(smallSize)
        doc.setFont(font, 'italic')
        doc.setTextColor(gray)
        doc.text(sub, marginL, y)
        y += s(4.2)
      }

      for (const duty of exp.duties.filter(Boolean)) bullet(duty, marginL + s(1), contentW - s(1), bodySize - 0.1)
      if (i < data.experience.length - 1) y += s(3.5)
    })
    y += s(2.5)
  }

  if (data.projects.length > 0) {
    sectionTitle('Projects', sectionSize)
    data.projects.forEach((proj, i) => {
      ensureSpace(s(10))
      doc.setFontSize(headingSize)
      doc.setTextColor(black)
      doc.setFont(font, 'bold')
      const nameText = proj.link ? `${proj.name}  (${proj.link})` : proj.name
      doc.text(nameText || 'Project', marginL, y)
      if (proj.tech) {
        doc.setFontSize(smallSize)
        doc.setFont(font, 'italic')
        doc.setTextColor(gray)
        doc.text(proj.tech, marginL + contentW, y, { align: 'right' })
      }
      y += s(4)
      if (proj.desc) paragraph(proj.desc, marginL, contentW, bodySize, bodyGray)
      if (i < data.projects.length - 1) y += s(3)
    })
    y += s(2.5)
  }

  if (data.skills.length > 0) {
    sectionTitle('Skills', sectionSize)
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
      y += lh + s(1.4)
    }
    y += s(1.5)
  }

  if (data.education.length > 0) {
    sectionTitle('Education', sectionSize)
    for (const edu of data.education) {
      ensureSpace(s(9))
      doc.setFontSize(headingSize)
      doc.setTextColor(black)
      doc.setFont(font, 'bold')
      doc.text(edu.degree || 'Degree', marginL, y)
      if (edu.period) {
        doc.setFontSize(smallSize)
        doc.setFont(font, 'normal')
        doc.setTextColor(gray)
        doc.text(edu.period, marginL + contentW, y, { align: 'right' })
      }
      y += s(4.2)

      const sub = [edu.institution, edu.detail].filter(Boolean).join(' · ')
      if (sub) {
        doc.setFontSize(smallSize)
        doc.setFont(font, 'italic')
        doc.setTextColor(gray)
        doc.text(sub, marginL, y)
        y += s(4)
      }
    }
    y += s(1.5)
  }

  if (data.certifications.length > 0) {
    sectionTitle('Certifications', sectionSize)
    const text = data.certifications.map((c) => `${c.name}${c.year ? ` (${c.year})` : ''}`).join(' · ')
    paragraph(text, marginL, contentW, bodySize, bodyGray)
    y += s(2.5)
  }

  const achievements = data.achievements.filter(Boolean)
  if (achievements.length > 0) {
    sectionTitle('Achievements', sectionSize)
    for (const a of achievements) bullet(a, marginL + s(1), contentW - s(1), bodySize)
  }

  return { doc, pages: doc.getNumberOfPages() }
}
