'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme, THEME_OPTIONS, ThemeMode } from '@/features/theme/ThemeContext';
import { Sun, Moon, Sparkles, ChevronDown, Check, Palette } from 'lucide-react';

interface ThemeSwitcherProps {
  compact?: boolean;
  className?: string;
}

export function ThemeSwitcher({ compact = false, className = '' }: ThemeSwitcherProps) {
  const { theme, setTheme, activeThemeOption } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded-xl border transition-all text-xs font-semibold ${
          compact
            ? 'px-2.5 py-1 bg-surface-2/90 hover:bg-surface-2 border-border text-text'
            : 'px-3 py-1.5 bg-surface-2 hover:bg-surface-3 border-border text-text shadow-sm'
        }`}
        title={`Current theme: ${activeThemeOption.name} - Click to change color theme`}
        aria-label="Select website color theme"
      >
        {/* Swatch indicator */}
        <div className="flex items-center -space-x-1">
          <span
            className="w-3 h-3 rounded-full border border-border/80 shadow-xs inline-block"
            style={{ backgroundColor: activeThemeOption.bgHex }}
          />
          <span
            className="w-2.5 h-2.5 rounded-full border border-white/30 shadow-xs inline-block"
            style={{ backgroundColor: activeThemeOption.accentHex }}
          />
        </div>

        <span className="hidden sm:inline font-medium text-text">
          {activeThemeOption.name.split(' ')[0]}
        </span>
        <span className="text-[10px] uppercase font-bold text-accent tracking-wider">
          {activeThemeOption.isLight ? 'Light' : 'Dark'}
        </span>

        <ChevronDown
          className={`w-3 h-3 text-muted transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-surface border border-border p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 backdrop-blur-xl">
          <div className="px-3 py-2 border-b border-border/60 mb-1 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-accent" />
              <p className="text-xs font-bold text-text uppercase tracking-wider">Luxury Themes</p>
            </div>
            <span className="text-[10px] text-muted font-medium">3 Curated Palettes</span>
          </div>

          <div className="space-y-1">
            {THEME_OPTIONS.map((opt) => {
              const isSelected = opt.id === theme;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setTheme(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-accent/15 border border-accent/40 text-text'
                      : 'hover:bg-surface-2 text-muted hover:text-text border border-transparent'
                  }`}
                >
                  {/* Swatch preview card */}
                  <div
                    className="w-9 h-9 rounded-lg border border-border/60 flex items-center justify-center shrink-0 shadow-sm relative overflow-hidden"
                    style={{ backgroundColor: opt.bgHex }}
                  >
                    <div
                      className="w-4 h-4 rounded-full shadow-md"
                      style={{ backgroundColor: opt.accentHex }}
                    />
                    {opt.isLight ? (
                      <Sun className="w-2.5 h-2.5 absolute top-1 right-1 opacity-70 text-slate-700" />
                    ) : (
                      <Moon className="w-2.5 h-2.5 absolute top-1 right-1 opacity-70 text-amber-200" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isSelected ? 'text-accent' : 'text-text'}`}>
                        {opt.name}
                      </span>
                      {isSelected ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-accent">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface-3 text-muted font-semibold uppercase">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted line-clamp-1 mt-0.5">
                      {opt.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-border/60 px-2 py-1 text-[10px] text-muted flex items-center justify-between">
            <span>Theme auto-saves to LocalStorage</span>
            <Sparkles className="w-3 h-3 text-accent" />
          </div>
        </div>
      )}
    </div>
  );
}
