import { apiRequest } from './client'
import type { CriarVendaPayload, Venda } from '../types'

export const vendasApi = {
  listar: () => apiRequest<Venda[]>('/vendas'),

  buscarPorId: (id: number) => apiRequest<Venda>(`/vendas/${id}`),

  registrar: (venda: CriarVendaPayload) =>
    apiRequest<Venda>('/vendas', { method: 'POST', body: venda }),
}
