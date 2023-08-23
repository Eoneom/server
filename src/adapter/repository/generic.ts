import { FAKE_ID } from '#shared/identification'
import { GenericRepository } from '#app/port/repository/generic'
import { BaseEntity } from '#core/type/entity'
import {
  AnyParamConstructor, BeAnObject, ReturnModelType
} from '@typegoose/typegoose/lib/types'
import { mongoose } from '@typegoose/typegoose'
import { AppLogger } from '#app/port/logger'
import { Factory } from '#adapter/factory'

export abstract class MongoGenericRepository<
  Model extends AnyParamConstructor<any>,
  Doc,
  Entity extends BaseEntity
> implements GenericRepository<Entity> {
  protected logger: AppLogger
  protected model: ReturnModelType<Model, BeAnObject>
  private not_found_error: string

  protected constructor(model: ReturnModelType<Model>, not_found_error: string) {
    this.model = model
    this.not_found_error = not_found_error
    this.logger = Factory.getLogger('adapter:repository').child({ model: this.model.modelName })
  }

  async exists(query: mongoose.FilterQuery<Entity>): Promise<boolean> {
    this.logger.debug('exists:call', { query })
    const existing = await this.model.exists(query)
    this.logger.debug('exists:result', { existing: Boolean(existing) })
    return Boolean(existing)
  }

  async find(query: mongoose.FilterQuery<Entity>): Promise<Entity[]> {
    this.logger.debug('find:call', { query })
    const documents = await this.model.find(query)
    this.logger.debug('find:result', { documents_count: documents.length })
    return documents.map(document => this.buildFromModel(document))
  }

  async findById(id: string): Promise<Entity | null> {
    this.logger.debug('findById:call', { id })
    const document = await this.model.findById(id)
    if (!document) {
      this.logger.debug('findById:not-found', { id })
      return null
    }

    this.logger.debug('findById:found', { id })
    return this.buildFromModel(document)
  }

  async findByIdOrThrow(id: string): Promise<Entity> {
    const document = await this.findById(id)
    if (!document) {
      throw new Error(this.not_found_error)
    }

    return document
  }

  async findOne(query: mongoose.FilterQuery<Entity>): Promise<Entity | null> {
    this.logger.debug('findOne:call', { query })
    const document = await this.model.findOne(query)
    if (!document) {
      this.logger.debug('findOne:not-found', { query })
      return null
    }

    this.logger.debug('findOne:found', { query })
    return this.buildFromModel(document)
  }

  async findOneOrThrow(query: mongoose.FilterQuery<Entity>): Promise<Entity> {
    const document = await this.findOne(query)
    if (!document) {
      throw new Error(this.not_found_error)
    }

    return document
  }

  async create(entity: Entity): Promise<string> {
    if (entity.id && entity.id !== FAKE_ID) {
      this.logger.debug('create:updateOne', { id: entity.id })
      await this.model.updateOne({ _id: entity.id }, entity, { upsert: true })
      return entity.id
    }

    const document = await this.model.create(entity)
    this.logger.debug('create:created', { id: document._id })
    return document._id.toString()
  }

  async updateOne(entity: Entity): Promise<void> {
    this.logger.debug('updateOne', { id: entity.id })
    await this.model.updateOne({ _id: entity.id }, entity)
  }

  protected abstract buildFromModel(document: Doc): Entity
}
