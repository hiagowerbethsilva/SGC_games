import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Pencil, Trash2 } from 'lucide-react'
import { clientesApi } from '../api'
import { useAsync } from '../hooks/useAsync'
import { useMutation } from '../hooks/useMutation'
import { PageHeader } from '../components/layout/PageHeader'
import { AsyncContent } from '../components/ui/AsyncContent'
import { TableSkeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell } from '../components/ui/Table'
import { Button } from '../components/ui/Button'
import { ConfirmModal } from '../components/ui/Modal'
import { formatCpf } from '../utils/format'
import type { Cliente } from '../types'

export function ClientesPage() {
  const navigate = useNavigate()
  const { data, loading, error, isEmpty, refetch } = useAsync(() => clientesApi.listar(), [])
  const [deleteTarget, setDeleteTarget] = useState<Cliente | null>(null)

  const deleteMutation = useMutation(
    (id: number) => clientesApi.remover(id),
    {
      successMessage: 'Cliente removido com sucesso.',
      onSuccess: () => {
        setDeleteTarget(null)
        void refetch()
      },
    },
  )

  return (
    <div>
      <PageHeader
        title="Clientes"
        description="Gerencie os clientes da loja"
        actionLabel="Novo Cliente"
        onAction={() => navigate('/clientes/novo')}
      />

      <AsyncContent
        loading={loading}
        error={error}
        data={data}
        isEmpty={isEmpty}
        onRetry={refetch}
        loadingFallback={<TableSkeleton />}
        emptyFallback={
          <EmptyState
            icon={Users}
            title="Nenhum cliente cadastrado"
            description="Comece cadastrando seu primeiro cliente."
            actionLabel="Cadastrar Cliente"
            onAction={() => navigate('/clientes/novo')}
          />
        }
      >
        {(clientes) => (
          <Table>
            <TableHead>
              <TableHeaderCell>Nome</TableHeaderCell>
              <TableHeaderCell>CPF</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Telefone</TableHeaderCell>
              <TableHeaderCell className="text-right">Ações</TableHeaderCell>
            </TableHead>
            <TableBody>
              {clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium text-[#1D1D1F]">{cliente.nome}</TableCell>
                  <TableCell>{formatCpf(cliente.cpf)}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.telefone ?? '—'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        className="!px-2"
                        onClick={() => navigate(`/clientes/${cliente.id}`)}
                        aria-label={`Editar ${cliente.nome}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="!px-2 text-[#FF3B30] hover:text-[#C41E16]"
                        onClick={() => setDeleteTarget(cliente)}
                        aria-label={`Excluir ${cliente.nome}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </AsyncContent>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget?.id && void deleteMutation.mutate(deleteTarget.id)}
        title="Excluir cliente"
        message={`Tem certeza que deseja excluir "${deleteTarget?.nome}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        loading={deleteMutation.loading}
      />
    </div>
  )
}
