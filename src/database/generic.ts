import { AnyParamConstructor, BeAnObject, ReturnModelType } from '@typegoose/typegoose/lib/types'

import { BaseEntity } from '../types/domain'
import { FilterQuery } from '../types/database'
import { GenericRepository } from '../core/shared/repository'

export abstract class MongoGenericRepository<
  Model extends AnyParamConstructor<any>,
  Doc,
  Entity extends BaseEntity
  >
  implements GenericRepository<Entity> {

  private model: ReturnModelType<Model, BeAnObject>

  constructor(
    model: ReturnModelType<Model>
  ) {
    this.model = model
  }

  async exists(query: FilterQuery<Entity>): Promise<boolean> {
    const existing = await this.model.exists(query)
    return Boolean(existing)
  }

  async findById(id: string): Promise<Entity | null> {
    const document = await this.model.findById(id)
    return this.buildFromModel(document)
  }

  async findOne(query: FilterQuery<Entity>): Promise<Entity | null> {
    const document = await this.model.findOne(query)
    return this.buildFromModel(document)
  }

  async create(entity: Entity): Promise<string> {
    const document = await this.model.create(entity)
    return document._id.toString()
  }

  async updateOne(entity: Entity): Promise<void> {
    await this.model.updateOne({ id: entity.id }, entity)
  }

  protected abstract buildFromModel(document: Doc | null): Entity | null
}
