'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import { COUNTRY_CODES, DEFAULT_COUNTRY_CODE } from '@/config/constants';

interface PhoneInputProps {
  value: string;
  onChange: (fullPhone: string) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
  defaultCode?: string;
}

export function PhoneInput({
  value,
  onChange,
  className,
  placeholder = 'Phone number',
  required,
  defaultCode = DEFAULT_COUNTRY_CODE,
}: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const parsed = parsePhone(value, defaultCode);
  const [selectedCode, setSelectedCode] = useState(parsed.code);
  const [localNumber, setLocalNumber] = useState(parsed.number);

  const selectedCountry = COUNTRY_CODES.find((c) => c.code === selectedCode) || COUNTRY_CODES[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleCodeChange(code: string) {
    setSelectedCode(code);
    setOpen(false);
    onChange(`${code}${localNumber}`);
  }

  function handleNumberChange(num: string) {
    const cleaned = num.replace(/[^\d]/g, '');
    setLocalNumber(cleaned);
    onChange(`${selectedCode}${cleaned}`);
  }

  return (
    <div className={cn('relative flex', className)} ref={dropdownRef}>
      {/* Country Code Selector */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
      >
        <span>{selectedCountry.label}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 text-gray-400 transition-transform', open && 'rotate-180')} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 max-h-60 w-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {COUNTRY_CODES.map((country) => (
            <button
              key={country.code}
              type="button"
              onClick={() => handleCodeChange(country.code)}
              className={cn(
                'flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50',
                selectedCode === country.code && 'bg-primary-50 text-primary-700'
              )}
            >
              <span className="text-base">{country.label.split(' ')[0]}</span>
              <span className="flex-1 text-gray-700">{country.name}</span>
              <span className="text-gray-400">{country.code}</span>
            </button>
          ))}
        </div>
      )}

      {/* Phone Number Input */}
      <input
        type="tel"
        value={localNumber}
        onChange={(e) => handleNumberChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-r-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
      />
    </div>
  );
}

function parsePhone(phone: string, defaultCode: string): { code: string; number: string } {
  if (!phone) return { code: defaultCode, number: '' };

  for (const c of COUNTRY_CODES) {
    if (phone.startsWith(c.code)) {
      return { code: c.code, number: phone.slice(c.code.length) };
    }
  }

  return { code: defaultCode, number: phone };
}
