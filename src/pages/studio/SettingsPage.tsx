import { useState, useEffect } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { settingsApi } from '../../api/settings'

export default function SettingsPage() {
  const { isDark, toggleTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [quality, setQuality] = useState('high')
  const [language, setLanguage] = useState('ko')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // 설정 불러오기
  useEffect(() => {
    settingsApi.get()
      .then((res) => {
        const s = res.data.data.settings
        setNotifications(s.notifications_enabled)
        setAutoSave(s.auto_save)
        setQuality(s.default_quality)
        setLanguage(s.language)
      })
      .catch(() => {
        // 실패 시 기본값 유지
      })
      .finally(() => setLoading(false))
  }, [])

  // 설정 저장
  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      await settingsApi.update({
        notifications_enabled: notifications,
        auto_save: autoSave,
        default_quality: quality,
        language: language,
      })
      setMessage({ type: 'success', text: '설정이 저장되었습니다.' })
    } catch {
      setMessage({ type: 'error', text: '설정 저장에 실패했습니다.' })
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-8 stagger-children">
      <div>
        <h1 className="text-2xl font-bold text-[#2d2926]">환경설정</h1>
        <p className="text-warm-muted text-sm mt-1">앱 설정을 관리합니다.</p>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-2xl border border-[#dde7f1] p-6 space-y-5">
        <h2 className="text-base font-bold text-[#2d2926]">일반 설정</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-[#2d2926]">다크 모드</p>
              <p className="text-xs text-warm-muted">어두운 테마로 전환합니다.</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-11 h-6 rounded-full transition-all ${isDark ? 'bg-primary' : 'bg-[#dde7f1]'}`}
            >
              <div className={`size-5 bg-white rounded-full shadow transition-transform ${isDark ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-[#dde7f1]">
            <div>
              <p className="text-sm font-medium text-[#2d2926]">알림</p>
              <p className="text-xs text-warm-muted">앱 내 알림을 받습니다.</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-11 h-6 rounded-full transition-all ${notifications ? 'bg-primary' : 'bg-[#dde7f1]'}`}
            >
              <div className={`size-5 bg-white rounded-full shadow transition-transform ${notifications ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-[#dde7f1]">
            <div>
              <p className="text-sm font-medium text-[#2d2926]">자동 저장</p>
              <p className="text-xs text-warm-muted">프로젝트를 자동으로 저장합니다.</p>
            </div>
            <button
              onClick={() => setAutoSave(!autoSave)}
              className={`w-11 h-6 rounded-full transition-all ${autoSave ? 'bg-primary' : 'bg-[#dde7f1]'}`}
            >
              <div className={`size-5 bg-white rounded-full shadow transition-transform ${autoSave ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Video Settings */}
      <div className="bg-white rounded-2xl border border-[#dde7f1] p-6 space-y-5">
        <h2 className="text-base font-bold text-[#2d2926]">영상 설정</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#2d2926]">기본 화질</label>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-[#dde7f1] bg-[#f5f9fd] text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="low">저화질 (480p)</option>
              <option value="medium">중화질 (720p)</option>
              <option value="high">고화질 (1080p)</option>
              <option value="ultra">초고화질 (4K)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#2d2926]">언어</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-[#dde7f1] bg-[#f5f9fd] text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="ko">한국어</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center justify-end gap-4">
        {message && (
          <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
            {message.text}
          </p>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-[#58717c] text-white font-bold px-8 py-3 rounded-xl transition-all btn-press disabled:opacity-50"
        >
          {saving ? '저장 중...' : '변경사항 저장'}
        </button>
      </div>
    </div>
  )
}
