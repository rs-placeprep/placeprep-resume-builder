import type { InputHTMLAttributes } from 'react'
import clsx from 'clsx'

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  wrapperClassName?: string
}

export function Field({ label, className, wrapperClassName, ...rest }: FieldProps) {
  return (
    <label className={clsx('block', wrapperClassName)}>
      <span className="field-label">{label}</span>
      <input className={clsx('field-input', className)} {...rest} />
    </label>
  )
}
