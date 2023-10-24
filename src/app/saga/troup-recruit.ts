import { TechnologyFinishResearchCommand } from '#app/command/technology/finish-research'
import { TroupRecruitCommand } from '#app/command/troup/recruit'
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
  await new TechnologyFinishResearchCommand().run({ player_id })
  await new TroupRecruitCommand().run({
    city_id,
    count,
    player_id,
    troup_code,
  })
}
