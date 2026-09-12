import { Plus, Trash2 } from 'lucide-react'
import type { CertificationItem } from '@/types'
import { FormSection } from './form-section'
import { Field } from './field'
import { BulletList } from './bullet-list'

interface Props {
  certifications: CertificationItem[]
  onCertificationsChange: (items: CertificationItem[]) => void
  achievements: string[]
  onAchievementsChange: (items: string[]) => void
}

function makeCert(): CertificationItem {
  return { id: crypto.randomUUID(), name: '', year: '' }
}

export function ExtrasForm({ certifications, onCertificationsChange, achievements, onAchievementsChange }: Props) {
  const updateCert = (id: string, patch: Partial<CertificationItem>) =>
    onCertificationsChange(certifications.map((it) => (it.id === id ? { ...it, ...patch } : it)))

  const removeCert = (id: string) => onCertificationsChange(certifications.filter((it) => it.id !== id))
  const addCert = () => onCertificationsChange([...certifications, makeCert()])

  return (
    <>
      <FormSection
        title="Certifications"
        description="Optional. Only include ones relevant to the role."
        action={
          <button type="button" onClick={addCert} className="add-btn">
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        }
      >
        {certifications.length === 0 && <p className="text-xs text-muted-foreground">No certifications added yet.</p>}
        <div className="space-y-2">
          {certifications.map((item) => (
            <div key={item.id} className="flex items-end gap-2">
              <Field label="Name" value={item.name} onChange={(e) => updateCert(item.id, { name: e.target.value })} placeholder="AWS Certified Cloud Practitioner" wrapperClassName="flex-1" />
              <Field label="Year" value={item.year} onChange={(e) => updateCert(item.id, { year: e.target.value })} placeholder="2025" wrapperClassName="w-24 shrink-0" />
              <button type="button" onClick={() => removeCert(item.id)} className="icon-btn mb-0.5 shrink-0" aria-label="Remove certification">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection title="Achievements" description="Optional. Competition wins, notable recognitions, etc.">
        <BulletList items={achievements} onChange={onAchievementsChange} placeholder="Winner, Smart India Hackathon 2024" />
      </FormSection>
    </>
  )
}
