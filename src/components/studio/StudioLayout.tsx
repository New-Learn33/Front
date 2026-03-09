import { Outlet } from 'react-router-dom'
import StudioSidebar from './StudioSidebar'
import StudioHeader from './StudioHeader'

export default function StudioLayout() {
  return (
    <div className="min-h-screen bg-[#f2ece1] font-display text-slate-900">
      <StudioSidebar />
      <div className="ml-64">
        <StudioHeader />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
