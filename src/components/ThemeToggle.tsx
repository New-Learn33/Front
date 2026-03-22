import { useTheme } from '@/hooks/useTheme'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      className="fixed bottom-5 right-5 z-[100] inline-flex items-center gap-2 rounded-full border border-[#dde7f1] dark:border-orange-900/40 bg-white/90 dark:bg-surface-dark/90 px-4 py-2 text-xs font-bold text-[#5e5452] dark:text-slate-200 shadow-lg backdrop-blur-md transition-colors hover:border-primary hover:text-primary"
    >
      <span className="material-symbols-outlined text-base">{isDark ? 'light_mode' : 'dark_mode'}</span>
      {isDark ? '라이트' : '다크'}
    </button>
  )
}
