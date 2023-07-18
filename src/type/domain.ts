export interface BaseEntityProps {
  id: string
}

export abstract class BaseEntity {
  readonly id: string

  constructor({ id }: BaseEntityProps) {
    this.id = id
  }
}
