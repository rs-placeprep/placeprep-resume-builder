import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import type { ProjectItem } from '@/types'
import { FormSection } from './form-section'
import { Field } from './field'

interface Props {
  items: ProjectItem[]
  onChange: (items: ProjectItem[]) => void
}

function makeItem(): ProjectItem {
  return { id: crypto.randomUUID(), name: '', tech: '', link: '', desc: '' }
}

export function ProjectsForm({ items, onChange }: Props) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null)

  const update = (id: string, patch: Partial<ProjectItem>) =>
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)))

  const remove = (id: string) => onChange(items.filter((it) => it.id !== id))

  const add = () => {
    const item = makeItem()
    onChange([...items, item])
    setOpenId(item.id)
  }

  return (
    <FormSection
      title="Projects"
      description="Personal, academic or open-source projects. Mention scale or impact if you can."
      action={
        <button type="button" onClick={add} className="add-btn">
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      }
    >
      {items.length === 0 && <p className="text-xs text-muted-foreground">No projects added yet.</p>}
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
                <span className="truncate text-sm font-medium text-foreground">{item.name || 'New project'}</span>
                <span className="flex shrink-0 items-center gap-1">
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => { e.stopPropagation(); remove(item.id) }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); remove(item.id) } }}
                    className="icon-btn"
                    aria-label="Remove project"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </span>
                  {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </span>
              </button>
              {open && (
                <div className="space-y-3 border-t border-border p-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Project name" value={item.name} onChange={(e) => update(item.id, { name: e.target.value })} placeholder="PlacePrep Tracker" />
                    <Field label="Tech stack" value={item.tech} onChange={(e) => update(item.id, { tech: e.target.value })} placeholder="React, Node.js, MongoDB" />
                    <Field label="Link (optional)" value={item.link} onChange={(e) => update(item.id, { link: e.target.value })} placeholder="github.com/you/project" wrapperClassName="sm:col-span-2" />
                  </div>
                  <label className="block">
                    <span className="field-label">Description</span>
                    <textarea
                      value={item.desc}
                      onChange={(e) => update(item.id, { desc: e.target.value })}
                      rows={2}
                      placeholder="What it does, and any measurable impact/scale."
                      className="field-textarea text-sm"
                    />
                  </label>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </FormSection>
  )
}
