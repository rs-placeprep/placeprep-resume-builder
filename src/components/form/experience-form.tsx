import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import type { ExperienceItem } from '@/types'
import { FormSection } from './form-section'
import { Field } from './field'
import { BulletList } from './bullet-list'

interface Props {
  items: ExperienceItem[]
  onChange: (items: ExperienceItem[]) => void
}

function makeItem(): ExperienceItem {
  return { id: crypto.randomUUID(), title: '', company: '', location: '', period: '', duties: [] }
}

export function ExperienceForm({ items, onChange }: Props) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null)

  const update = (id: string, patch: Partial<ExperienceItem>) =>
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)))

  const remove = (id: string) => onChange(items.filter((it) => it.id !== id))

  const add = () => {
    const item = makeItem()
    onChange([...items, item])
    setOpenId(item.id)
  }

  return (
    <FormSection
      title="Work experience"
      description="Most recent first. Lead each bullet with an action verb and a number where possible."
      action={
        <button type="button" onClick={add} className="add-btn">
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      }
    >
      {items.length === 0 && <p className="text-xs text-muted-foreground">No experience added yet.</p>}
      <div className="space-y-3">
        {items.map((item) => {
          const open = openId === item.id
          return (
            <div key={item.id} className="rounded-lg border border-border">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : item.id)}
                className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left"
              >
                <span className="truncate text-sm font-medium text-foreground">
                  {item.title || item.company ? `${item.title || 'Untitled role'}${item.company ? ' · ' + item.company : ''}` : 'New experience'}
                </span>
                <span className="flex shrink-0 items-center gap-1">
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => { e.stopPropagation(); remove(item.id) }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); remove(item.id) } }}
                    className="icon-btn"
                    aria-label="Remove experience"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </span>
                  {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </span>
              </button>
              {open && (
                <div className="space-y-3 border-t border-border p-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Job title" value={item.title} onChange={(e) => update(item.id, { title: e.target.value })} placeholder="Software Engineer Intern" />
                    <Field label="Company" value={item.company} onChange={(e) => update(item.id, { company: e.target.value })} placeholder="Acme Technologies" />
                    <Field label="Location" value={item.location} onChange={(e) => update(item.id, { location: e.target.value })} placeholder="Remote" />
                    <Field label="Period" value={item.period} onChange={(e) => update(item.id, { period: e.target.value })} placeholder="May 2025 - Jul 2025" />
                  </div>
                  <div>
                    <span className="field-label">Responsibilities & achievements</span>
                    <BulletList items={item.duties} onChange={(duties) => update(item.id, { duties })} />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </FormSection>
  )
}
