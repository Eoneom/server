import { FAKE_ID } from '#shared/identification'
import { GenericRepository } from '#shared/repository'
import { FilterQuery } from '#type/database'
import { BaseEntity } from '#type/domain'
import {
  AnyParamConstructor, BeAnObject, ReturnModelType 
} from '@typegoose/typegoose/lib/types'

export abstract class MongoGenericRepository<
  Model extends AnyParamConstructor<any>,
  Doc,
  Entity extends BaseEntity
> implements GenericRepository<Entity> {

  private model: ReturnModelType<Model, BeAnObject>
  private not_found_error: string

  constructor(model: ReturnModelType<Model>, not_found_error: string) {
    this.model = model
    this.not_found_error = not_found_error
  }

  async exists(query: FilterQuery<Entity>): Promise<boolean> {
    const existing = await this.model.exists(query)
    return Boolean(existing)
  }

  async find(query: FilterQuery<Entity>): Promise<Entity[]> {
    const documents = await this.model.find(query)
    return documents.map(document => this.buildFromModel(document))
  }

  async findById(id: string): Promise<Entity | null> {
    const document = await this.model.findById(id)
    if (!document) {
      return null
    }

    return this.buildFromModel(document)
  }

  async findByIdOrThrow(id: string): Promise<Entity> {
    const document = await this.findById(id)
    if (!document) {
      throw new Error(this.not_found_error)
    }

    return document
  }

  async findOne(query: FilterQuery<Entity>): Promise<Entity | null> {
    const document = await this.model.findOne(query)
    if (!document) {
      return null
    }

    return this.buildFromModel(document)
  }

  async findOneOrThrow(query: FilterQuery<Entity>): Promise<Entity> {
    const document = await this.findOne(query)
    if (!document) {
      throw new Error(this.not_found_error)
    }

    return document
  }

  async create(entity: Entity): Promise<string> {
    if (entity.id && entity.id !== FAKE_ID) {
      await this.model.updateOne({ _id: entity.id }, entity, { upsert: true })
      return entity.id
    }

    const document = await this.model.create(entity)
    return document._id.toString()
  }

  async updateOne(entity: Entity): Promise<void> {
    await this.model.updateOne({ _id: entity.id }, entity)
  }

  protected abstract buildFromModel(document: Doc): Entity
}
