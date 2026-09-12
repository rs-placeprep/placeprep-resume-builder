export interface FontOption {
  value: string
  label: string
  stack: string
  pdfFont: 'helvetica' | 'times'
}

export const FONT_OPTIONS: FontOption[] = [
  { value: 'inter', label: 'Inter', stack: '"Inter", system-ui, sans-serif', pdfFont: 'helvetica' },
  { value: 'aptos', label: 'Aptos', stack: '"Aptos", "Calibri", "Segoe UI", sans-serif', pdfFont: 'helvetica' },
  { value: 'helvetica', label: 'Helvetica', stack: '"Helvetica Neue", Helvetica, Arial, sans-serif', pdfFont: 'helvetica' },
  { value: 'arial', label: 'Arial', stack: 'Arial, Helvetica, sans-serif', pdfFont: 'helvetica' },
  { value: 'source-sans-3', label: 'Source Sans 3', stack: '"Source Sans 3", sans-serif', pdfFont: 'helvetica' },
  { value: 'ibm-plex-sans', label: 'IBM Plex Sans', stack: '"IBM Plex Sans", sans-serif', pdfFont: 'helvetica' },
  { value: 'roboto', label: 'Roboto', stack: 'Roboto, sans-serif', pdfFont: 'helvetica' },
  { value: 'calibri', label: 'Calibri', stack: 'Calibri, Candara, "Segoe UI", sans-serif', pdfFont: 'helvetica' },
  { value: 'georgia', label: 'Georgia', stack: 'Georgia, "Times New Roman", serif', pdfFont: 'times' },
  { value: 'times-new-roman', label: 'Times New Roman', stack: '"Times New Roman", Times, serif', pdfFont: 'times' },
]

export function getFontStack(value: string) {
  return FONT_OPTIONS.find((f) => f.value === value)?.stack ?? FONT_OPTIONS[0].stack
}

export function getPdfFont(value: string) {
  return FONT_OPTIONS.find((f) => f.value === value)?.pdfFont ?? 'helvetica'
}
