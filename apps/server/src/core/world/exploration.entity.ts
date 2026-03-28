import { BaseEntity } from '#core/type/base.entity'
import { id } from '#shared/identification'

type ExplorationEntityProps = BaseEntity & {
  player_id: string
  cell_ids: string[]
}

export class ExplorationEntity extends BaseEntity {
  readonly player_id: string
  readonly cell_ids: string[]

  private constructor({
    id,
    player_id,
    cell_ids,
  }: ExplorationEntityProps) {
    super({ id })

    this.player_id = player_id
    this.cell_ids = cell_ids
  }

  static init(props: Omit<ExplorationEntityProps, 'id'>): ExplorationEntity {
    return new ExplorationEntity({
      ...props,
      id: id()
    })
  }

  static create(props: ExplorationEntityProps): ExplorationEntity {
    return new ExplorationEntity(props)
  }

  exploreCells(cell_ids_to_explore: string[]): ExplorationEntity {
    const new_cell_ids = new Set([
      ...this.cell_ids,
      ...cell_ids_to_explore
    ])

    return ExplorationEntity.create({
      ...this,
      cell_ids: Array.from(new_cell_ids)
    })
  }
}
