import { X, Check } from 'lucide-react'
import { ResumePreview } from '@/components/resume-preview'
import { badExampleResume, goodExampleResume } from '@/lib/guide-sample-resumes'
import { defaultStyleSettings } from '@/hooks/use-style-settings'

export function GuideResumeCompare() {
  return (
    <div className="my-8 grid w-full min-w-0 gap-6 lg:grid-cols-2">
      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <X className="h-3.5 w-3.5" strokeWidth={2.5} />
          </span>
          <span className="text-sm font-semibold text-foreground">Before</span>
          <span className="text-xs text-muted-foreground sm:text-sm">vague, padded, unverifiable</span>
        </div>
        <div className="w-full min-w-0 overflow-hidden rounded-xl border border-red-500/20 bg-red-500/[0.03] p-2 sm:rounded-2xl sm:border-2 sm:p-4">
          <ResumePreview data={badExampleResume} style={defaultStyleSettings} />
        </div>
      </div>

      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
          </span>
          <span className="text-sm font-semibold text-foreground">After</span>
          <span className="text-xs text-muted-foreground sm:text-sm">specific, measurable, verifiable</span>
        </div>
        <div className="w-full min-w-0 overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-2 sm:rounded-2xl sm:border-2 sm:p-4">
          <ResumePreview data={goodExampleResume} style={defaultStyleSettings} />
        </div>
      </div>
    </div>
  )
}
