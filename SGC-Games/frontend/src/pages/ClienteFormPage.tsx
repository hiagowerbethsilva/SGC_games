import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { clientesApi } from '../api'
import { useAsync } from '../hooks/useAsync'
import { useMutation } from '../hooks/useMutation'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Alert } from '../components/ui/Alert'
import { Spinner } from '../components/ui/Spinner'
import type { Cliente } from '../types'

const emptyCliente: Cliente = {
  nome: '',
  cpf: '',
  email: '',
  telefone: '',
  endereco: '',
}

export function ClienteFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [form, setForm] = useState<Cliente>(emptyCliente)

  const { data, loading, error } = useAsync(
    () => clientesApi.buscarPorId(Number(id)),
    [id],
    { immediate: isEditing },
  )

  useEffect(() => {
    if (data) setForm(data)
  }, [data])

  const saveMutation = useMutation(
    (cliente: Cliente) =>
      isEditing ? clientesApi.atualizar(Number(id), cliente) : clientesApi.criar(cliente),
    {
      successMessage: isEditing ? 'Cliente atualizado com sucesso.' : 'Cliente cadastrado com sucesso.',
      onSuccess: () => navigate('/clientes'),
    },
  )

  const handleChange = (field: keyof Cliente, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void saveMutation.mutate(form)
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
        title={isEditing ? 'Editar Cliente' : 'Novo Cliente'}
        description={isEditing ? 'Atualize os dados do cliente' : 'Preencha os dados do novo cliente'}
      />

      <Card className="max-w-2xl animate-fade-in">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome"
            value={form.nome}
            onChange={(e) => handleChange('nome', e.target.value)}
            required
          />
          <Input
            label="CPF"
            value={form.cpf}
            onChange={(e) => handleChange('cpf', e.target.value)}
            placeholder="000.000.000-00"
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
          <Input
            label="Telefone"
            value={form.telefone ?? ''}
            onChange={(e) => handleChange('telefone', e.target.value)}
          />
          <Input
            label="Endereço"
            value={form.endereco ?? ''}
            onChange={(e) => handleChange('endereco', e.target.value)}
          />

          {saveMutation.error && <Alert variant="error">{saveMutation.error}</Alert>}

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={saveMutation.loading}>
              {isEditing ? 'Salvar' : 'Cadastrar'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/clientes')}>
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
