import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { client } from '#helpers/api'
import { isError } from '#helpers/assertion'
import { useAuth } from '#auth/context'
import { cityKeys } from '#city/hooks'

const REFRESH_INTERVAL_MS = 3000

export const useGameStateRefresh = (cityId: string | null | undefined) => {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!token || !cityId) return

    const refresh = async () => {
      const res = await client.game.refreshState(token, { city_id: cityId })
      if (isError(res)) return
      queryClient.invalidateQueries({ queryKey: cityKeys.detail(cityId) })
    }

    refresh()
    const interval = setInterval(refresh, REFRESH_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [cityId, token, queryClient])
}
