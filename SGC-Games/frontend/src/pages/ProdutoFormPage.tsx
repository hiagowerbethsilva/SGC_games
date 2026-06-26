import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { produtosApi } from '../api'
import { useAsync } from '../hooks/useAsync'
import { useMutation } from '../hooks/useMutation'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { Button } from '../components/ui/Button'
import { Alert } from '../components/ui/Alert'
import { Spinner } from '../components/ui/Spinner'
import type { Produto } from '../types'

const emptyProduto: Produto = {
  nome: '',
  descricao: '',
  preco: 0,
  quantidadeEstoque: 0,
  estoqueMinimo: 0,
  tipo: '',
  plataforma: '',
}

export function ProdutoFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [form, setForm] = useState<Produto>(emptyProduto)

  const { data, loading, error } = useAsync(
    () => produtosApi.buscarPorId(Number(id)),
    [id],
    { immediate: isEditing },
  )

  useEffect(() => {
    if (data) setForm(data)
  }, [data])

  const saveMutation = useMutation(
    (produto: Produto) =>
      isEditing ? produtosApi.atualizar(Number(id), produto) : produtosApi.criar(produto),
    {
      successMessage: isEditing ? 'Produto atualizado com sucesso.' : 'Produto cadastrado com sucesso.',
      onSuccess: () => navigate('/produtos'),
    },
  )

  const handleChange = (field: keyof Produto, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void saveMutation.mutate({
      ...form,
      preco: Number(form.preco),
      quantidadeEstoque: Number(form.quantidadeEstoque),
      estoqueMinimo: Number(form.estoqueMinimo),
    })
  }

  if (isEditing && loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isEditing && error) {
    return <Alert variant="error">{error}</Alert>
  }

  return (
    <div>
      <PageHeader
        title={isEditing ? 'Editar Produto' : 'Novo Produto'}
        description={isEditing ? 'Atualize os dados do produto' : 'Adicione um novo item ao catálogo'}
      />

      <Card className="max-w-2xl animate-fade-in">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome"
            value={form.nome}
            onChange={(e) => handleChange('nome', e.target.value)}
            required
          />
          <Textarea
            label="Descrição"
            value={form.descricao ?? ''}
            onChange={(e) => handleChange('descricao', e.target.value)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Preço (R$)"
              type="number"
              step="0.01"
              min="0"
              value={form.preco}
              onChange={(e) => handleChange('preco', e.target.value)}
              required
            />
            <Input
              label="Quantidade em Estoque"
              type="number"
              min="0"
              value={form.quantidadeEstoque}
              onChange={(e) => handleChange('quantidadeEstoque', e.target.value)}
              required
            />
            <Input
              label="Estoque Mínimo"
              type="number"
              min="0"
              value={form.estoqueMinimo}
              onChange={(e) => handleChange('estoqueMinimo', e.target.value)}
              required
            />
            <Input
              label="Tipo"
              value={form.tipo}
              onChange={(e) => handleChange('tipo', e.target.value)}
              placeholder="Jogo, Acessório..."
              required
            />
            <Input
              label="Plataforma"
              value={form.plataforma}
              onChange={(e) => handleChange('plataforma', e.target.value)}
              placeholder="PS5, Xbox, PC..."
              required
              className="sm:col-span-2"
            />
          </div>

          {saveMutation.error && <Alert variant="error">{saveMutation.error}</Alert>}

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={saveMutation.loading}>
              {isEditing ? 'Salvar' : 'Cadastrar'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/produtos')}>
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
