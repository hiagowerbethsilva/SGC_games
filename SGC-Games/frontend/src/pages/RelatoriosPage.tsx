import { useState } from 'react'
import { BarChart3 } from 'lucide-react'
import { clientesApi, relatoriosApi } from '../api'
import { useAsync } from '../hooks/useAsync'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/ui/Card'
import { Select } from '../components/ui/Select'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { TableSkeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell } from '../components/ui/Table'
import { toIsoDateTime, formatCurrency, formatDate } from '../utils/format'
import type { Venda } from '../types'

type ModoRelatorio = 'cliente' | 'periodo'

export function RelatoriosPage() {
  const [modo, setModo] = useState<ModoRelatorio>('cliente')
  const [clienteId, setClienteId] = useState('')
  const [inicio, setInicio] = useState('')
  const [fim, setFim] = useState('')
  const [resultado, setResultado] = useState<Venda[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  const clientes = useAsync(() => clientesApi.listar(), [])

  const handleBuscar = async () => {
    setLoading(true)
    setError(null)
    setSearched(true)
    try {
      let vendas: Venda[]
      if (modo === 'cliente') {
        if (!clienteId) {
          setError('Selecione um cliente.')
          setResultado(null)
          return
        }
        vendas = await relatoriosApi.vendasPorCliente(Number(clienteId))
      } else {
        if (!inicio || !fim) {
          setError('Informe data de início e fim.')
          setResultado(null)
          return
        }
        vendas = await relatoriosApi.vendasPorPeriodo(toIsoDateTime(inicio), toIsoDateTime(fim))
      }
      setResultado(vendas)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar relatório.')
      setResultado(null)
    } finally {
      setLoading(false)
    }
  }

  const totalGeral = resultado?.reduce((sum, v) => sum + Number(v.valorTotal ?? 0), 0) ?? 0

  return (
    <div>
      <PageHeader
        title="Relatórios"
        description="Consulte vendas por cliente ou período"
      />

      <Card className="mb-6 animate-fade-in">
        <div className="mb-6 flex gap-2">
          <Button
            variant={modo === 'cliente' ? 'primary' : 'secondary'}
            onClick={() => {
              setModo('cliente')
              setResultado(null)
              setSearched(false)
              setError(null)
            }}
          >
            Por Cliente
          </Button>
          <Button
            variant={modo === 'periodo' ? 'primary' : 'secondary'}
            onClick={() => {
              setModo('periodo')
              setResultado(null)
              setSearched(false)
              setError(null)
            }}
          >
            Por Período
          </Button>
        </div>

        {modo === 'cliente' ? (
          <Select
            label="Cliente"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
          >
            <option value="">— Selecione —</option>
            {clientes.data?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </Select>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Data Início"
              type="datetime-local"
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
            />
            <Input
              label="Data Fim"
              type="datetime-local"
              value={fim}
              onChange={(e) => setFim(e.target.value)}
            />
          </div>
        )}

        <Button className="mt-4" onClick={() => void handleBuscar()} loading={loading}>
          Buscar
        </Button>
      </Card>

      {error && (
        <Card className="mb-6 border-[#FFB4B0] bg-[#FFEBEA]">
          <p className="text-sm text-[#C41E16]">{error}</p>
        </Card>
      )}

      {loading ? (
        <TableSkeleton />
      ) : searched && resultado !== null ? (
        resultado.length === 0 ? (
          <EmptyState
            icon={BarChart3}
            title="Nenhuma venda encontrada"
            description={
              modo === 'cliente'
                ? 'Este cliente ainda não possui vendas.'
                : 'Nenhuma venda no período selecionado.'
            }
          />
        ) : (
          <div className="animate-fade-in">
            <Card className="mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#86868B]">
                  {resultado.length} venda(s) encontrada(s)
                </span>
                <span className="text-lg font-medium text-[#3B4ED8]">
                  Total: {formatCurrency(totalGeral)}
                </span>
              </div>
            </Card>

            <Table>
              <TableHead>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Cliente</TableHeaderCell>
                <TableHeaderCell>Data</TableHeaderCell>
                <TableHeaderCell>Total</TableHeaderCell>
              </TableHead>
              <TableBody>
                {resultado.map((venda) => (
                  <TableRow key={venda.id}>
                    <TableCell>#{venda.id}</TableCell>
                    <TableCell>{venda.cliente?.nome ?? '—'}</TableCell>
                    <TableCell>{formatDate(venda.dataVenda)}</TableCell>
                    <TableCell className="font-medium text-[#3B4ED8]">
                      {formatCurrency(venda.valorTotal)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      ) : null}
    </div>
  )
}
