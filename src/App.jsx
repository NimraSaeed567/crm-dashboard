import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import Tasks from './pages/Tasks'
import Invoices from './pages/Invoices'
import AskAI from './pages/AskAI'
import Login from './pages/Login'
import { ToastProvider } from './context/ToastContext'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'

function AppShell() {
  const { user, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 text-sm text-gray-400">
        Loading…
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex-1 min-w-0 flex flex-col">
            <header className="md:hidden h-14 flex items-center gap-3 px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-30">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <Menu size={22} />
              </button>
              <span className="font-semibold text-gray-900 dark:text-gray-100">CRM Dashboard</span>
            </header>
            <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/ask-ai" element={<AskAI />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </ToastProvider>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
