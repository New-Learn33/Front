import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import ShowcasePage from './pages/ShowcasePage'
import StudioLayout from './components/studio/StudioLayout'
import DashboardPage from './pages/studio/DashboardPage'
import ProjectsPage from './pages/studio/ProjectsPage'
import VisualCreationPage from './pages/studio/VisualCreationPage'
import AssetLibraryPage from './pages/studio/AssetLibraryPage'
import SettingsPage from './pages/studio/SettingsPage'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/showcase" element={<ShowcasePage />} />
          <Route path="/studio" element={<StudioLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="create" element={<VisualCreationPage />} />
            <Route path="assets" element={<AssetLibraryPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  )
}

export default App
