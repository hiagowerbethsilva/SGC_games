import type { ReactNode } from 'react'
import { ErrorState } from './ErrorState'
import { Spinner } from './Spinner'

interface AsyncContentProps<T> {
  loading: boolean
  error: string | null
  data: T | null
  isEmpty?: boolean
  onRetry?: () => void
  loadingFallback?: ReactNode
  emptyFallback?: ReactNode
  children: (data: T) => ReactNode
}

export function AsyncContent<T>({
  loading,
  error,
  data,
  isEmpty,
  onRetry,
  loadingFallback,
  emptyFallback,
  children,
}: AsyncContentProps<T>) {
  if (loading) {
    return (
      loadingFallback ?? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      )
    )
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />
  }

  if (isEmpty) {
    return emptyFallback ?? null
  }

  if (data === null) return null

  return <>{children(data)}</>
}
