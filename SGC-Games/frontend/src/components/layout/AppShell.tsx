import { useState, type ReactNode } from 'react'
import { Menu, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../ui/Button'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-[#F5F5F7]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E5E5EA] bg-white/80 px-4 backdrop-blur-md lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl p-2 text-[#86868B] transition-colors hover:bg-[#F2F2F7] hover:text-[#1D1D1F] lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="hidden lg:block">
            {user && (
              <p className="text-sm text-[#86868B]">
                Bem-vindo de volta,{' '}
                <span className="font-normal text-[#1D1D1F]">{user.username}</span>
              </p>
            )}
          </div>

          <Button variant="ghost" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
