import type { ResumeTemplate } from '@/types'

export interface TemplateOption {
  value: ResumeTemplate
  label: string
  description: string
}

export interface TemplateSpec {
  headerAlign: 'left' | 'center'
  nameCase: 'none' | 'uppercase'
  nameTracking: string
  headerRule: boolean
  headerRuleWidth: number
  sectionRule: boolean
  sectionRuleWidth: number
  headingTracking: string
  headingGap: number
  sectionGap: number
  itemGap: number
  padX: number
  padY: number
  subtitleItalic: boolean
  stackMeta: boolean
}

export const TEMPLATE_OPTIONS: TemplateOption[] = [
  { value: 'classic', label: 'Classic', description: 'Centered header, ruled sections' },
  { value: 'modern', label: 'Modern', description: 'Left header, heavy rules, tight grid' },
  { value: 'minimal', label: 'Minimal', description: 'Wide caps, no rules, open spacing' },
]

const SPECS: Record<ResumeTemplate, TemplateSpec> = {
  classic: {
    headerAlign: 'center',
    nameCase: 'none',
    nameTracking: '-0.01em',
    headerRule: true,
    headerRuleWidth: 1,
    sectionRule: true,
    sectionRuleWidth: 1,
    headingTracking: '0.06em',
    headingGap: 6,
    sectionGap: 14,
    itemGap: 10,
    padX: 56,
    padY: 48,
    subtitleItalic: true,
    stackMeta: false,
  },
  modern: {
    headerAlign: 'left',
    nameCase: 'none',
    nameTracking: '-0.02em',
    headerRule: true,
    headerRuleWidth: 2.5,
    sectionRule: true,
    sectionRuleWidth: 2,
    headingTracking: '0.14em',
    headingGap: 7,
    sectionGap: 16,
    itemGap: 11,
    padX: 52,
    padY: 44,
    subtitleItalic: false,
    stackMeta: false,
  },
  minimal: {
    headerAlign: 'center',
    nameCase: 'uppercase',
    nameTracking: '0.14em',
    headerRule: false,
    headerRuleWidth: 0,
    sectionRule: false,
    sectionRuleWidth: 0,
    headingTracking: '0.26em',
    headingGap: 9,
    sectionGap: 22,
    itemGap: 13,
    padX: 68,
    padY: 58,
    subtitleItalic: false,
    stackMeta: false,
  },
}

export function getTemplateSpec(template: ResumeTemplate): TemplateSpec {
  return SPECS[template] ?? SPECS.classic
}
