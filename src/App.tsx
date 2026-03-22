import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import VideoDetailPage from './pages/VideoDetailPage'
import StudioLayout from './components/studio/StudioLayout'
import ProjectsPage from './pages/studio/ProjectsPage'
import VisualCreationPage from './pages/studio/VisualCreationPage'
import AssetLibraryPage from './pages/studio/AssetLibraryPage'
import SettingsPage from './pages/studio/SettingsPage'
import MyPage from './pages/studio/MyPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import SupportPage from './pages/SupportPage'
import ThemeToggle from './components/ThemeToggle'
import { ThemeProvider } from './hooks/useTheme'
import { GenerationProvider } from './hooks/useGeneration'
import { NotificationProvider } from './hooks/useNotification'
import { useAuth } from './hooks/useAuth'

import { GOOGLE_CLIENT_ID } from './config/env'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return null
  if (!isLoggedIn) return <Navigate to="/login" replace state={{ from: location.pathname }} />

  return <>{children}</>
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <NotificationProvider>
        <GenerationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/video/:id" element={<VideoDetailPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/studio" element={<RequireAuth><StudioLayout /></RequireAuth>}>
              <Route index element={<Navigate to="projects" replace />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="create" element={<VisualCreationPage />} />
              <Route path="assets" element={<AssetLibraryPage />} />
              <Route path="mypage" element={<MyPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
          <ThemeToggle />
        </BrowserRouter>
        </GenerationProvider>
        </NotificationProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  )
}

export default App
