import { apiRequest } from './client'
import type { Produto } from '../types'

export const produtosApi = {
  listar: () => apiRequest<Produto[]>('/produtos'),

  buscarPorId: (id: number) => apiRequest<Produto>(`/produtos/${id}`),

  criar: (produto: Produto) =>
    apiRequest<Produto>('/produtos', { method: 'POST', body: produto }),

  atualizar: (id: number, produto: Produto) =>
    apiRequest<Produto>(`/produtos/${id}`, { method: 'PUT', body: produto }),

  remover: (id: number) =>
    apiRequest<void>(`/produtos/${id}`, { method: 'DELETE' }),

  listarEstoqueBaixo: () => apiRequest<Produto[]>('/produtos/estoque-baixo'),
}
