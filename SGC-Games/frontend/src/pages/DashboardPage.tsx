import { useNavigate } from 'react-router-dom'
import {
  Users,
  Package,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react'
import { clientesApi, produtosApi, vendasApi } from '../api'
import { useAsync } from '../hooks/useAsync'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/ui/Card'
import { CardSkeleton } from '../components/ui/Skeleton'
import { AsyncContent } from '../components/ui/AsyncContent'
import { Badge } from '../components/ui/Badge'
import { formatCurrency, formatDate } from '../utils/format'

export function DashboardPage() {
  const navigate = useNavigate()

  const clientes = useAsync(() => clientesApi.listar(), [])
  const produtos = useAsync(() => produtosApi.listar(), [])
  const estoqueBaixo = useAsync(() => produtosApi.listarEstoqueBaixo(), [])
  const vendas = useAsync(() => vendasApi.listar(), [])

  const loading = clientes.loading || produtos.loading || estoqueBaixo.loading || vendas.loading

  const stats = [
    {
      label: 'Clientes',
      value: clientes.data?.length ?? 0,
      icon: Users,
      color: 'text-[#3B4ED8]',
      bg: 'bg-[#EEF0FD]',
    },
    {
      label: 'Produtos',
      value: produtos.data?.length ?? 0,
      icon: Package,
      color: 'text-[#1B7D46]',
      bg: 'bg-[#E8F8EF]',
    },
    {
      label: 'Vendas',
      value: vendas.data?.length ?? 0,
      icon: ShoppingCart,
      color: 'text-[#007AFF]',
      bg: 'bg-[#E5F1FF]',
    },
    {
      label: 'Estoque Baixo',
      value: estoqueBaixo.data?.length ?? 0,
      icon: AlertTriangle,
      color: 'text-[#B25000]',
      bg: 'bg-[#FFF4E5]',
    },
  ]

  const ultimasVendas = vendas.data?.slice(-5).reverse() ?? []

  return (
    <div className="font-normal">
      <PageHeader
        title="Dashboard"
        description="Visão geral da sua loja de games"
        actionLabel="Nova Venda"
        onAction={() => navigate('/vendas/nova')}
      />

      {loading ? (
        <CardSkeleton />
      ) : (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in">
          {stats.map((stat) => (
            <Card key={stat.label} hoverable>
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-[#86868B]">{stat.label}</p>
                  <p className="text-2xl font-normal text-[#1D1D1F]">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#3B4ED8]" />
            <h2 className="text-lg font-medium text-[#1D1D1F]">Últimas Vendas</h2>
          </div>

          <AsyncContent
            loading={vendas.loading}
            error={vendas.error}
            data={vendas.data}
            isEmpty={ultimasVendas.length === 0}
            onRetry={vendas.refetch}
            emptyFallback={
              <p className="py-8 text-center text-sm text-[#86868B]">Nenhuma venda registrada ainda.</p>
            }
          >
            {() => (
              <ul className="space-y-3">
                {ultimasVendas.map((venda) => (
                  <li
                    key={venda.id}
                    onClick={() => navigate(`/vendas/${venda.id}`)}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-[#E5E5EA] p-3 transition-colors hover:bg-[#F5F5F7]"
                  >
                    <div>
                      <p className="font-normal text-[#1D1D1F]">
                        {venda.cliente?.nome ?? 'Cliente'}
                      </p>
                      <p className="text-xs text-[#86868B]">{formatDate(venda.dataVenda)}</p>
                    </div>
                    <span className="font-normal text-[#3B4ED8]">
                      {formatCurrency(venda.valorTotal)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </AsyncContent>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[#B25000]" />
              <h2 className="text-lg font-medium text-[#1D1D1F]">Alerta de Estoque</h2>
            </div>
            {(estoqueBaixo.data?.length ?? 0) > 0 && (
              <Badge variant="warning">{estoqueBaixo.data?.length} itens</Badge>
            )}
          </div>

          <AsyncContent
            loading={estoqueBaixo.loading}
            error={estoqueBaixo.error}
            data={estoqueBaixo.data}
            isEmpty={estoqueBaixo.isEmpty}
            onRetry={estoqueBaixo.refetch}
            emptyFallback={
              <p className="py-8 text-center text-sm text-[#1B7D46]">
                Todos os produtos com estoque adequado.
              </p>
            }
          >
            {(produtosBaixo) => (
              <ul className="space-y-3">
                {produtosBaixo.slice(0, 5).map((produto) => (
                  <li
                    key={produto.id}
                    className="flex items-center justify-between rounded-xl border border-[#FFD699] bg-[#FFF4E5] p-3"
                  >
                    <div>
                      <p className="font-normal text-[#1D1D1F]">{produto.nome}</p>
                      <p className="text-xs text-[#86868B]">{produto.plataforma}</p>
                    </div>
                    <Badge variant="warning">
                      {produto.quantidadeEstoque} / {produto.estoqueMinimo}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </AsyncContent>
        </Card>
      </div>
    </div>
  )
}
