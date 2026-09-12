import type { PersonalInfo } from '@/types'
import { FormSection } from './form-section'
import { Field } from './field'

interface Props {
  data: PersonalInfo
  onChange: (data: PersonalInfo) => void
}

export function PersonalForm({ data, onChange }: Props) {
  const set = <K extends keyof PersonalInfo>(key: K, value: PersonalInfo[K]) =>
    onChange({ ...data, [key]: value })

  return (
    <FormSection title="Personal details" description="How employers reach you. Keep it accurate and professional.">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Full name" value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Jane Doe" />
        <Field label="Job title / role" value={data.title} onChange={(e) => set('title', e.target.value)} placeholder="Software Engineer" />
        <Field label="Email" type="email" value={data.email} onChange={(e) => set('email', e.target.value)} placeholder="jane@email.com" />
        <Field label="Phone" value={data.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 98765 43210" />
        <Field label="Location" value={data.location} onChange={(e) => set('location', e.target.value)} placeholder="Bangalore, India" />
        <Field label="LinkedIn" value={data.linkedin} onChange={(e) => set('linkedin', e.target.value)} placeholder="linkedin.com/in/janedoe" />
        <Field label="GitHub" value={data.github} onChange={(e) => set('github', e.target.value)} placeholder="github.com/janedoe" />
        <Field label="Website / Portfolio" value={data.website} onChange={(e) => set('website', e.target.value)} placeholder="janedoe.dev" />
      </div>
    </FormSection>
  )
}
