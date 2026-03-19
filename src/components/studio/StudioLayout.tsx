import { Outlet } from 'react-router-dom'
import StudioSidebar from './StudioSidebar'
import StudioHeader from './StudioHeader'
import aiVidLogo from '@/assets/AI_vid_logo.png'

export default function StudioLayout() {
  return (
    <div className="min-h-screen bg-[#f8fbff] font-display text-slate-900">
      <StudioSidebar />
      <div className="ml-64 flex min-h-screen flex-col">
        <StudioHeader />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
        <footer className="border-t border-[#dde7f1] bg-[#f5f9fd]/30 px-6 py-12 lg:px-20 dark:border-white/10 dark:bg-[#0d1729]">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <img src={aiVidLogo} alt="SceneFlow 로고" className="size-8 rounded-xl bg-primary p-1.5 object-contain" />
              <div>
                <p className="font-bold text-[#2d2926] dark:text-white">SceneFlow</p>
              </div>
            </div>
            <p className="text-sm text-slate-400">© 2026 SceneFlow. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
