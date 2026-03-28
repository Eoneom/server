import { Factory } from '#adapter/factory'
import { TroupMovementGetActionQuery } from '#app/query/troup/movement/get-action'
import { TroupMovementListFinishedQuery } from '#app/query/troup/movement/list-finished'
import { sagaFinishBase } from '#app/saga/finish/base'
import { sagaFinishExplore } from '#app/saga/finish/explore'
import { MovementAction } from '#core/troup/constant/movement-action'
import { TroupError } from '#core/troup/error'

export const sagaFinishMovement = async ({ player_id }: {
  player_id: string
}): Promise<{ is_outpost_created: boolean }> => {
  const key = `finish-movement-${player_id}`
  const lock = Factory.getLock()
  if (lock.has(key)) {
    return { is_outpost_created: false }
  }

  lock.set(key)

  let is_outpost_created = false
  const { movement_ids } = await new TroupMovementListFinishedQuery().run({ player_id })
  for (const movement_id of movement_ids) {
    const result = await finishMovement({
      player_id,
      movement_id
    })
    is_outpost_created ||= result.is_outpost_created
  }

  lock.delete(key)

  return { is_outpost_created }
}

const finishMovement = async ({
  player_id,
  movement_id
}: {
  player_id: string
  movement_id: string
}): Promise<{ is_outpost_created: boolean }> => {
  const { action } = await new TroupMovementGetActionQuery().run({ movement_id })

  switch (action) {
  case MovementAction.EXPLORE:
    await sagaFinishExplore({
      player_id,
      movement_id
    })
    return { is_outpost_created: false }
  case MovementAction.BASE:
    return sagaFinishBase({
      player_id,
      movement_id
    })
  default:
    throw new Error(TroupError.MOVEMENT_ACTION_NOT_IMPLEMENTED)
  }
}
