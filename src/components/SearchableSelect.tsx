import { useEffect, useMemo, useRef, useState } from 'react';

export type Option = { code: string; label: string; terms?: string[] };

type Props = {
  options: Option[];
  value: string | string[]; // selected code(s)
  onChange: (code: string | string[]) => void;
  placeholder?: string;
  ariaLabel?: string;
  multiple?: boolean;
};

export default function SearchableSelect({ options, value, onChange, placeholder = 'Select…', ariaLabel = 'Searchable select', multiple = false }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedCodes = Array.isArray(value) ? value : value ? [value] : [];
  const selectedLabels = useMemo(() => {
    return selectedCodes
      .map((code) => options.find((o) => o.code === code)?.label)
      .filter(Boolean)
      .join(', ');
  }, [options, selectedCodes]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => {
      if (o.label.toLowerCase().includes(q)) return true;
      const terms = o.terms || [];
      return terms.some((t) => t.toLowerCase().includes(q));
    });
  }, [options, query]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    // Reset highlight when list changes
    setHighlight(0);
  }, [open, query]);

  function commitSelection(opt: Option) {
    if (multiple) {
      const newValues = selectedCodes.includes(opt.code)
        ? selectedCodes.filter((c) => c !== opt.code)
        : [...selectedCodes, opt.code];
      onChange(newValues.length === 0 ? '' : newValues);
      // Keep menu open in multiselect mode
      inputRef.current?.focus();
    } else {
      onChange(opt.code);
      setOpen(false);
      setQuery('');
      // Keep focus on input for quick re-filter
      inputRef.current?.focus();
    }
  }

  return (
    <div
      className="searchable-select"
      ref={ref}
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls="searchable-select-list"
    >
      <input
        ref={inputRef}
        className="searchable-select-input"
        type="text"
        aria-label={ariaLabel}
        placeholder={placeholder}
        value={open ? query : selectedLabels || ''}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
            setOpen(true);
            return;
          }
          if (e.key === 'ArrowDown') {
            setHighlight((h) => Math.min(h + 1, Math.max(filtered.length - 1, 0)));
          } else if (e.key === 'ArrowUp') {
            setHighlight((h) => Math.max(h - 1, 0));
          } else if (e.key === 'Enter') {
            const opt = filtered[highlight];
            if (opt) commitSelection(opt);
          } else if (e.key === 'Escape') {
            setOpen(false);
            setQuery('');
          }
        }}
      />

      {open && (
        <div className="select-menu" role="listbox" id="searchable-select-list">
          {filtered.length === 0 ? (
            <div className="select-empty">No matches</div>
          ) : (
            filtered.map((opt, idx) => (
              <div
                key={opt.code}
                role="option"
                aria-selected={selectedCodes.includes(opt.code)}
                className={`select-option${idx === highlight ? ' active' : ''}`}
                onMouseEnter={() => setHighlight(idx)}
                onClick={() => commitSelection(opt)}
              >
                {multiple && (
                  <input
                    type="checkbox"
                    checked={selectedCodes.includes(opt.code)}
                    readOnly
                    className="select-checkbox"
                  />
                )}
                {opt.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
