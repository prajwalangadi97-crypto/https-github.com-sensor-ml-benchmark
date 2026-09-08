import React, { useState } from 'react';
import { ThemeMode } from '../types';
import { Palette, Check } from 'lucide-react';

interface ThemeSwitcherProps {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

const THEMES: { id: ThemeMode; name: string; color: string; border: string }[] = [
  { id: 'industrial-dark', name: 'Industrial Dark', color: 'bg-cyan-500', border: 'border-cyan-400' },
  { id: 'precision-slate', name: 'Precision Slate', color: 'bg-sky-400', border: 'border-sky-300' },
  { id: 'cybernetic-emerald', name: 'Cybernetic Emerald', color: 'bg-emerald-500', border: 'border-emerald-400' },
  { id: 'clean-light', name: 'Clean Light', color: 'bg-blue-600', border: 'border-blue-500' },
  { id: 'obsidian-gold', name: 'Obsidian Gold', color: 'bg-amber-500', border: 'border-amber-400' },
  { id: 'aurora-blue', name: 'Aurora Blue', color: 'bg-indigo-500', border: 'border-indigo-400' },
];

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, onThemeChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeTheme = THEMES.find((t) => t.id === currentTheme) || THEMES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-slate-600 text-xs font-medium text-slate-200 transition-all shadow-sm"
        title="Select UI Color Theme"
      >
        <Palette className="w-3.5 h-3.5 text-cyan-400" />
        <span className="hidden sm:inline">{activeTheme.name}</span>
        <span className={`w-2.5 h-2.5 rounded-full ${activeTheme.color} shadow-sm`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 py-1 mb-1 border-b border-slate-800">
              Aesthetic Color Engine
            </div>
            <div className="space-y-1">
              {THEMES.map((theme) => {
                const isSelected = theme.id === currentTheme;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      onThemeChange(theme.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                      isSelected
                        ? 'bg-cyan-500/10 text-cyan-300 font-semibold border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${theme.color} ring-1 ring-white/20`} />
                      <span>{theme.name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
