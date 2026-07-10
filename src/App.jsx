import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import Tasks from './pages/Tasks'
import Activities from './pages/Activities'
import AskAI from './pages/AskAI'
import { ToastProvider } from './context/ToastContext'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex-1 min-w-0 flex flex-col">
            <header className="md:hidden h-14 flex items-center gap-3 px-4 border-b border-gray-200 bg-white sticky top-0 z-30">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="text-gray-600 hover:text-gray-900"
              >
                <Menu size={22} />
              </button>
              <span className="font-semibold text-gray-900">CRM Dashboard</span>
            </header>
            <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/activities" element={<Activities />} />
                <Route path="/ask-ai" element={<AskAI />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
