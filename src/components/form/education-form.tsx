import { Plus, Trash2 } from 'lucide-react'
import type { EducationItem } from '@/types'
import { FormSection } from './form-section'
import { Field } from './field'

interface Props {
  items: EducationItem[]
  onChange: (items: EducationItem[]) => void
}

function makeItem(): EducationItem {
  return { id: crypto.randomUUID(), degree: '', institution: '', period: '', detail: '' }
}

export function EducationForm({ items, onChange }: Props) {
  const update = (id: string, patch: Partial<EducationItem>) =>
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)))

  const remove = (id: string) => onChange(items.filter((it) => it.id !== id))
  const add = () => onChange([...items, makeItem()])

  return (
    <FormSection
      title="Education"
      description="Most recent first."
      action={
        <button type="button" onClick={add} className="add-btn">
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      }
    >
      {items.length === 0 && <p className="text-xs text-muted-foreground">No education added yet.</p>}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-border p-3">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Degree" value={item.degree} onChange={(e) => update(item.id, { degree: e.target.value })} placeholder="B.Tech, Computer Science" />
                <Field label="Institution" value={item.institution} onChange={(e) => update(item.id, { institution: e.target.value })} placeholder="National Institute of Technology" />
                <Field label="Period" value={item.period} onChange={(e) => update(item.id, { period: e.target.value })} placeholder="2022 - 2026" />
                <Field label="Detail (CGPA/percentage)" value={item.detail} onChange={(e) => update(item.id, { detail: e.target.value })} placeholder="CGPA: 8.4/10" />
              </div>
              <button type="button" onClick={() => remove(item.id)} className="icon-btn shrink-0" aria-label="Remove education">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </FormSection>
  )
}
