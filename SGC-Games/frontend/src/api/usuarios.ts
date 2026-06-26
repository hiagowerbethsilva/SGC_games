import { apiRequest } from './client'
import type { LoginPayload, Usuario } from '../types'

export const usuariosApi = {
  login: (payload: LoginPayload) =>
    apiRequest<Usuario>('/usuarios/login', { method: 'POST', body: payload }),

  criar: (usuario: Usuario) =>
    apiRequest<Usuario>('/usuarios', { method: 'POST', body: usuario }),

  listar: () => apiRequest<Usuario[]>('/usuarios'),

  buscarPorId: (id: number) => apiRequest<Usuario>(`/usuarios/${id}`),
}
