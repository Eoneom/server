import { TroupFinishBaseCommand } from '#app/command/troup/movement/finish/base'
import { TroupRebaseCommand } from '#app/command/troup/movement/rebase'
import { OutpostError } from '#core/outpost/error'

export const sagaFinishBase = async ({
  player_id, movement_id
}: {
  player_id: string
  movement_id: string
}) => {
  try {
    await new TroupFinishBaseCommand().run({
      player_id,
      movement_id,
    })
  } catch (err: unknown) {
    if ((err as Error).message === OutpostError.LIMIT_REACHED) {
      await new TroupRebaseCommand().run({
        player_id,
        movement_id
      })
      return
    }

    throw err
  }
}
