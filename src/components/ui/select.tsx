import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown } from 'lucide-react'
import clsx from 'clsx'

export interface SelectOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: readonly SelectOption[]
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
  size?: 'sm' | 'md'
  tone?: 'default' | 'primary'
  className?: string
  id?: string
  name?: string
  ariaLabel?: string
  ariaLabelledBy?: string
  searchThreshold?: number
}

const MENU_MARGIN = 8
const MENU_MAX_HEIGHT = 288

export function Select({
  value,
  onChange,
  options,
  placeholder = 'Select…',
  disabled = false,
  invalid = false,
  size = 'md',
  tone = 'default',
  className,
  id,
  name,
  ariaLabel,
  ariaLabelledBy,
  searchThreshold = 8,
}: SelectProps) {
  const generatedId = useId()
  const listId = `${id ?? generatedId}-listbox`

  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const optionRefs = useRef<(HTMLDivElement | null)[]>([])
  const typeahead = useRef({ query: '', at: 0 })

  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, maxHeight: MENU_MAX_HEIGHT, above: false })

  useEffect(() => setMounted(true), [])

  const selected = useMemo(() => options.find((o) => o.value === value) ?? null, [options, value])
  const showSearch = searchThreshold >= 0 && options.length >= searchThreshold

  const visible = useMemo(() => {
    if (!showSearch || !query.trim()) return options
    const q = query.trim().toLowerCase()
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || o.description?.toLowerCase().includes(q),
    )
  }, [options, query, showSearch])

  const place = useCallback(() => {
    const el = triggerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const below = window.innerHeight - rect.bottom - MENU_MARGIN
    const above = rect.top - MENU_MARGIN
    const openAbove = below < 180 && above > below
    setPosition({
      top: openAbove ? rect.top - MENU_MARGIN : rect.bottom + MENU_MARGIN,
      left: rect.left,
      width: rect.width,
      maxHeight: Math.min(MENU_MAX_HEIGHT, Math.max(openAbove ? above : below, 140)),
      above: openAbove,
    })
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    place()
    const onScroll = () => place()
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [open, place])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => document.removeEventListener('pointerdown', onPointerDown, true)
  }, [open])

  useEffect(() => {
    if (open) {
      const index = visible.findIndex((o) => o.value === value)
      setActiveIndex(index >= 0 ? index : visible.findIndex((o) => !o.disabled))
      if (showSearch) requestAnimationFrame(() => searchRef.current?.focus())
    } else {
      setQuery('')
      setActiveIndex(-1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (!open || activeIndex < 0) return
    optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open])

  const step = useCallback(
    (from: number, dir: 1 | -1) => {
      if (visible.length === 0) return -1
      let next = from
      for (let i = 0; i < visible.length; i += 1) {
        next = (next + dir + visible.length) % visible.length
        if (!visible[next]?.disabled) return next
      }
      return -1
    },
    [visible],
  )

  const commit = useCallback(
    (option: SelectOption | undefined) => {
      if (!option || option.disabled) return
      onChange(option.value)
      setOpen(false)
      requestAnimationFrame(() => triggerRef.current?.focus())
    },
    [onChange],
  )

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return

    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        requestAnimationFrame(() => triggerRef.current?.focus())
        break
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((i) => step(i, 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((i) => step(i, -1))
        break
      case 'Home':
        e.preventDefault()
        setActiveIndex(step(-1, 1))
        break
      case 'End':
        e.preventDefault()
        setActiveIndex(step(0, -1))
        break
      case 'Enter':
      case ' ':
        if (e.key === ' ' && showSearch) return
        e.preventDefault()
        commit(visible[activeIndex])
        break
      case 'Tab':
        setOpen(false)
        break
      default: {
        if (showSearch || e.key.length !== 1) return
        const now = Date.now()
        typeahead.current.query = now - typeahead.current.at > 600 ? e.key : typeahead.current.query + e.key
        typeahead.current.at = now
        const q = typeahead.current.query.toLowerCase()
        const found = visible.findIndex((o) => !o.disabled && o.label.toLowerCase().startsWith(q))
        if (found >= 0) setActiveIndex(found)
      }
    }
  }

  const compact = size === 'sm'

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? listId : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        className={clsx(
          'group flex w-full items-center justify-between gap-2 rounded-xl border text-left transition-all duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
          'disabled:cursor-not-allowed disabled:opacity-60',
          compact ? 'px-3 py-1.5 text-xs' : 'px-3.5 py-2.5 text-sm',
          tone === 'primary'
            ? 'border-primary/40 bg-primary/[0.08] font-medium text-primary hover:border-primary/60 hover:bg-primary/[0.12]'
            : 'border-border bg-background hover:border-primary/40 hover:bg-muted/40',
          invalid && 'border-red-500 hover:border-red-500',
          open && tone !== 'primary' && 'border-primary/50 bg-muted/30',
          className,
        )}
      >
        <span className={clsx('min-w-0 flex-1 truncate', !selected && 'text-muted-foreground')}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={clsx(
            'h-4 w-4 shrink-0 transition-transform duration-200',
            tone === 'primary' ? 'text-primary' : 'text-muted-foreground group-hover:text-primary',
            open && 'rotate-180',
          )}
        />
      </button>

      {name && <input type="hidden" name={name} value={value} />}

      {mounted && open
        ? createPortal(
            <div
              ref={menuRef}
              className="fixed z-[100] overflow-hidden rounded-xl border border-border bg-card shadow-[0_20px_50px_-16px_rgba(0,0,0,0.35)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.75)]"
              style={{
                top: position.above ? undefined : position.top,
                bottom: position.above ? window.innerHeight - position.top : undefined,
                left: position.left,
                width: position.width,
                maxHeight: position.maxHeight,
              }}
              onKeyDown={onKeyDown}
            >
              {showSearch && (
                <div className="border-b border-border/70 p-2">
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value)
                      setActiveIndex(0)
                    }}
                    placeholder="Search…"
                    className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/40"
                  />
                </div>
              )}

              <div
                id={listId}
                role="listbox"
                aria-label={ariaLabel}
                className="overflow-y-auto overscroll-contain p-1"
                style={{ maxHeight: position.maxHeight - (showSearch ? 52 : 0) }}
              >
                {visible.length === 0 && (
                  <p className="px-3 py-6 text-center text-xs text-muted-foreground">No matches</p>
                )}

                {visible.map((option, index) => {
                  const isSelected = option.value === value
                  return (
                    <div
                      key={option.value}
                      ref={(el) => {
                        optionRefs.current[index] = el
                      }}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled || undefined}
                      onPointerEnter={() => !option.disabled && setActiveIndex(index)}
                      onClick={() => commit(option)}
                      className={clsx(
                        'flex cursor-pointer items-start gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors',
                        option.disabled && 'cursor-not-allowed opacity-40',
                        !option.disabled && index === activeIndex && 'bg-primary/[0.10] text-primary',
                        !option.disabled && index !== activeIndex && 'text-foreground',
                      )}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">{option.label}</span>
                        {option.description && (
                          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                            {option.description}
                          </span>
                        )}
                      </span>
                      {isSelected && <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />}
                    </div>
                  )
                })}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
