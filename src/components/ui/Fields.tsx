'use client';

import { useId } from 'react';
import type { LucideIcon } from 'lucide-react';

const controlClasses =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[15px] text-slate-900 ' +
  'shadow-sm transition-colors placeholder:text-slate-400 hover:border-slate-300 ' +
  'focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10';

interface FieldLabelProps {
  htmlFor: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  srOnly?: boolean;
}

function FieldLabel({ htmlFor, icon: Icon, children, srOnly }: FieldLabelProps) {
  if (srOnly) {
    return (
      <label htmlFor={htmlFor} className="sr-only">
        {children}
      </label>
    );
  }

  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700"
    >
      {Icon && <Icon className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />}
      {children}
    </label>
  );
}

export interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'tel' | 'email' | 'url';
  placeholder?: string;
  icon?: LucideIcon;
  autoComplete?: string;
  inputMode?: 'text' | 'tel' | 'email' | 'url' | 'numeric';
  hint?: string;
  /** Hide the label visually but keep it for assistive tech (e.g. address rows). */
  labelHidden?: boolean;
}

export function TextField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  icon,
  autoComplete,
  inputMode,
  hint,
  labelHidden
}: TextFieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div>
      <FieldLabel htmlFor={id} icon={icon} srOnly={labelHidden}>
        {label}
      </FieldLabel>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-describedby={hintId}
        className={controlClasses}
      />
      {hint && (
        <p id={hintId} className="mt-1.5 text-xs text-slate-500">
          {hint}
        </p>
      )}
    </div>
  );
}

export interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: LucideIcon;
  rows?: number;
  maxLength?: number;
  labelHidden?: boolean;
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  icon,
  rows = 3,
  maxLength,
  labelHidden
}: TextAreaFieldProps) {
  const id = useId();

  return (
    <div>
      <FieldLabel htmlFor={id} icon={icon} srOnly={labelHidden}>
        {label}
      </FieldLabel>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`${controlClasses} resize-y`}
      />
      {maxLength && (
        <p className="mt-1.5 text-right text-xs text-slate-400">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
}
