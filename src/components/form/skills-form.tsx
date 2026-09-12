import { Plus, Trash2 } from 'lucide-react'
import type { SkillGroup } from '@/types'
import { FormSection } from './form-section'
import { Field } from './field'

interface Props {
  items: SkillGroup[]
  onChange: (items: SkillGroup[]) => void
}

function makeItem(): SkillGroup {
  return { id: crypto.randomUUID(), label: '', items: '' }
}

export function SkillsForm({ items, onChange }: Props) {
  const update = (id: string, patch: Partial<SkillGroup>) =>
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)))

  const remove = (id: string) => onChange(items.filter((it) => it.id !== id))
  const add = () => onChange([...items, makeItem()])

  return (
    <FormSection
      title="Skills"
      description="Group skills by category. Comma-separate items within a group."
      action={
        <button type="button" onClick={add} className="add-btn">
          <Plus className="h-3.5 w-3.5" />
          Add group
        </button>
      }
    >
      {items.length === 0 && <p className="text-xs text-muted-foreground">No skill groups added yet.</p>}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-2">
            <Field
              label="Category"
              value={item.label}
              onChange={(e) => update(item.id, { label: e.target.value })}
              placeholder="Languages"
              wrapperClassName="w-36 shrink-0"
            />
            <Field
              label="Skills (comma-separated)"
              value={item.items}
              onChange={(e) => update(item.id, { items: e.target.value })}
              placeholder="C++, Python, JavaScript, SQL"
              wrapperClassName="flex-1"
            />
            <button type="button" onClick={() => remove(item.id)} className="icon-btn mt-6 shrink-0" aria-label="Remove skill group">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </FormSection>
  )
}
