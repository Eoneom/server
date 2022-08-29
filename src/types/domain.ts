
export abstract class BaseEntity {
  readonly id: string

  constructor({ id }: { id: string }) {
    this.id = id
  }
}
