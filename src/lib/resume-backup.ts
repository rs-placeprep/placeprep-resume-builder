import type { ResumeData, StyleSettings } from '@/types'
import { emptyResume } from '@/lib/sample-data'
import { defaultStyleSettings } from '@/hooks/use-style-settings'
import { buildResumePdfBlob, resumeBaseName, triggerDownload } from '@/lib/generate-pdf'

export const BACKUP_FORMAT = 'placeprep-resume-builder'
export const BACKUP_VERSION = 1

export interface ResumeBackup {
  $schema: string
  format: typeof BACKUP_FORMAT
  version: number
  note: string
  meta: {
    exportedAt: string
    appUrl: string
    generatedBy: string
  }
  style: StyleSettings
  resume: ResumeData
}

const NOTE =
  'This file is a backup of your resume. Upload it at https://resume.placeprep.app using the "Upload JSON" button to refill the form exactly as it was, including fonts, template and sizing. Nothing is uploaded to a server, the file is read in your browser.'

export function buildResumeBackup(data: ResumeData, style: StyleSettings): ResumeBackup {
  return {
    $schema: 'https://resume.placeprep.app/resume-backup.schema.json',
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    note: NOTE,
    meta: {
      exportedAt: new Date().toISOString(),
      appUrl: 'https://resume.placeprep.app',
      generatedBy: "R's PlacePrep Resume Builder",
    },
    style,
    resume: data,
  }
}

export function downloadResumeBackup(data: ResumeData, style: StyleSettings) {
  const backup = buildResumeBackup(data, style)
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  triggerDownload(blob, `${resumeBaseName(data)}_Resume_Data.json`)
}

const README = `R's PlacePrep Resume Builder
https://resume.placeprep.app

This folder contains:

  <name>_Resume.pdf         Your resume, ready to send. Text-based, so ATS software can parse it.

  <name>_Resume_Data.json   A backup of everything you typed, plus your font, template and sizing.

To edit this resume later, open https://resume.placeprep.app, click "Upload JSON", and pick the .json file. The form refills exactly as you left it.

Nothing is uploaded to a server. The file is read in your browser.
`

// Bundles the PDF and its JSON backup into one archive so the browser only prompts for a single download instead of asking permission to save multiple files.
export async function downloadResumeBundle(data: ResumeData, style: StyleSettings) {
  const { default: JSZip } = await import('jszip')

  const base = resumeBaseName(data)
  const [pdfBlob, backup] = [await buildResumePdfBlob(data, style), buildResumeBackup(data, style)]

  const zip = new JSZip()
  const folder = zip.folder(`${base}_Resume`) ?? zip
  folder.file(`${base}_Resume.pdf`, pdfBlob)
  folder.file(`${base}_Resume_Data.json`, JSON.stringify(backup, null, 2))
  folder.file('README.txt', README)

  const archive = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' })
  triggerDownload(archive, `${base}_Resume.zip`)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function withIds<T extends { id?: string }>(items: unknown): T[] {
  if (!Array.isArray(items)) return []
  return items.filter(isRecord).map((item) => ({ ...item, id: typeof item.id === 'string' ? item.id : crypto.randomUUID() })) as T[]
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []
}

export interface ParsedBackup {
  resume: ResumeData
  style: StyleSettings
}

// Merges onto defaults rather than trusting the file, so a hand-edited or older export can't produce undefined fields that crash the form or the preview.
export function parseResumeBackup(raw: string): ParsedBackup {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('That file is not valid JSON.')
  }

  if (!isRecord(parsed)) throw new Error('That file does not contain resume data.')

  const source = isRecord(parsed.resume) ? parsed.resume : parsed
  if (!isRecord(source.personal) && !Array.isArray(source.experience)) {
    throw new Error('That file does not look like a resume backup from this builder.')
  }

  const resume: ResumeData = {
    personal: { ...emptyResume.personal, ...(isRecord(source.personal) ? source.personal : {}) },
    summary: typeof source.summary === 'string' ? source.summary : '',
    experience: withIds(source.experience).map((exp: any) => ({ ...exp, duties: strings(exp.duties) })),
    projects: withIds(source.projects),
    education: withIds(source.education),
    skills: withIds(source.skills),
    certifications: withIds(source.certifications),
    achievements: strings(source.achievements),
  }

  const style: StyleSettings = {
    ...defaultStyleSettings,
    ...(isRecord(parsed.style) ? parsed.style : {}),
  }

  return { resume, style }
}

export function readResumeBackupFile(file: File): Promise<ParsedBackup> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read that file.'))
    reader.onload = () => {
      try {
        resolve(parseResumeBackup(String(reader.result)))
      } catch (err) {
        reject(err)
      }
    }
    reader.readAsText(file)
  })
}
