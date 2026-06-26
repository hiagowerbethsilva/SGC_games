import { apiRequest } from './client'
import type { Cliente } from '../types'

export const clientesApi = {
  listar: () => apiRequest<Cliente[]>('/clientes'),

  buscarPorId: (id: number) => apiRequest<Cliente>(`/clientes/${id}`),

  criar: (cliente: Cliente) =>
    apiRequest<Cliente>('/clientes', { method: 'POST', body: cliente }),

  atualizar: (id: number, cliente: Cliente) =>
    apiRequest<Cliente>(`/clientes/${id}`, { method: 'PUT', body: cliente }),

  remover: (id: number) =>
    apiRequest<void>(`/clientes/${id}`, { method: 'DELETE' }),
}
