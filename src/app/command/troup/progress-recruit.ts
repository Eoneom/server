import { GenericCommand } from '#app/command/generic'
import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'
import { TroupEntity } from '#core/troup/entity'
import { TroupError } from '#core/troup/error'
import { now } from '#shared/time'

interface TroupProgressRecruitRequest {
  city_id: string
  player_id: string
}

export interface TroupProgressRecruitExec {
  city: CityEntity
  player_id: string
  troup: TroupEntity | null
}

interface TroupProgressRecruitSave {
  troup: TroupEntity
  recruit_count: number
}

interface TroupProgressRecruitCommandResponse {
  recruit_count: number
}

export class TroupProgressRecruitCommand extends GenericCommand<
  TroupProgressRecruitRequest,
  TroupProgressRecruitExec,
  TroupProgressRecruitSave,
  TroupProgressRecruitCommandResponse
> {
  constructor() {
    super({ name: 'app:command:troup:recruit' })
  }

  async fetch({
    city_id,
    player_id,
  }: TroupProgressRecruitRequest): Promise<TroupProgressRecruitExec> {
    const [
      city_cell,
      city
    ] = await Promise.all([
      this.repository.cell.getCityCell({ city_id }),
      this.repository.city.get(city_id)
    ])

    const troup = await this.repository.troup.getInProgress({ cell_id: city_cell.id })

    return {
      troup,
      city,
      player_id
    }
  }

  exec({
    city,
    player_id,
    troup,
  }: TroupProgressRecruitExec): TroupProgressRecruitSave {
    if (!city.isOwnedBy(player_id)) {
      throw new Error(CityError.NOT_OWNER)
    }

    if (!troup) {
      throw new Error(TroupError.NOT_IN_PROGRESS)
    }

    const updated_troup = troup.progressRecruitment({ progress_time: now() })
    return {
      troup: updated_troup,
      recruit_count: updated_troup.count - troup.count
    }
  }

  async save({
    troup,
    recruit_count
  }: TroupProgressRecruitSave): Promise<TroupProgressRecruitCommandResponse> {
    await this.repository.troup.updateOne(troup)
    return { recruit_count }
  }
}
