import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Pencil, Trash2 } from 'lucide-react'
import { produtosApi } from '../api'
import { useAsync } from '../hooks/useAsync'
import { useMutation } from '../hooks/useMutation'
import { PageHeader } from '../components/layout/PageHeader'
import { AsyncContent } from '../components/ui/AsyncContent'
import { TableSkeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell } from '../components/ui/Table'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { ConfirmModal } from '../components/ui/Modal'
import { formatCurrency } from '../utils/format'
import type { Produto } from '../types'

export function ProdutosPage() {
  const navigate = useNavigate()
  const { data, loading, error, isEmpty, refetch } = useAsync(() => produtosApi.listar(), [])
  const [deleteTarget, setDeleteTarget] = useState<Produto | null>(null)

  const deleteMutation = useMutation(
    (id: number) => produtosApi.remover(id),
    {
      successMessage: 'Produto removido com sucesso.',
      onSuccess: () => {
        setDeleteTarget(null)
        void refetch()
      },
    },
  )

  return (
    <div>
      <PageHeader
        title="Produtos"
        description="Catálogo de games e acessórios"
        actionLabel="Novo Produto"
        onAction={() => navigate('/produtos/novo')}
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
            icon={Package}
            title="Nenhum produto cadastrado"
            description="Adicione jogos e acessórios ao catálogo."
            actionLabel="Cadastrar Produto"
            onAction={() => navigate('/produtos/novo')}
          />
        }
      >
        {(produtos) => (
          <Table>
            <TableHead>
              <TableHeaderCell>Nome</TableHeaderCell>
              <TableHeaderCell>Plataforma</TableHeaderCell>
              <TableHeaderCell>Tipo</TableHeaderCell>
              <TableHeaderCell>Preço</TableHeaderCell>
              <TableHeaderCell>Estoque</TableHeaderCell>
              <TableHeaderCell className="text-right">Ações</TableHeaderCell>
            </TableHead>
            <TableBody>
              {produtos.map((produto) => {
                const estoqueBaixo = produto.quantidadeEstoque <= produto.estoqueMinimo
                return (
                  <TableRow key={produto.id}>
                    <TableCell className="font-medium text-[#1D1D1F]">{produto.nome}</TableCell>
                    <TableCell>{produto.plataforma}</TableCell>
                    <TableCell>{produto.tipo}</TableCell>
                    <TableCell>{formatCurrency(produto.preco)}</TableCell>
                    <TableCell>
                      {estoqueBaixo ? (
                        <Badge variant="warning">{produto.quantidadeEstoque}</Badge>
                      ) : (
                        produto.quantidadeEstoque
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          className="!px-2"
                          onClick={() => navigate(`/produtos/${produto.id}`)}
                          aria-label={`Editar ${produto.nome}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          className="!px-2 text-[#FF3B30] hover:text-[#C41E16]"
                          onClick={() => setDeleteTarget(produto)}
                          aria-label={`Excluir ${produto.nome}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </AsyncContent>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget?.id && void deleteMutation.mutate(deleteTarget.id)}
        title="Excluir produto"
        message={`Tem certeza que deseja excluir "${deleteTarget?.nome}"?`}
        confirmLabel="Excluir"
        loading={deleteMutation.loading}
      />
    </div>
  )
}
