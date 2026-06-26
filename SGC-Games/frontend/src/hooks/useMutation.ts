import { useCallback, useState } from 'react'
import { ApiError, type MutationStatus } from '../types/api'
import { useToast } from '../context/ToastContext'

interface UseMutationOptions<T> {
  successMessage?: string
  showSuccessToast?: boolean
  showErrorToast?: boolean
  onSuccess?: (data: T) => void
  onError?: (message: string) => void
}

export function useMutation<T, TVariables = void>(
  mutator: (variables: TVariables) => Promise<T>,
  options: UseMutationOptions<T> = {},
) {
  const { showToast } = useToast()
  const [status, setStatus] = useState<MutationStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<T | null>(null)

  const mutate = useCallback(
    async (variables: TVariables) => {
      setStatus('loading')
      setError(null)
      try {
        const result = await mutator(variables)
        setData(result)
        setStatus('success')
        if (options.showSuccessToast !== false && options.successMessage) {
          showToast(options.successMessage, 'success')
        }
        options.onSuccess?.(result)
        return result
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : 'Ocorreu um erro inesperado. Tente novamente.'
        setError(message)
        setStatus('error')
        if (options.showErrorToast !== false) {
          showToast(message, 'error')
        }
        options.onError?.(message)
        return null
      }
    },
    [mutator, options, showToast],
  )

  const reset = useCallback(() => {
    setStatus('idle')
    setError(null)
    setData(null)
  }, [])

  return {
    mutate,
    reset,
    status,
    loading: status === 'loading',
    error,
    data,
    isSuccess: status === 'success',
    isError: status === 'error',
  }
}
