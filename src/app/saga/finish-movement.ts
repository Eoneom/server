import { Factory } from '#adapter/factory'
import { TroupMovementGetActionQuery } from '#app/query/troup/movement/get-action'
import { TroupMovementListFinishedQuery } from '#app/query/troup/movement/list-finished'
import { sagaFinishBase } from '#app/saga/finish-base'
import { sagaFinishExplore } from '#app/saga/finish-explore'
import { MovementAction } from '#core/troup/constant/movement-action'
import { TroupError } from '#core/troup/error'

export const sagaFinishMovement = async ({ player_id }: {
  player_id: string
}) => {
  const key = `finish-movement-${player_id}`
  const lock = Factory.getLock()
  if (lock.has(key)) {
    return
  }

  lock.set(key)

  const { movement_ids } = await new TroupMovementListFinishedQuery().run({ player_id })
  for (const movement_id of movement_ids) {
    await finishMovement({
      player_id,
      movement_id
    })
  }

  lock.delete(key)
}

const finishMovement = async ({
  player_id,
  movement_id
}: {
  player_id: string
  movement_id: string
}) => {
  const { action } = await new TroupMovementGetActionQuery().run({ movement_id })

  switch (action) {
  case MovementAction.EXPLORE:
    await sagaFinishExplore({
      player_id,
      movement_id
    })
    break
  case MovementAction.BASE:
    await sagaFinishBase({
      player_id,
      movement_id
    })
    break
  default:
    throw new Error(TroupError.MOVEMENT_ACTION_NOT_IMPLEMENTED)
  }
}