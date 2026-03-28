import { toast } from 'react-toastify'
import { WorldGetSectorDataResponse } from '@kroust/swarm-client'

import { client } from '#helpers/api'
import { isError } from '#helpers/assertion'

export const getSector = async ({ token, sectorId }: { token: string, sectorId: number }): Promise<WorldGetSectorDataResponse | null> => {
  const res = await client.world.getSector(token, { sector: sectorId })
  if (isError(res)) {
    toast.error(res.error_code)
    return null
  }

  return res.data ?? null
}
