import { BuildingEntity } from '../../building/domain/entity'

export interface Cell {
  x: number
  y: number
}

export interface ResourcesToBuild {
  wood?: number
}

export class CityEntity {
  readonly id: string
  readonly name: string
  readonly wood: number
  readonly buildings: Record<string, BuildingEntity>
  readonly last_wood_gather: number
  readonly cells: Array<Cell>

  constructor({
    id,
    name,
    wood,
    last_wood_gather
  }: {
    id: string,
    name: string,
    wood: number,
    last_wood_gather: number
  }) {
    this.id = id
    this.name = name
    this.wood = wood
    this.last_wood_gather = last_wood_gather
    this.buildings = {}
    this.cells = []
  }

  hasResources(
    wood_cost: number
  ): boolean {
    return this.wood >= wood_cost
  }
}
