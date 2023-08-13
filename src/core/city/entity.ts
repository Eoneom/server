import {
  STARTING_MUSHROOM, STARTING_PLASTIC
} from '#core/city/constants'
import { CityErrors } from '#core/city/errors'
import { id } from '#shared/identification'
import { Resource } from '#shared/resource'
import { now } from '#shared/time'
import {
  BaseEntity, BaseEntityProps
} from '#core/type/entity'

type CityEntityProps = BaseEntityProps & {
  player_id: string
  name: string
  plastic: number
  mushroom: number
  last_plastic_gather: number
  last_mushroom_gather: number
}

export class CityEntity extends BaseEntity {
  readonly player_id: string
  readonly name: string
  readonly plastic: number
  readonly mushroom: number
  readonly last_plastic_gather: number
  readonly last_mushroom_gather: number

  private constructor({
    id,
    player_id,
    name,
    plastic,
    mushroom,
    last_plastic_gather,
    last_mushroom_gather
  }: CityEntityProps) {
    super({ id })

    this.player_id = player_id
    this.name = name
    this.plastic = plastic
    this.mushroom = mushroom
    this.last_plastic_gather = last_plastic_gather
    this.last_mushroom_gather = last_mushroom_gather
  }

  static create(props: CityEntityProps): CityEntity {
    return new CityEntity(props)
  }

  static initCity({
    name, player_id
  }: { name: string, player_id: string }): CityEntity {
    const last_gather = now()
    return new CityEntity({
      id: id(),
      player_id,
      name,
      plastic: STARTING_PLASTIC,
      mushroom: STARTING_MUSHROOM,
      last_plastic_gather: last_gather,
      last_mushroom_gather: last_gather
    })
  }

  purchase({
    plastic,
    mushroom
  }: Resource): CityEntity {
    const has_resources = this.hasResources({
      plastic,
      mushroom
    })
    if (!has_resources) {
      throw new Error(CityErrors.NOT_ENOUGH_RESOURCES)
    }

    return new CityEntity({
      ...this,
      plastic: this.plastic - plastic,
      mushroom: this.mushroom - mushroom
    })
  }

  refund({
    plastic,
    mushroom
  }: Resource): CityEntity {
    return new CityEntity({
      ...this,
      plastic: this.plastic + plastic,
      mushroom: this.mushroom + mushroom
    })
  }

  gather({
    earnings_by_second,
    gather_at_time
  }: {
    earnings_by_second: Resource,
    gather_at_time: number
  }): {
    city: CityEntity,
    updated: boolean,
  } {
    const plastic_earnings = this.getEarnings({
      earnings_by_second: earnings_by_second.plastic,
      last_gather_time: this.last_plastic_gather,
      gather_at_time
    })
    const mushroom_earnings = this.getEarnings({
      earnings_by_second: earnings_by_second.mushroom,
      last_gather_time: this.last_mushroom_gather,
      gather_at_time
    })
    const updated = Boolean(plastic_earnings) || Boolean(mushroom_earnings)
    const city: CityEntity = this
      .gatherPlastic({
        earnings: plastic_earnings,
        gather_at_time
      })
      .gatherMushroom({
        earnings: mushroom_earnings,
        gather_at_time
      })

    return {
      city,
      updated
    }
  }

  isOwnedBy(player_id: string): boolean {
    return this.player_id === player_id
  }

  private hasResources({
    plastic, mushroom
  }: Resource): boolean {
    return this.plastic >= plastic && this.mushroom >= mushroom
  }

  private gatherPlastic({
    earnings,
    gather_at_time
  }:{
    earnings: number
    gather_at_time: number
  }): CityEntity {
    if (!earnings) {
      return this
    }

    return new CityEntity({
      ...this,
      last_plastic_gather: gather_at_time,
      plastic: this.plastic + earnings
    })
  }

  private gatherMushroom({
    earnings,
    gather_at_time
  }: {
    earnings: number
    gather_at_time: number
  }): CityEntity {
    if (!earnings) {
      return this
    }

    return new CityEntity({
      ...this,
      last_mushroom_gather: gather_at_time,
      mushroom: this.mushroom + earnings
    })
  }

  private getEarnings({
    earnings_by_second,
    last_gather_time,
    gather_at_time
  }: {
    earnings_by_second: number,
    last_gather_time: number,
    gather_at_time: number
  }): number {
    const can_gather = this.canGather(last_gather_time, gather_at_time)
    if (!can_gather) {
      return 0
    }

    const seconds_since_last_gather = this.getSecondsSinceLastGather(last_gather_time, gather_at_time)
    if (seconds_since_last_gather < 1) {
      return 0
    }

    return Math.floor(seconds_since_last_gather * earnings_by_second)
  }

  private canGather(last_gather_time: number, gather_at_time: number): boolean {
    return gather_at_time >= last_gather_time
  }

  private getSecondsSinceLastGather(last_gather_time: number, gather_at_time: number): number {
    return Math.floor((gather_at_time - last_gather_time) / 1000)
  }
}
