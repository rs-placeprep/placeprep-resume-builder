import { FormSection } from './form-section'

interface Props {
  value: string
  onChange: (value: string) => void
}

const MAX = 520

export function SummaryForm({ value, onChange }: Props) {
  return (
    <FormSection title="Professional summary" description="2-4 sentences on who you are and what you bring. Skip generic filler.">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX))}
        rows={4}
        placeholder="Final-year Computer Science student with hands-on experience building..."
        className="field-textarea text-sm"
      />
      <p className="mt-1.5 text-right text-[11px] text-muted-foreground/70">{value.length}/{MAX}</p>
    </FormSection>
  )
}
