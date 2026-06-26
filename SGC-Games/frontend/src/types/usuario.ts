export interface Usuario {
  id?: number
  username: string
  senha?: string
  perfil: string
  token?: string
  tokenExpiracao?: string
}

export interface LoginPayload {
  username: string
  senha: string
}

export interface AuthUser {
  id: number
  username: string
  perfil: string
  token?: string
}
