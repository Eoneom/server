import { finishTroopBaseMovement } from '#app/command/troop/movement/finish/base'
import { rebaseTroopMovement } from '#app/command/troop/movement/rebase'
import { OutpostError } from '#core/outpost/error'

export const sagaFinishBase = async ({
  player_id, movement_id
}: {
  player_id: string
  movement_id: string
}): Promise<{ is_outpost_created: boolean }> => {
  try {
    return await finishTroopBaseMovement({
      player_id,
      movement_id,
    })
  } catch (err: unknown) {
    if ((err as Error).message === OutpostError.LIMIT_REACHED) {
      await rebaseTroopMovement({
        player_id,
        movement_id
      })
      return { is_outpost_created: false }
    }

    throw err
  }
}
