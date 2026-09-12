import { RotateCcw } from 'lucide-react'
import { FormSection } from './form/form-section'
import { Select } from './ui/select'
import { Stepper } from './ui/stepper'
import type { StyleSettings } from '@/types'
import { FONT_OPTIONS } from '@/lib/fonts'
import { TEMPLATE_OPTIONS } from '@/lib/templates'

interface Props {
  style: StyleSettings
  onChange: <K extends keyof StyleSettings>(key: K, value: StyleSettings[K]) => void
  onReset: () => void
}

export function StylePanel({ style, onChange, onReset }: Props) {
  return (
    <FormSection
      title="Style & typography"
      description="Changes apply live to the preview and the exported PDF."
      action={
        <button type="button" onClick={onReset} className="add-btn">
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="field-label">Template</span>
            <Select
              value={style.template}
              onChange={(v) => onChange('template', v as StyleSettings['template'])}
              options={TEMPLATE_OPTIONS.map((t) => ({ value: t.value, label: t.label, description: t.description }))}
              searchThreshold={-1}
            />
          </label>
          <label className="block">
            <span className="field-label">Font family</span>
            <Select
              value={style.fontFamily}
              onChange={(v) => onChange('fontFamily', v)}
              options={FONT_OPTIONS.map((f) => ({ value: f.value, label: f.label }))}
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Stepper label="Name" value={style.nameSize} min={20} max={24} step={0.5} unit="pt" onChange={(v) => onChange('nameSize', v)} />
          <Stepper label="Headings" value={style.headingSize} min={11} max={12} step={0.25} unit="pt" onChange={(v) => onChange('headingSize', v)} />
          <Stepper label="Body" value={style.bodySize} min={10} max={10.5} step={0.25} unit="pt" onChange={(v) => onChange('bodySize', v)} />
          <Stepper label="Dates" value={style.metaSize} min={9} max={9.5} step={0.25} unit="pt" onChange={(v) => onChange('metaSize', v)} />
          <Stepper label="Line spacing" value={style.lineSpacing} min={1.05} max={1.15} step={0.01} onChange={(v) => onChange('lineSpacing', v)} />
        </div>
      </div>
    </FormSection>
  )
}
