import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { ClientesPage } from './pages/ClientesPage'
import { ClienteFormPage } from './pages/ClienteFormPage'
import { ProdutosPage } from './pages/ProdutosPage'
import { ProdutoFormPage } from './pages/ProdutoFormPage'
import { EstoqueBaixoPage } from './pages/EstoqueBaixoPage'
import { VendasPage } from './pages/VendasPage'
import { NovaVendaPage } from './pages/NovaVendaPage'
import { VendaDetalhePage } from './pages/VendaDetalhePage'
import { RelatoriosPage } from './pages/RelatoriosPage'
import { UsuariosPage } from './pages/UsuariosPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/clientes" element={<ClientesPage />} />
              <Route path="/clientes/novo" element={<ClienteFormPage />} />
              <Route path="/clientes/:id" element={<ClienteFormPage />} />
              <Route path="/produtos" element={<ProdutosPage />} />
              <Route path="/produtos/novo" element={<ProdutoFormPage />} />
              <Route path="/produtos/estoque-baixo" element={<EstoqueBaixoPage />} />
              <Route path="/produtos/:id" element={<ProdutoFormPage />} />
              <Route path="/vendas" element={<VendasPage />} />
              <Route path="/vendas/nova" element={<NovaVendaPage />} />
              <Route path="/vendas/:id" element={<VendaDetalhePage />} />
              <Route path="/relatorios" element={<RelatoriosPage />} />
              <Route path="/usuarios" element={<UsuariosPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
