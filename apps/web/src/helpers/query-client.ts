import { QueryCache, QueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error((error as Error).message)
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: false,
    },
  },
})
