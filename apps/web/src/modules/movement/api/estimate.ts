import { client } from '#helpers/api'
import { isError } from '#helpers/assertion'
import { Coordinates, TroopCode, TroopMovementEstimateDataResponse } from '@eoneom/api-client'

export const estimateMovement = async ({ token, origin, destination, troopCodes }: { token: string, origin: Coordinates, destination: Coordinates, troopCodes: TroopCode[] }): Promise<TroopMovementEstimateDataResponse | null> => {
  const res = await client.troop.estimateMovement(token, { origin, destination, troop_codes: troopCodes })
  if (isError(res)) {
    return null
  }

  return res.data ?? null
}
