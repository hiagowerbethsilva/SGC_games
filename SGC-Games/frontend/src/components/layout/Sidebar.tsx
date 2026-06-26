import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  UserCog,
  AlertTriangle,
  Gamepad2,
  X,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { useAuth } from '../../context/AuthContext'
import { Badge } from '../ui/Badge'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/produtos', label: 'Produtos', icon: Package, end: true },
  { to: '/produtos/estoque-baixo', label: 'Estoque Baixo', icon: AlertTriangle },
  { to: '/vendas', label: 'Vendas', icon: ShoppingCart, end: true },
  { to: '/vendas/nova', label: 'Nova Venda', icon: ShoppingCart },
  { to: '/relatorios', label: 'Relatórios', icon: BarChart3 },
  { to: '/usuarios', label: 'Usuários', icon: UserCog },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

function getInitials(username: string): string {
  return username.slice(0, 2).toUpperCase()
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuth()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#E5E5EA] bg-white transition-transform duration-300 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B4ED8]">
              <Gamepad2 className="h-5 w-5 text-white" />
            </div>
            <span className="font-normal text-[#1D1D1F] tracking-tight">SGC Games</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#86868B] hover:bg-[#F2F2F7] lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-200',
                  isActive
                    ? 'bg-[#F2F2F7] font-medium text-[#1D1D1F]'
                    : 'font-normal text-[#86868B] hover:bg-[#F9F9FB] hover:text-[#1D1D1F]',
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {user && (
          <div className="border-t border-[#E5E5EA] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF0FD] text-sm font-normal text-[#3B4ED8]">
                {getInitials(user.username)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-normal text-[#1D1D1F]">{user.username}</p>
                <Badge variant="primary" className="mt-0.5">
                  {user.perfil}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
