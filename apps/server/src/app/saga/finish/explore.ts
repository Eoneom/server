import { finishTroopBaseMovement } from '#app/command/troop/movement/finish/base'
import { finishTroopExploreMovement } from '#app/command/troop/movement/finish/explore'

export const sagaFinishExplore = async ({
  player_id, movement_id
}: {
  player_id: string
  movement_id: string
}) => {
  const { base_movement } = await finishTroopExploreMovement({
    player_id,
    movement_id,
  })

  if (base_movement.isArrived()) {
    await finishTroopBaseMovement({
      player_id,
      movement_id: base_movement.id
    })
  }
}
