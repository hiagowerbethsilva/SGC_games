import type { Cliente } from './cliente'
import type { Produto } from './produto'
import type { Usuario } from './usuario'

export interface ItemVenda {
  id?: number
  quantidade: number
  precoUnitario?: number
  subtotal?: number
  produto: Produto
  venda?: Venda
}

export interface Venda {
  id?: number
  dataVenda?: string
  valorTotal?: number
  cliente: Cliente
  usuario: Usuario
  itens: ItemVenda[]
}

export interface CriarVendaPayload {
  cliente: { id: number }
  usuario: { id: number }
  itens: Array<{
    produto: { id: number }
    quantidade: number
  }>
}
