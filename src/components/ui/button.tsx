import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost'
  size?: 'sm' | 'md'
}

export function Button({ variant = 'outline', size = 'md', className, children, ...rest }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none'
  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-9 px-4 text-sm',
  }
  const variants = {
    solid: 'bg-foreground text-background hover:bg-foreground/90',
    outline: 'border border-border bg-background hover:border-primary/40 hover:bg-primary/[0.06]',
    ghost: 'hover:bg-muted text-muted-foreground hover:text-foreground',
  }

  return (
    <button className={clsx(base, sizes[size], variants[variant], className)} {...rest}>
      {children}
    </button>
  )
}
