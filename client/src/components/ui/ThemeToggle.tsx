'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="w-9 h-9" aria-hidden="true" />;

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-9 h-9 flex items-center justify-center rounded-full
                       border border-[var(--border)] text-[var(--text-secondary)]
                       hover:border-[var(--burgundy)] hover:text-[var(--burgundy)]
                       transition-all duration-200"
        >
            {theme === 'dark'
                ? <Sun size={16} strokeWidth={2} />
                : <Moon size={16} strokeWidth={2} />
            }
        </button>
    );
}
