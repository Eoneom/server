import { ResourceStockRepository } from '#app/port/repository/resource-stock'
import {
  ResourceStockDocument,
  ResourceStockModel
} from '#adapter/repository/resource-stock/document'
import { MongoGenericRepository } from '#adapter/repository/generic'
import { ResourceStockEntity } from '#core/resources/resource-stock/entity'
import { ResourceStockError } from '#core/resources/resource-stock/error'
import { now } from '#shared/time'

export class MongoResourceStockRepository
  extends MongoGenericRepository<
    typeof ResourceStockModel,
    ResourceStockDocument,
    ResourceStockEntity
  >
  implements ResourceStockRepository {

  constructor() {
    super(ResourceStockModel, ResourceStockError.NOT_FOUND)
  }

  async getByCellId({ cell_id }: { cell_id: string }): Promise<ResourceStockEntity> {
    return this.findOneOrThrow({ cell_id })
  }

  async ensureWorldStockForCell({ cell_id }: { cell_id: string }): Promise<void> {
    const exists = await this.exists({ cell_id })
    if (exists) {
      return
    }
    const stock = ResourceStockEntity.initForWorldCell({
      cell_id,
      gather_at: now()
    })
    await this.create(stock)
  }

  protected buildFromModel(document: ResourceStockDocument): ResourceStockEntity {
    return ResourceStockEntity.create({
      id: document._id.toString(),
      cell_id: document.cell_id.toString(),
      plastic: document.plastic,
      mushroom: document.mushroom,
      last_plastic_gather: document.last_plastic_gather,
      last_mushroom_gather: document.last_mushroom_gather
    })
  }
}
