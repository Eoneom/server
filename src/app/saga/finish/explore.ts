import { finishTroupBaseMovement } from '#app/command/troup/movement/finish/base'
import { finishTroupExploreMovement } from '#app/command/troup/movement/finish/explore'

export const sagaFinishExplore = async ({
  player_id, movement_id
}: {
  player_id: string
  movement_id: string
}) => {
  const { base_movement } = await finishTroupExploreMovement({
    player_id,
    movement_id,
  })

  if (base_movement.isArrived()) {
    await finishTroupBaseMovement({
      player_id,
      movement_id: base_movement.id
    })
  }
}
