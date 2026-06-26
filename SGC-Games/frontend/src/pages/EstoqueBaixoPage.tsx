import { useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { produtosApi } from '../api'
import { useAsync } from '../hooks/useAsync'
import { PageHeader } from '../components/layout/PageHeader'
import { AsyncContent } from '../components/ui/AsyncContent'
import { TableSkeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell } from '../components/ui/Table'
import { Badge } from '../components/ui/Badge'
import { formatCurrency } from '../utils/format'

export function EstoqueBaixoPage() {
  const navigate = useNavigate()
  const { data, loading, error, isEmpty, refetch } = useAsync(
    () => produtosApi.listarEstoqueBaixo(),
    [],
  )

  return (
    <div>
      <PageHeader
        title="Estoque Baixo"
        description="Produtos que precisam de reposição"
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
            icon={AlertTriangle}
            title="Estoque em dia"
            description="Nenhum produto abaixo do estoque mínimo."
          />
        }
      >
        {(produtos) => (
          <Table>
            <TableHead>
              <TableHeaderCell>Produto</TableHeaderCell>
              <TableHeaderCell>Plataforma</TableHeaderCell>
              <TableHeaderCell>Preço</TableHeaderCell>
              <TableHeaderCell>Estoque Atual</TableHeaderCell>
              <TableHeaderCell>Mínimo</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableHead>
            <TableBody>
              {produtos.map((produto) => (
                <TableRow
                  key={produto.id}
                  onClick={() => navigate(`/produtos/${produto.id}`)}
                >
                  <TableCell className="font-medium text-[#1D1D1F]">{produto.nome}</TableCell>
                  <TableCell>{produto.plataforma}</TableCell>
                  <TableCell>{formatCurrency(produto.preco)}</TableCell>
                  <TableCell>
                    <Badge variant="warning">{produto.quantidadeEstoque}</Badge>
                  </TableCell>
                  <TableCell>{produto.estoqueMinimo}</TableCell>
                  <TableCell>
                    <Badge variant="danger">Reposição necessária</Badge>
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
