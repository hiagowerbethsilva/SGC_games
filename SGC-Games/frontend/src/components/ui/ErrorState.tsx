import { AlertCircle } from 'lucide-react'
import { Button } from './Button'

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFEBEA] text-[#FF3B30]">
        <AlertCircle className="h-8 w-8" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-medium text-[#1D1D1F]">Algo deu errado</h3>
      <p className="mt-2 max-w-md text-sm text-[#86868B]">{message}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-6" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  )
}
