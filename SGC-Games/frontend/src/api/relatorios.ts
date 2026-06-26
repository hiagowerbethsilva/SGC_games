import { apiRequest } from './client'
import type { Venda } from '../types'

export const relatoriosApi = {
  vendasPorCliente: (clienteId: number) =>
    apiRequest<Venda[]>(`/relatorios/cliente/${clienteId}`),

  vendasPorPeriodo: (inicio: string, fim: string) =>
    apiRequest<Venda[]>(`/relatorios/periodo?inicio=${encodeURIComponent(inicio)}&fim=${encodeURIComponent(fim)}`),
}
