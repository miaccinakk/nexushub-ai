export const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20"

export interface FieldCellProps {
  id: string
  label: string
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  hint?: string
  type?: "input" | "textarea"
  full?: boolean
  rows?: number
}

export function FieldCell({
  id,
  label,
  value,
  onValueChange,
  placeholder,
  hint,
  type = "input",
  full = false,
  rows = 3,
}: FieldCellProps) {
  return (
    <div
      className={`flex flex-col gap-1.5 rounded-lg border border-border bg-card p-3.5 ${full ? "sm:col-span-2" : ""}`}
    >
      <label htmlFor={id} className="text-xs font-semibold tracking-tight text-foreground">
        {label}
      </label>
      {hint ? <p className="-mt-1 text-[11px] leading-snug text-muted-foreground">{hint}</p> : null}
      {type === "textarea" ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`${inputClass} resize-none`}
        />
      ) : (
        <input
          id={id}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
    </div>
  )
}
