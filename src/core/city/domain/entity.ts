import { BaseEntity, BaseEntityProps } from '../../../types/domain'

import { BuildingEntity } from '../../building/domain/entity'

export interface Cell {
  x: number
  y: number
}

type CityEntityProps = BaseEntityProps & {
  name: string,
  wood: number,
  last_wood_gather: number
}

export class CityEntity extends BaseEntity {
  readonly name: string
  readonly wood: number
  readonly last_wood_gather: number
  readonly cells: Array<Cell>

  constructor({
    id,
    name,
    wood,
    last_wood_gather
  }: CityEntityProps) {
    super({ id })
    this.name = name
    this.wood = wood
    this.last_wood_gather = last_wood_gather
    this.cells = []
  }

  hasResources(
    wood_cost: number
  ): boolean {
    return this.wood >= wood_cost
  }
}
