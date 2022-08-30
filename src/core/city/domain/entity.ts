import { BaseEntity, BaseEntityProps } from '../../../types/domain'
import { STARTING_MUSHROOM, STARTING_PLASTIC } from './constants'

import { CityErrors } from './errors'
import { now } from '../../shared/time'

export interface Cell {
  x: number
  y: number
}

type CityEntityProps = BaseEntityProps & {
  name: string,
  plastic: number,
  mushroom: number,
  last_plastic_gather: number
  last_mushroom_gather: number
}

export class CityEntity extends BaseEntity {
  readonly name: string
  readonly plastic: number
  readonly mushroom: number
  readonly last_plastic_gather: number
  readonly last_mushroom_gather: number
  readonly cells: Array<Cell>

  private constructor({
    id,
    name,
    plastic,
    mushroom,
    last_plastic_gather,
    last_mushroom_gather
  }: CityEntityProps) {
    super({ id })
    this.name = name
    this.plastic = plastic
    this.mushroom = mushroom
    this.last_plastic_gather = last_plastic_gather
    this.last_mushroom_gather = last_mushroom_gather
    this.cells = []
  }

  purchase({
    plastic_cost,
    mushroom_cost
  }: {
    plastic_cost: number,
    mushroom_cost: number
  }): CityEntity {
    const has_resources = this.hasResources({ plastic_cost, mushroom_cost })
    if (!has_resources) {
      throw new Error(CityErrors.NOT_ENOUGH_RESOURCES)
    }

    return new CityEntity({
      ...this,
      plastic: this.plastic - plastic_cost,
      mushroom: this.mushroom - mushroom_cost
    })
  }

  hasResources({ plastic_cost, mushroom_cost }: { mushroom_cost: number, plastic_cost: number }): boolean {
    return this.plastic >= plastic_cost &&
      this.mushroom >= mushroom_cost
  }

  gatherMushroom({
    earnings_by_second,
    gather_at_time
  }: {
    earnings_by_second: number,
    gather_at_time: number
  }): {
    updated: boolean,
    city: CityEntity
  } {
    if (gather_at_time <= this.last_mushroom_gather) {
      return {
        updated: false,
        city: this
      }
    }

    const seconds_since_last_gather = this.getSecondsSinceLastMushromGather(gather_at_time)
    if (seconds_since_last_gather < 1) {
      return {
        updated: false,
        city: this
      }
    }

    const earnings = Math.floor(seconds_since_last_gather * earnings_by_second)
    const updated_city = new CityEntity({
      ...this,
      mushroom: this.mushroom + earnings,
      last_mushroom_gather: now()
    })

    return {
      updated: true,
      city: updated_city
    }
  }

  gatherPlastic({
    earnings_by_second,
    gather_at_time
  }: {
    earnings_by_second: number,
    gather_at_time: number
  }): {
    updated: boolean,
    city: CityEntity
  } {
    if (gather_at_time <= this.last_plastic_gather) {
      return {
        updated: false,
        city: this
      }
    }

    const seconds_since_last_gather = this.getSecondsSinceLastPlasticGather(gather_at_time)
    if (seconds_since_last_gather < 1) {
      return {
        updated: false,
        city: this
      }
    }

    const earnings = Math.floor(seconds_since_last_gather * earnings_by_second)
    const updated_city = new CityEntity({
      ...this,
      plastic: this.plastic + earnings,
      last_plastic_gather: now()
    })

    return {
      updated: true,
      city: updated_city
    }
  }

  private getSecondsSinceLastPlasticGather(gather_at_time: number): number {
    return Math.floor((gather_at_time - this.last_plastic_gather) / 1000)
  }

  private getSecondsSinceLastMushromGather(gather_at_time: number): number {
    return Math.floor((gather_at_time - this.last_mushroom_gather) / 1000)
  }

  static create(props: CityEntityProps): CityEntity {
    return new CityEntity(props)
  }

  static initCity({ name }: { name: string }): CityEntity {
    return new CityEntity({
      id: 'fake',
      name,
      plastic: STARTING_PLASTIC,
      mushroom: STARTING_MUSHROOM,
      last_plastic_gather: now(),
      last_mushroom_gather: now()
    })
  }
}
