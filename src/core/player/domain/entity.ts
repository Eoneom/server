import { BaseEntity } from '../../../type/domain'

export type PlayerEntityProps = BaseEntity & {
  name: string
}

export class PlayerEntity extends BaseEntity {
  readonly name: string

  private constructor({
    id,
    name
  }: PlayerEntityProps) {
    super({ id })

    this.name = name
  }

  static create(props: PlayerEntityProps): PlayerEntity {
    return new PlayerEntity(props)
  }

  static initPlayer({ name }: { name: string }): PlayerEntity {
    return new PlayerEntity({
      id: 'fake',
      name
    })
  }
}
