import { BaseEntity, BaseEntityProps } from '../../../types/domain'

import { BuildingEntity } from '../../building/domain/entity'

export interface Cell {
  x: number
  y: number
}

type CityEntityProps = BaseEntityProps & {
  name: string,
  plastic: number,
  last_plastic_gather: number
}

export class CityEntity extends BaseEntity {
  readonly name: string
  readonly plastic: number
  readonly last_plastic_gather: number
  readonly cells: Array<Cell>

  constructor({
    id,
    name,
    plastic,
    last_plastic_gather
  }: CityEntityProps) {
    super({ id })
    this.name = name
    this.plastic = plastic
    this.last_plastic_gather = last_plastic_gather
    this.cells = []
  }

  hasResources(
    plastic_cost: number
  ): boolean {
    return this.plastic >= plastic_cost
  }
}
