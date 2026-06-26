import { useState } from 'react'
import { UserCog } from 'lucide-react'
import { usuariosApi } from '../api'
import { useAsync } from '../hooks/useAsync'
import { useMutation } from '../hooks/useMutation'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Button } from '../components/ui/Button'
import { AsyncContent } from '../components/ui/AsyncContent'
import { TableSkeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell } from '../components/ui/Table'
import { Badge } from '../components/ui/Badge'
import { Alert } from '../components/ui/Alert'
import type { Usuario } from '../types'

const perfis = ['ADMIN', 'VENDEDOR', 'GERENTE']

export function UsuariosPage() {
  const { data, loading, error, isEmpty, refetch } = useAsync(() => usuariosApi.listar(), [])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Usuario>({ username: '', senha: '', perfil: 'VENDEDOR' })

  const createMutation = useMutation(
    (usuario: Usuario) => usuariosApi.criar(usuario),
    {
      successMessage: 'Usuário cadastrado com sucesso.',
      onSuccess: () => {
        setShowForm(false)
        setForm({ username: '', senha: '', perfil: 'VENDEDOR' })
        void refetch()
      },
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void createMutation.mutate(form)
  }

  return (
    <div>
      <PageHeader
        title="Usuários"
        description="Gerencie os usuários do sistema"
        actionLabel={showForm ? undefined : 'Novo Usuário'}
        onAction={showForm ? undefined : () => setShowForm(true)}
      />

      {showForm && (
        <Card className="mb-6 max-w-lg animate-fade-in">
          <h2 className="mb-4 text-lg font-medium text-[#1D1D1F]">Novo Usuário</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              value={form.username}
              onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
              required
            />
            <Input
              label="Senha"
              type="password"
              value={form.senha ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, senha: e.target.value }))}
              required
            />
            <Select
              label="Perfil"
              value={form.perfil}
              onChange={(e) => setForm((p) => ({ ...p, perfil: e.target.value }))}
            >
              {perfis.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>

            {createMutation.error && <Alert variant="error">{createMutation.error}</Alert>}

            <div className="flex gap-3">
              <Button type="submit" loading={createMutation.loading}>
                Cadastrar
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <AsyncContent
        loading={loading}
        error={error}
        data={data}
        isEmpty={isEmpty}
        onRetry={refetch}
        loadingFallback={<TableSkeleton />}
        emptyFallback={
          <EmptyState
            icon={UserCog}
            title="Nenhum usuário cadastrado"
            description="Cadastre o primeiro usuário do sistema."
            actionLabel="Novo Usuário"
            onAction={() => setShowForm(true)}
          />
        }
      >
        {(usuarios) => (
          <Table>
            <TableHead>
              <TableHeaderCell>ID</TableHeaderCell>
              <TableHeaderCell>Username</TableHeaderCell>
              <TableHeaderCell>Perfil</TableHeaderCell>
            </TableHead>
            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>#{usuario.id}</TableCell>
                  <TableCell className="font-medium text-[#1D1D1F]">{usuario.username}</TableCell>
                  <TableCell>
                    <Badge variant="primary">{usuario.perfil}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </AsyncContent>
    </div>
  )
}
