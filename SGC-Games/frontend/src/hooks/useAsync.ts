import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../types/api'

interface UseAsyncOptions {
  immediate?: boolean
}

export function useAsync<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
  options: UseAsyncOptions = { immediate: true },
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(options.immediate ?? true)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetcher()
      setData(result)
      return result
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Ocorreu um erro inesperado. Tente novamente.'
      setError(message)
      setData(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [fetcher])

  useEffect(() => {
    if (options.immediate !== false) {
      void execute()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  const isEmpty = !loading && !error && Array.isArray(data) && data.length === 0

  return { data, loading, error, isEmpty, refetch: execute }
}
