import { Plus, X, GripVertical } from 'lucide-react'

interface BulletListProps {
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
}

// Editable list of single-line bullets, used for job duties / achievements.
export function BulletList({ items, onChange, placeholder = 'Describe an achievement or responsibility...' }: BulletListProps) {
  const updateAt = (i: number, value: string) => {
    const next = [...items]
    next[i] = value
    onChange(next)
  }

  const removeAt = (i: number) => {
    onChange(items.filter((_, idx) => idx !== i))
  }

  const add = () => onChange([...items, ''])

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <GripVertical className="mt-2.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
          <textarea
            value={item}
            onChange={(e) => updateAt(i, e.target.value)}
            placeholder={placeholder}
            rows={2}
            className="field-textarea flex-1 text-xs"
          />
          <button type="button" onClick={() => removeAt(i)} className="icon-btn mt-0.5 shrink-0" aria-label="Remove bullet">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className="add-btn">
        <Plus className="h-3.5 w-3.5" />
        Add bullet point
      </button>
    </div>
  )
}
