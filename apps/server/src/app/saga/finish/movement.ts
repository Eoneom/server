import { Factory } from '#adapter/factory'
import { TroopMovementGetActionQuery } from '#query/troop/movement/get-action'
import { TroopMovementListFinishedQuery } from '#query/troop/movement/list-finished'
import { sagaFinishBase } from '#app/saga/finish/base'
import { sagaFinishExplore } from '#app/saga/finish/explore'
import { MovementAction } from '#core/troop/constant/movement-action'
import { TroopError } from '#core/troop/error'
import { AppEvent } from '#core/events'

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
  const { movement_ids } = await new TroopMovementListFinishedQuery().run({ player_id })
  for (const movement_id of movement_ids) {
    const result = await finishMovement({
      player_id,
      movement_id
    })
    is_outpost_created ||= result.is_outpost_created
  }

  if (movement_ids.length > 0) {
    Factory.getEventBus().emit(AppEvent.TroopMovementFinished, { player_id })
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
  const { action } = await new TroopMovementGetActionQuery().run({ movement_id })

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
    throw new Error(TroopError.MOVEMENT_ACTION_NOT_IMPLEMENTED)
  }
}
