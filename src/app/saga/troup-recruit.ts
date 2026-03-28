import { finishBuildingUpgrade } from '#app/command/building/finish-upgrade'
import { finishTechnologyResearch } from '#app/command/technology/finish-research'
import { recruitTroup } from '#app/command/troup/recruit'
import { TroupCode } from '#core/troup/constant/code'

export const sagaRecruitTroup = async ({
  city_id,
  troup_code,
  count,
  player_id
}: {
  city_id: string
  troup_code: TroupCode
  count: number
  player_id: string
}): Promise<void> => {
  await finishBuildingUpgrade({
    player_id,
    city_id
  })
  await finishTechnologyResearch({ player_id })
  await recruitTroup({
    city_id,
    count,
    player_id,
    troup_code,
  })
}
