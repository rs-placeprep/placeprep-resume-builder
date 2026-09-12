import { useCallback, useEffect, useState } from 'react'
import { useResumeStore } from '@/hooks/use-resume-store'
import { useStyleSettings } from '@/hooks/use-style-settings'
import { downloadResumeBundle } from '@/lib/resume-backup'
import type { ParsedBackup } from '@/lib/resume-backup'
import { AppHeader } from '@/components/app-header'
import { AppFooter } from '@/components/app-footer'
import { ResumePreview } from '@/components/resume-preview'
import { StylePanel } from '@/components/style-panel'
import { CelebrationOverlay } from '@/components/celebration-overlay'
import { InfoPopover } from '@/components/ui/info-popover'
import { StripedPattern } from '@/components/ui/striped-pattern'
import { PersonalForm } from '@/components/form/personal-form'
import { SummaryForm } from '@/components/form/summary-form'
import { ExperienceForm } from '@/components/form/experience-form'
import { ProjectsForm } from '@/components/form/projects-form'
import { EducationForm } from '@/components/form/education-form'
import { SkillsForm } from '@/components/form/skills-form'
import { ExtrasForm } from '@/components/form/extras-form'

export default function App() {
  const { data, setData, update, reset, loadSample } = useResumeStore()
  const { style, update: updateStyle, resetStyle, replaceStyle } = useStyleSettings()
  const [downloading, setDownloading] = useState(false)
  const [celebrating, setCelebrating] = useState(false)
  const [overflowing, setOverflowing] = useState(false)
  const [toast, setToast] = useState<{ tone: 'ok' | 'error'; message: string } | null>(null)

  const handleOverflowChange = useCallback((v: boolean) => setOverflowing(v), [])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(timer)
  }, [toast])

  const handleDownload = async () => {
    setDownloading(true)
    try {
      // One ZIP with the PDF plus a re-importable copy of the form
      await downloadResumeBundle(data, style)
      setCelebrating(true)
    } catch {
      setToast({ tone: 'error', message: 'Could not generate the download. Please try again.' })
    } finally {
      setDownloading(false)
    }
  }

  const handleImport = useCallback(
    (backup: ParsedBackup) => {
      setData(backup.resume)
      replaceStyle(backup.style)
      setToast({ tone: 'ok', message: 'Resume loaded from file.' })
    },
    [setData, replaceStyle],
  )

  const handleImportError = useCallback((message: string) => {
    setToast({ tone: 'error', message })
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background lg:h-screen lg:overflow-hidden">
      <AppHeader
        onDownload={handleDownload}
        onReset={reset}
        onLoadSample={loadSample}
        onImport={handleImport}
        onImportError={handleImportError}
        downloading={downloading}
      />

      <main className="lg:min-h-0 lg:flex-1 lg:overflow-hidden">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:h-full lg:grid-cols-[minmax(0,620px)_1fr]">
          <div className="relative lg:h-full lg:min-h-0 lg:overflow-y-auto">
            <div className="relative space-y-4 px-4 py-6 sm:px-6 sm:py-8">
              <StylePanel style={style} onChange={updateStyle} onReset={resetStyle} />
              <PersonalForm data={data.personal} onChange={(v) => update('personal', v)} />
              <SummaryForm value={data.summary} onChange={(v) => update('summary', v)} />
              <ExperienceForm items={data.experience} onChange={(v) => update('experience', v)} />
              <ProjectsForm items={data.projects} onChange={(v) => update('projects', v)} />
              <EducationForm items={data.education} onChange={(v) => update('education', v)} />
              <SkillsForm items={data.skills} onChange={(v) => update('skills', v)} />
              <ExtrasForm
                certifications={data.certifications}
                onCertificationsChange={(v) => update('certifications', v)}
                achievements={data.achievements}
                onAchievementsChange={(v) => update('achievements', v)}
              />
            </div>
          </div>

          <div className="relative border-t border-border lg:h-full lg:min-h-0 lg:overflow-y-auto lg:border-l lg:border-t-0">
            <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-24 overflow-hidden lg:block">
              <StripedPattern
                width={12}
                height={12}
                className="text-foreground/25 [mask-image:linear-gradient(to_right,black,transparent)]"
              />
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 overflow-hidden lg:block">
              <StripedPattern
                direction="right"
                width={12}
                height={12}
                className="text-foreground/25 [mask-image:linear-gradient(to_left,black,transparent)]"
              />
            </div>

            <div className="relative px-4 py-6 sm:px-6 sm:py-8">
              <div className="mb-3 flex items-center justify-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Live preview</span>
                {overflowing && (
                  <InfoPopover tone="warning" label="Page length information">
                    Content runs past one page. The preview and the PDF export both shrink the text to fit, but trim a
                    bullet or two if it starts looking cramped.
                  </InfoPopover>
                )}
              </div>
              <ResumePreview data={data} style={style} onOverflowChange={handleOverflowChange} />
            </div>
          </div>
        </div>
      </main>

      <AppFooter />
      <CelebrationOverlay open={celebrating} onClose={() => setCelebrating(false)} />

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`animate-fade-up fixed bottom-5 left-1/2 z-[60] max-w-[92vw] -translate-x-1/2 rounded-xl border px-4 py-2.5 text-sm font-medium shadow-lg backdrop-blur-md ${
            toast.tone === 'ok'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}
