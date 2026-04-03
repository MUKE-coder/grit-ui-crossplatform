import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * DragAndDrop variant definitions using CVA.
 */
const dragAndDropVariants = cva(
  'relative rounded-lg border-2 border-dashed transition-colors',
  {
    variants: {
      variant: {
        default: 'border-border hover:border-primary/50',
        active: 'border-primary bg-primary/5',
        error: 'border-destructive bg-destructive/5',
        success: 'border-emerald-500 bg-emerald-500/5',
      },
      size: {
        sm: 'p-4',
        default: 'p-8',
        lg: 'p-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

/** File with upload progress. */
export interface UploadFile {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'done' | 'error'
  error?: string
}

/** Props for the DragAndDrop component. */
export interface DragAndDropProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrop'>,
    VariantProps<typeof dragAndDropVariants> {
  /** Accepted file types (e.g., 'image/*', '.pdf'). */
  accept?: string
  /** Allow multiple file selection. */
  multiple?: boolean
  /** Maximum file size in bytes. */
  maxSize?: number
  /** Maximum number of files. */
  maxFiles?: number
  /** Called when files are dropped or selected. */
  onDrop?: (files: File[]) => void
  /** Called when files are rejected. */
  onReject?: (files: File[], reason: string) => void
  /** Whether the drop zone is disabled. */
  disabled?: boolean
  /** Files currently being tracked (for progress display). */
  files?: UploadFile[]
}

/** Props for DragAndDropContent. */
export interface DragAndDropContentProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Placeholder content area for the drop zone.
 *
 * @example
 * ```tsx
 * <DragAndDropContent>
 *   <p>Drop files here or click to browse</p>
 * </DragAndDropContent>
 * ```
 */
const DragAndDropContent = React.forwardRef<HTMLDivElement, DragAndDropContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col items-center justify-center gap-2 text-center pointer-events-none', className)} {...props} />
  )
)
DragAndDropContent.displayName = 'DragAndDropContent'

/**
 * File upload drop zone with drag-over state, file type filtering,
 * multiple file support, and progress indicator.
 *
 * @example
 * ```tsx
 * <DragAndDrop accept="image/*" multiple maxSize={5 * 1024 * 1024} onDrop={handleFiles}>
 *   <DragAndDropContent>
 *     <p className="text-muted-foreground">Drag images here or click to browse</p>
 *     <p className="text-xs text-muted-foreground">Max 5MB per file</p>
 *   </DragAndDropContent>
 * </DragAndDrop>
 * ```
 */
const DragAndDrop = React.forwardRef<HTMLDivElement, DragAndDropProps>(
  (
    {
      className,
      variant,
      size,
      accept,
      multiple = false,
      maxSize,
      maxFiles,
      onDrop,
      onReject,
      disabled = false,
      files,
      children,
      ...props
    },
    ref
  ) => {
    const [isDragOver, setIsDragOver] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const dragCounter = React.useRef(0)

    const acceptedTypes = React.useMemo(() => {
      if (!accept) return null
      return accept.split(',').map((t) => t.trim())
    }, [accept])

    const isFileAccepted = (file: File) => {
      if (!acceptedTypes) return true
      return acceptedTypes.some((type) => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase())
        }
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.replace('/*', '/'))
        }
        return file.type === type
      })
    }

    const processFiles = (fileList: FileList | File[]) => {
      const allFiles = Array.from(fileList)
      const accepted: File[] = []
      const rejected: File[] = []

      for (const file of allFiles) {
        if (!isFileAccepted(file)) {
          rejected.push(file)
          continue
        }
        if (maxSize && file.size > maxSize) {
          rejected.push(file)
          continue
        }
        accepted.push(file)
      }

      if (!multiple && accepted.length > 1) {
        onDrop?.([accepted[0]])
      } else if (maxFiles && accepted.length > maxFiles) {
        onDrop?.(accepted.slice(0, maxFiles))
        onReject?.(accepted.slice(maxFiles), 'Too many files')
      } else {
        if (accepted.length > 0) onDrop?.(accepted)
      }

      if (rejected.length > 0) {
        onReject?.(rejected, 'Files rejected (type or size)')
      }
    }

    const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dragCounter.current++
      if (e.dataTransfer.items?.length) setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dragCounter.current--
      if (dragCounter.current === 0) setIsDragOver(false)
    }

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)
      dragCounter.current = 0
      if (disabled) return
      if (e.dataTransfer.files?.length) {
        processFiles(e.dataTransfer.files)
      }
    }

    const handleClick = () => {
      if (disabled) return
      inputRef.current?.click()
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        processFiles(e.target.files)
        e.target.value = ''
      }
    }

    const activeVariant = isDragOver ? 'active' : variant

    return (
      <div
        ref={ref}
        className={cn(
          dragAndDropVariants({ variant: activeVariant, size }),
          'cursor-pointer select-none',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="File upload drop zone"
        {...props}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="sr-only"
          tabIndex={-1}
        />

        {children}

        {/* File progress list */}
        {files && files.length > 0 && (
          <div className="mt-4 space-y-2 pointer-events-auto w-full">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="flex-1 min-w-0">
                  <div className="truncate text-foreground">{f.file.name}</div>
                  <div className="h-1.5 w-full bg-muted rounded-full mt-1 overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-300',
                        f.status === 'error' ? 'bg-destructive' : f.status === 'done' ? 'bg-emerald-500' : 'bg-primary'
                      )}
                      style={{ width: f.progress + '%' }}
                    />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {f.status === 'done' ? 'Done' : f.status === 'error' ? f.error || 'Error' : f.progress + '%'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)
DragAndDrop.displayName = 'DragAndDrop'

export { DragAndDrop, dragAndDropVariants, DragAndDropContent }
