import { useState } from 'react'

import { Sector } from '#types'
import { getSector } from '#map/api/sector'
import { useAuth } from '#auth/context'

interface FetchParams {
  sectorId: number
}

export const useWorld = () => {
  const [sector, setSector] = useState<Sector | null>(null)
  const { token } = useAuth()

  const fetch = async ({ sectorId }: FetchParams) => {
    if (!token) return

    const fetched_sector = await getSector({ token, sectorId })
    if (!fetched_sector) return

    setSector({
      id: sectorId,
      cells: fetched_sector.cells
    })
  }

  return { sector, fetch }
}
