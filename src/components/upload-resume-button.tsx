import { useRef } from 'react'
import { Upload } from 'lucide-react'
import { readResumeBackupFile } from '@/lib/resume-backup'
import type { ParsedBackup } from '@/lib/resume-backup'

interface Props {
  onLoaded: (backup: ParsedBackup) => void
  onError: (message: string) => void
  className?: string
  children?: React.ReactNode
  label?: string
}

export function UploadResumeButton({ onLoaded, onError, className, children, label = 'Upload JSON' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    // Reset immediately so picking the same file twice still fires a change event.
    e.target.value = ''
    if (!file) return

    try {
      onLoaded(await readResumeBackupFile(file))
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Could not read that file.')
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleFile}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />
      <button type="button" onClick={() => inputRef.current?.click()} className={className} title="Upload a saved resume JSON">
        {children ?? (
          <>
            <Upload className="h-3.5 w-3.5" />
            {label}
          </>
        )}
      </button>
    </>
  )
}
