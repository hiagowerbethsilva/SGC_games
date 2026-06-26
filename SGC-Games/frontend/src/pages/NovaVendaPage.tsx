import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { clientesApi, produtosApi, vendasApi } from '../api'
import { useAsync } from '../hooks/useAsync'
import { useMutation } from '../hooks/useMutation'
import { useAuth } from '../context/AuthContext'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/ui/Card'
import { Select } from '../components/ui/Select'
import { Button } from '../components/ui/Button'
import { AsyncContent } from '../components/ui/AsyncContent'
import { TableSkeleton } from '../components/ui/Skeleton'
import { Alert } from '../components/ui/Alert'
import { formatCurrency } from '../utils/format'
import type { CriarVendaPayload, Produto } from '../types'

interface CarrinhoItem {
  produto: Produto
  quantidade: number
}

export function NovaVendaPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [clienteId, setClienteId] = useState('')
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([])
  const [produtoSelecionado, setProdutoSelecionado] = useState('')

  const clientes = useAsync(() => clientesApi.listar(), [])
  const produtos = useAsync(() => produtosApi.listar(), [])

  const registrarMutation = useMutation(
    (payload: CriarVendaPayload) => vendasApi.registrar(payload),
    {
      successMessage: 'Venda registrada com sucesso!',
      onSuccess: (venda) => {
        if (venda.id) navigate(`/vendas/${venda.id}`)
      },
    },
  )

  const loading = clientes.loading || produtos.loading

  const total = useMemo(
    () =>
      carrinho.reduce(
        (sum, item) => sum + Number(item.produto.preco) * item.quantidade,
        0,
      ),
    [carrinho],
  )

  const adicionarProduto = () => {
    if (!produtoSelecionado || !produtos.data) return
    const produto = produtos.data.find((p) => p.id === Number(produtoSelecionado))
    if (!produto || !produto.id) return

    const existente = carrinho.find((item) => item.produto.id === produto.id)
    if (existente) {
      if (existente.quantidade >= produto.quantidadeEstoque) return
      setCarrinho((prev) =>
        prev.map((item) =>
          item.produto.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item,
        ),
      )
    } else {
      setCarrinho((prev) => [...prev, { produto, quantidade: 1 }])
    }
    setProdutoSelecionado('')
  }

  const alterarQuantidade = (produtoId: number, delta: number) => {
    setCarrinho((prev) =>
      prev
        .map((item) => {
          if (item.produto.id !== produtoId) return item
          const novaQtd = item.quantidade + delta
          if (novaQtd <= 0) return null
          if (novaQtd > item.produto.quantidadeEstoque) return item
          return { ...item, quantidade: novaQtd }
        })
        .filter(Boolean) as CarrinhoItem[],
    )
  }

  const removerItem = (produtoId: number) => {
    setCarrinho((prev) => prev.filter((item) => item.produto.id !== produtoId))
  }

  const handleConfirmar = () => {
    if (!clienteId || !user?.id || carrinho.length === 0) return

    const payload: CriarVendaPayload = {
      cliente: { id: Number(clienteId) },
      usuario: { id: user.id },
      itens: carrinho.map((item) => ({
        produto: { id: item.produto.id! },
        quantidade: item.quantidade,
      })),
    }

    void registrarMutation.mutate(payload)
  }

  const canConfirm = clienteId && carrinho.length > 0 && !registrarMutation.loading

  return (
    <div>
      <PageHeader
        title="Nova Venda"
        description="PDV — selecione cliente e produtos"
      />

      <AsyncContent
        loading={loading}
        error={clientes.error || produtos.error}
        data={clientes.data && produtos.data ? true : null}
        onRetry={() => {
          void clientes.refetch()
          void produtos.refetch()
        }}
        loadingFallback={<TableSkeleton rows={4} />}
      >
        {() => (
          <div className="grid gap-6 lg:grid-cols-3 animate-fade-in">
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <h2 className="mb-4 text-lg font-medium text-[#1D1D1F]">Cliente</h2>
                <Select
                  label="Selecione o cliente"
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                >
                  <option value="">— Escolha um cliente —</option>
                  {clientes.data?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome} — {c.cpf}
                    </option>
                  ))}
                </Select>
              </Card>

              <Card>
                <h2 className="mb-4 text-lg font-medium text-[#1D1D1F]">Adicionar Produto</h2>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Select
                    label="Produto"
                    value={produtoSelecionado}
                    onChange={(e) => setProdutoSelecionado(e.target.value)}
                    className="flex-1"
                  >
                    <option value="">— Escolha um produto —</option>
                    {produtos.data?.map((p) => (
                      <option key={p.id} value={p.id} disabled={p.quantidadeEstoque <= 0}>
                        {p.nome} — {formatCurrency(p.preco)} (est: {p.quantidadeEstoque})
                      </option>
                    ))}
                  </Select>
                  <Button onClick={adicionarProduto} className="sm:self-end" disabled={!produtoSelecionado}>
                    Adicionar
                  </Button>
                </div>
              </Card>

              <Card>
                <div className="mb-4 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-[#3B4ED8]" />
                  <h2 className="text-lg font-medium text-[#1D1D1F]">Carrinho</h2>
                </div>

                {carrinho.length === 0 ? (
                  <p className="py-8 text-center text-sm text-[#86868B]">
                    Nenhum produto no carrinho. Adicione itens acima.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {carrinho.map((item) => (
                      <li
                        key={item.produto.id}
                        className="flex items-center justify-between rounded-xl border border-[#E5E5EA] p-4"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#1D1D1F] truncate">{item.produto.nome}</p>
                          <p className="text-sm text-[#86868B]">
                            {formatCurrency(item.produto.preco)} cada
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              className="!px-2"
                              onClick={() => alterarQuantidade(item.produto.id!, -1)}
                              aria-label="Diminuir quantidade"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantidade}</span>
                            <Button
                              variant="ghost"
                              className="!px-2"
                              onClick={() => alterarQuantidade(item.produto.id!, 1)}
                              aria-label="Aumentar quantidade"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <span className="w-24 text-right font-medium text-[#3B4ED8]">
                            {formatCurrency(Number(item.produto.preco) * item.quantidade)}
                          </span>

                          <Button
                            variant="ghost"
                            className="!px-2 text-[#FF3B30]"
                            onClick={() => removerItem(item.produto.id!)}
                            aria-label="Remover item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>

            <div>
              <Card className="sticky top-24">
                <h2 className="mb-4 text-lg font-medium text-[#1D1D1F]">Resumo</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-[#86868B]">
                    <span>Itens</span>
                    <span>{carrinho.reduce((s, i) => s + i.quantidade, 0)}</span>
                  </div>
                  <div className="flex justify-between text-[#86868B]">
                    <span>Vendedor</span>
                    <span>{user?.username}</span>
                  </div>
                  <div className="border-t border-[#E5E5EA] pt-3 flex justify-between">
                    <span className="font-medium text-[#1D1D1F]">Total</span>
                    <span className="text-xl font-normal text-[#3B4ED8]">{formatCurrency(total)}</span>
                  </div>
                </div>

                {registrarMutation.error && (
                  <Alert variant="error" className="mt-4">
                    {registrarMutation.error}
                  </Alert>
                )}

                <Button
                  className="mt-6 w-full"
                  onClick={handleConfirmar}
                  loading={registrarMutation.loading}
                  disabled={!canConfirm}
                >
                  Confirmar Venda
                </Button>
              </Card>
            </div>
          </div>
        )}
      </AsyncContent>
    </div>
  )
}
