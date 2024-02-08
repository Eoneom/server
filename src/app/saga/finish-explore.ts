import { TroupFinishBaseCommand } from '#app/command/troup/movement/finish/base'
import { TroupFinishExploreCommand } from '#app/command/troup/movement/finish/explore'

export const sagaFinishExplore = async ({
  player_id, movement_id
}: {
  player_id: string
  movement_id: string
}) => {
  const { base_movement } = await new TroupFinishExploreCommand().run({
    player_id,
    movement_id,
  })

  if (base_movement.isArrived()) {
    await new TroupFinishBaseCommand().run({
      player_id,
      movement_id: base_movement.id
    })
  }
}
