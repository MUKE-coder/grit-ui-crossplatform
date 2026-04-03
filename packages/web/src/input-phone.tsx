import * as React from 'react'
import { cn } from '@grit-ui/core'

/* ---------------------------------- Data ----------------------------------- */

interface CountryCode {
  code: string
  dial: string
  flag: string
}

const COUNTRIES: CountryCode[] = [
  { code: 'US', dial: '+1', flag: 'US' },
  { code: 'GB', dial: '+44', flag: 'GB' },
  { code: 'CA', dial: '+1', flag: 'CA' },
  { code: 'AU', dial: '+61', flag: 'AU' },
  { code: 'DE', dial: '+49', flag: 'DE' },
  { code: 'FR', dial: '+33', flag: 'FR' },
  { code: 'IN', dial: '+91', flag: 'IN' },
  { code: 'JP', dial: '+81', flag: 'JP' },
  { code: 'BR', dial: '+55', flag: 'BR' },
  { code: 'MX', dial: '+52', flag: 'MX' },
  { code: 'NG', dial: '+234', flag: 'NG' },
  { code: 'KE', dial: '+254', flag: 'KE' },
  { code: 'ZA', dial: '+27', flag: 'ZA' },
  { code: 'UG', dial: '+256', flag: 'UG' },
  { code: 'GH', dial: '+233', flag: 'GH' },
  { code: 'CN', dial: '+86', flag: 'CN' },
  { code: 'KR', dial: '+82', flag: 'KR' },
  { code: 'IT', dial: '+39', flag: 'IT' },
  { code: 'ES', dial: '+34', flag: 'ES' },
  { code: 'NL', dial: '+31', flag: 'NL' },
]

/* ---------------------------------- Props ---------------------------------- */

/** Props for the InputPhone component. */
export interface InputPhoneProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  /** Full phone value including dial code (e.g., "+1 555-123-4567"). */
  value?: string
  /** Callback with the full formatted phone number. */
  onChange?: (value: string) => void
  /** Default country code. */
  defaultCountry?: string
  /** List of country codes to display. Defaults to built-in list. */
  countries?: CountryCode[]
}

/**
 * Phone number input with country code dropdown.
 * Formats the number as you type.
 *
 * @example
 * ```tsx
 * <InputPhone
 *   value={phone}
 *   onChange={setPhone}
 *   defaultCountry="US"
 * />
 * ```
 */
const InputPhone = React.forwardRef<HTMLInputElement, InputPhoneProps>(
  ({ className, value, onChange, defaultCountry = 'US', countries = COUNTRIES, disabled, ...props }, ref) => {
    const [selectedCountry, setSelectedCountry] = React.useState<CountryCode>(
      () => countries.find((c) => c.code === defaultCountry) ?? countries[0]
    )
    const [localNumber, setLocalNumber] = React.useState('')
    const [dropdownOpen, setDropdownOpen] = React.useState(false)
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    // Parse initial value
    React.useEffect(() => {
      if (value) {
        const country = countries.find((c) => value.startsWith(c.dial))
        if (country) {
          setSelectedCountry(country)
          setLocalNumber(value.slice(country.dial.length).trim())
        }
      }
    }, []) // Only on mount

    const formatPhone = (raw: string): string => {
      const digits = raw.replace(/\D/g, '')
      if (digits.length <= 3) return digits
      if (digits.length <= 6) return digits.slice(0, 3) + '-' + digits.slice(3)
      return digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6, 10)
    }

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^\d-]/g, '')
      const formatted = formatPhone(raw)
      setLocalNumber(formatted)
      onChange?.(selectedCountry.dial + ' ' + formatted)
    }

    const handleCountrySelect = (country: CountryCode) => {
      setSelectedCountry(country)
      setDropdownOpen(false)
      onChange?.(country.dial + ' ' + localNumber)
    }

    // Close dropdown on click outside
    React.useEffect(() => {
      if (!dropdownOpen) return
      const handler = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          setDropdownOpen(false)
        }
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }, [dropdownOpen])

    return (
      <div ref={dropdownRef} className={cn('relative flex', className)}>
        {/* Country selector */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="inline-flex h-10 items-center gap-1 rounded-l-md border border-r-0 border-input bg-background px-3 text-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="text-xs">{selectedCountry.flag}</span>
          <span>{selectedCountry.dial}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {/* Number input */}
        <input
          ref={ref}
          type="tel"
          disabled={disabled}
          value={localNumber}
          onChange={handleNumberChange}
          placeholder="555-123-4567"
          className={cn(
            'flex h-10 w-full rounded-r-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
          )}
          {...props}
        />

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute left-0 top-full z-50 mt-1 max-h-60 w-56 overflow-auto rounded-md border bg-popover p-1 shadow-md">
            {countries.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => handleCountrySelect(country)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground',
                  country.code === selectedCountry.code && 'bg-accent text-accent-foreground'
                )}
              >
                <span className="text-xs">{country.flag}</span>
                <span>{country.code}</span>
                <span className="ml-auto text-muted-foreground">{country.dial}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }
)
InputPhone.displayName = 'InputPhone'

export { InputPhone, COUNTRIES }
export type { CountryCode }
