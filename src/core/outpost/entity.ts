import { OutpostType } from '#core/outpost/constant/type'
import {
  BaseEntity,
  BaseEntityProps
} from '#core/type/base.entity'

type OutpostEntityProps = BaseEntityProps & {
  player_id: string
  cell_id: string
  type: OutpostType
}

export class OutpostEntity extends BaseEntity {
  readonly player_id: string
  readonly cell_id: string
  readonly type: OutpostType

  private constructor({
    id,
    player_id,
    cell_id,
    type
  }: OutpostEntityProps) {
    super({ id })

    this.player_id = player_id
    this.cell_id = cell_id
    this.type = type
  }

  static create(props: OutpostEntityProps): OutpostEntity {
    return new OutpostEntity(props)
  }

  isOwnedBy(player_id: string): boolean {
    return this.player_id === player_id
  }
}
