import { id } from '#shared/identification'
import {
  BaseEntity,
  BaseEntityProps
} from '#core/type/base/entity'

type CityEntityProps = BaseEntityProps & {
  player_id: string
  name: string
}

export class CityEntity extends BaseEntity {
  readonly player_id: string
  readonly name: string

  private constructor({
    id,
    player_id,
    name
  }: CityEntityProps) {
    super({ id })

    this.player_id = player_id
    this.name = name
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
    return new CityEntity({
      id: id(),
      player_id,
      name
    })
  }

  isOwnedBy(player_id: string): boolean {
    return this.player_id === player_id
  }
}
