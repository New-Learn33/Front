import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import VideoDetailPage from './pages/VideoDetailPage'
import StudioLayout from './components/studio/StudioLayout'
import DashboardPage from './pages/studio/DashboardPage'
import ProjectsPage from './pages/studio/ProjectsPage'
import VisualCreationPage from './pages/studio/VisualCreationPage'
import AssetLibraryPage from './pages/studio/AssetLibraryPage'
import SettingsPage from './pages/studio/SettingsPage'
import ThemeToggle from './components/ThemeToggle'
import { ThemeProvider } from './hooks/useTheme'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/video/:id" element={<VideoDetailPage />} />
            <Route path="/studio" element={<StudioLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="create" element={<VisualCreationPage />} />
              <Route path="assets" element={<AssetLibraryPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
          <ThemeToggle />
        </BrowserRouter>
      </ThemeProvider>
    </GoogleOAuthProvider>
  )
}

export default App
