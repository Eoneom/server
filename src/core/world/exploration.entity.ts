import { BaseEntity } from '#core/type/entity'
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
}
