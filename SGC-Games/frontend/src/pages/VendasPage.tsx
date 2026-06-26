import { useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { vendasApi } from '../api'
import { useAsync } from '../hooks/useAsync'
import { PageHeader } from '../components/layout/PageHeader'
import { AsyncContent } from '../components/ui/AsyncContent'
import { TableSkeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell } from '../components/ui/Table'
import { formatCurrency, formatDate } from '../utils/format'

export function VendasPage() {
  const navigate = useNavigate()
  const { data, loading, error, isEmpty, refetch } = useAsync(() => vendasApi.listar(), [])

  return (
    <div>
      <PageHeader
        title="Vendas"
        description="Histórico de vendas realizadas"
        actionLabel="Nova Venda"
        onAction={() => navigate('/vendas/nova')}
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
            icon={ShoppingCart}
            title="Nenhuma venda registrada"
            description="Registre a primeira venda da loja."
            actionLabel="Nova Venda"
            onAction={() => navigate('/vendas/nova')}
          />
        }
      >
        {(vendas) => (
          <Table>
            <TableHead>
              <TableHeaderCell>ID</TableHeaderCell>
              <TableHeaderCell>Cliente</TableHeaderCell>
              <TableHeaderCell>Vendedor</TableHeaderCell>
              <TableHeaderCell>Data</TableHeaderCell>
              <TableHeaderCell>Total</TableHeaderCell>
            </TableHead>
            <TableBody>
              {[...vendas].reverse().map((venda) => (
                <TableRow key={venda.id} onClick={() => navigate(`/vendas/${venda.id}`)}>
                  <TableCell>#{venda.id}</TableCell>
                  <TableCell className="font-medium text-[#1D1D1F]">
                    {venda.cliente?.nome ?? '—'}
                  </TableCell>
                  <TableCell>{venda.usuario?.username ?? '—'}</TableCell>
                  <TableCell>{formatDate(venda.dataVenda)}</TableCell>
                  <TableCell className="font-medium text-[#3B4ED8]">
                    {formatCurrency(venda.valorTotal)}
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
