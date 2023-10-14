import {
  STARTING_MUSHROOM,
  STARTING_PLASTIC
} from '#core/city/constant'
import { CityError } from '#core/city/error'
import { id } from '#shared/identification'
import { Resource } from '#shared/resource'
import { now } from '#shared/time'
import {
  BaseEntity,
  BaseEntityProps
} from '#core/type/base.entity'

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
    name,
    player_id
  }: {
    name: string
    player_id: string
  }): CityEntity {
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
    player_id,
    resource,
  }: {
    player_id: string
    resource: Resource
  }): CityEntity {
    if (!this.isOwnedBy(player_id)) {
      throw new Error(CityError.NOT_OWNER)
    }

    const has_resources = this.hasResources(resource)
    if (!has_resources) {
      throw new Error(CityError.NOT_ENOUGH_RESOURCES)
    }

    return new CityEntity({
      ...this,
      plastic: this.plastic - resource.plastic,
      mushroom: this.mushroom - resource.mushroom
    })
  }

  refund({
    player_id,
    resource
  }: {
    player_id: string
    resource: Resource
  }): CityEntity {
    if (!this.isOwnedBy(player_id)) {
      throw new Error(CityError.NOT_OWNER)
    }

    return new CityEntity({
      ...this,
      plastic: this.plastic + resource.plastic,
      mushroom: this.mushroom + resource.mushroom
    })
  }

  gather({
    earnings_per_second,
    gather_at_time,
    player_id,
    warehouses_capacity
  }: {
    earnings_per_second: Resource
    player_id: string
    gather_at_time: number
    warehouses_capacity: Resource
  }): {
    city: CityEntity,
    updated: boolean,
  } {
    if (!this.isOwnedBy(player_id)) {
      throw new Error(CityError.NOT_OWNER)
    }

    const plastic_earnings = this.getEarnings({
      earnings_per_second: earnings_per_second.plastic,
      last_gather_time: this.last_plastic_gather,
      gather_at_time
    })
    const mushroom_earnings = this.getEarnings({
      earnings_per_second: earnings_per_second.mushroom,
      last_gather_time: this.last_mushroom_gather,
      gather_at_time
    })
    const updated = Boolean(plastic_earnings) || Boolean(mushroom_earnings)
    const city = this
      .gatherPlastic({
        earnings: plastic_earnings,
        gather_at_time,
        capacity: warehouses_capacity.plastic
      })
      .gatherMushroom({
        capacity: warehouses_capacity.mushroom,
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
    capacity,
    gather_at_time
  }:{
    earnings: number
    capacity: number
    gather_at_time: number
  }): CityEntity {
    if (!earnings) {
      return this
    }

    const capped_earnings = this.getCappedEarnings({
      earnings,
      capacity,
      current_resource: this.plastic
    })

    return new CityEntity({
      ...this,
      last_plastic_gather: gather_at_time,
      plastic: this.plastic + capped_earnings
    })
  }

  private gatherMushroom({
    earnings,
    capacity,
    gather_at_time
  }: {
    earnings: number
    capacity: number
    gather_at_time: number
  }): CityEntity {
    if (!earnings) {
      return this
    }

    const capped_earnings = this.getCappedEarnings({
      earnings,
      capacity,
      current_resource: this.mushroom
    })

    return new CityEntity({
      ...this,
      last_mushroom_gather: gather_at_time,
      mushroom: this.mushroom + capped_earnings
    })
  }

  private getCappedEarnings({
    earnings,
    capacity,
    current_resource
  }: {
    earnings: number
    capacity: number
    current_resource: number
  }): number {
    return earnings + current_resource > capacity ? capacity - current_resource : earnings
  }

  private getEarnings({
    earnings_per_second,
    last_gather_time,
    gather_at_time,
  }: {
    earnings_per_second: number,
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

    return Math.floor(seconds_since_last_gather * earnings_per_second)
  }

  private canGather(last_gather_time: number, gather_at_time: number): boolean {
    return gather_at_time >= last_gather_time
  }

  private getSecondsSinceLastGather(last_gather_time: number, gather_at_time: number): number {
    return Math.floor((gather_at_time - last_gather_time) / 1000)
  }
}
