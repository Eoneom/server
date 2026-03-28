import { client } from '#helpers/api'
import { isError } from '#helpers/assertion'
import { Coordinates, TroupCode, TroupMovementEstimateDataResponse } from '@kroust/swarm-client'

export const estimateMovement = async ({ token, origin, destination, troupCodes }: { token: string, origin: Coordinates, destination: Coordinates, troupCodes: TroupCode[] }): Promise<TroupMovementEstimateDataResponse | null> => {
  const res = await client.troup.estimateMovement(token, { origin, destination, troup_codes: troupCodes })
  if (isError(res)) {
    return null
  }

  return res.data ?? null
}
