import { useNavigate, useParams } from 'react-router-dom'
import { vendasApi } from '../api'
import { useAsync } from '../hooks/useAsync'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/ui/Card'
import { AsyncContent } from '../components/ui/AsyncContent'
import { TableSkeleton } from '../components/ui/Skeleton'
import { Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell } from '../components/ui/Table'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { formatCurrency, formatDate } from '../utils/format'

export function VendaDetalhePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, loading, error, refetch } = useAsync(
    () => vendasApi.buscarPorId(Number(id)),
    [id],
  )

  return (
    <div>
      <PageHeader title={`Venda #${id}`} description="Detalhes da venda">
        <Button variant="secondary" onClick={() => navigate('/vendas')}>
          Voltar
        </Button>
      </PageHeader>

      <AsyncContent
        loading={loading}
        error={error}
        data={data}
        onRetry={refetch}
        loadingFallback={<TableSkeleton rows={3} />}
      >
        {(venda) => (
          <div className="space-y-6 animate-fade-in">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <p className="text-sm font-medium text-[#86868B]">Cliente</p>
                <p className="mt-1 font-normal text-[#1D1D1F]">{venda.cliente?.nome}</p>
              </Card>
              <Card>
                <p className="text-sm font-medium text-[#86868B]">Vendedor</p>
                <p className="mt-1 font-normal text-[#1D1D1F]">{venda.usuario?.username}</p>
              </Card>
              <Card>
                <p className="text-sm font-medium text-[#86868B]">Data</p>
                <p className="mt-1 font-normal text-[#1D1D1F]">{formatDate(venda.dataVenda)}</p>
              </Card>
              <Card>
                <p className="text-sm font-medium text-[#86868B]">Total</p>
                <p className="mt-1 text-xl font-normal text-[#3B4ED8]">
                  {formatCurrency(venda.valorTotal)}
                </p>
              </Card>
            </div>

            <Card>
              <h2 className="mb-4 text-lg font-medium text-[#1D1D1F]">Itens da Venda</h2>
              {venda.itens && venda.itens.length > 0 ? (
                <Table>
                  <TableHead>
                    <TableHeaderCell>Produto</TableHeaderCell>
                    <TableHeaderCell>Qtd</TableHeaderCell>
                    <TableHeaderCell>Preço Unit.</TableHeaderCell>
                    <TableHeaderCell>Subtotal</TableHeaderCell>
                  </TableHead>
                  <TableBody>
                    {venda.itens.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium text-[#1D1D1F]">
                          {item.produto?.nome ?? '—'}
                          {item.produto?.plataforma && (
                            <Badge variant="default" className="ml-2">
                              {item.produto.plataforma}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{item.quantidade}</TableCell>
                        <TableCell>{formatCurrency(item.precoUnitario)}</TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(item.subtotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-[#86868B]">Nenhum item encontrado.</p>
              )}
            </Card>
          </div>
        )}
      </AsyncContent>
    </div>
  )
}
