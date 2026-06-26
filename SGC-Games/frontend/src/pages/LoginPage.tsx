import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Gamepad2 } from 'lucide-react'
import { usuariosApi } from '../api'
import { useAuth } from '../context/AuthContext'
import { useMutation } from '../hooks/useMutation'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { Alert } from '../components/ui/Alert'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [username, setUsername] = useState('')
  const [senha, setSenha] = useState('')

  const { mutate, loading, error } = useMutation(usuariosApi.login, {
    showSuccessToast: false,
    showErrorToast: false,
    onSuccess: (usuario) => {
      if (!usuario.id) return
      login({
        id: usuario.id,
        username: usuario.username,
        perfil: usuario.perfil,
        token: usuario.token,
      })
      navigate('/')
    },
  })

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void mutate({ username, senha })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7] p-4">
      <Card className="relative w-full max-w-md animate-fade-in shadow-card-hover">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3B4ED8] shadow-sm shadow-[#3B4ED8]/25">
            <Gamepad2 className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-medium tracking-tight text-[#1D1D1F]">SGC Games</h1>
          <p className="mt-1 text-sm text-[#86868B]">Entre para gerenciar sua loja</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="seu_usuario"
            required
            autoComplete="username"
          />
          <Input
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />

          {error && <Alert variant="error">{error}</Alert>}

          <Button type="submit" className="w-full" loading={loading}>
            Entrar
          </Button>
        </form>
      </Card>
    </div>
  )
}
