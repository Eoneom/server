import {
  REGION_SIZE, SECTOR_SIZE
} from '#core/world/constant/size'
import { CellEntity } from '#core/world/entity'
import { PerlinService } from '#core/world/perlin'
import { CellType } from '#core/world/value/cell-type'
import { Coordinates } from '#core/world/value/coordinates'
import { FAKE_ID } from '#shared/identification'

export class WorldService {
  static generate () {
    const mushroom_perlin_service = new PerlinService()
    const plastic_perlin_service = new PerlinService()
    const world: CellEntity[] = []

    for (let sector_y = 1; sector_y <= REGION_SIZE ; sector_y++) {
      for (let sector_x = 1; sector_x <= REGION_SIZE ; sector_x++) {
        const sector_cells = this.generateSector({
          mushroom_perlin_service,
          plastic_perlin_service,
          sector_x,
          sector_y
        })

        world.push(...sector_cells)
      }
    }

    return world
  }

  static getRandomCoordinates(): Coordinates {
    const random_x = Math.floor(Math.random() * SECTOR_SIZE - 1) + 1
    const random_y = Math.floor(Math.random() * SECTOR_SIZE - 1) + 1
    const random_sector = Math.floor(Math.random() * REGION_SIZE * REGION_SIZE - 1) + 1

    return {
      x: random_x,
      y: random_y,
      sector: random_sector
    }
  }

  private static generateSector({
    mushroom_perlin_service,
    plastic_perlin_service,
    sector_x,
    sector_y
  }: {
    mushroom_perlin_service: PerlinService
    plastic_perlin_service: PerlinService
    sector_x: number
    sector_y: number
  }): CellEntity[] {
    const sector_id = sector_x + SECTOR_SIZE*(sector_y - 1)
    const sector: CellEntity[] = []

    for (let x = 1 ; x <= SECTOR_SIZE ; x++) {
      for (let y = 1 ; y <= SECTOR_SIZE ; y++) {
        const mushroom_coefficient = this.getCoefficient({
          perlin: mushroom_perlin_service,
          x,
          y,
          sector_x,
          sector_y
        })

        const plastic_coefficient = this.getCoefficient({
          perlin: plastic_perlin_service,
          x,
          y,
          sector_x,
          sector_y
        })

        const type = this.getType({
          mushroom_coefficient,
          plastic_coefficient
        })

        sector.push(CellEntity.create({
          id: FAKE_ID,
          coordinates: {
            x,
            y,
            sector: sector_id
          },
          type,
          resource_coefficient: {
            plastic: plastic_coefficient,
            mushroom: mushroom_coefficient
          }
        }))
      }
    }

    return sector
  }

  private static getType({
    mushroom_coefficient,
    plastic_coefficient
  }: {
    mushroom_coefficient: number
    plastic_coefficient: number
  }): CellType {
    const threshold = 0.075

    if (plastic_coefficient > mushroom_coefficient && plastic_coefficient - mushroom_coefficient > threshold) {
      return CellType.RUINS
    } else if (mushroom_coefficient > plastic_coefficient && mushroom_coefficient - plastic_coefficient > threshold) {
      return CellType.FOREST
    }

    return CellType.LAKE
  }

  private static getCoefficient({
    perlin,
    x,
    y,
    sector_x,
    sector_y
  }: {
    perlin: PerlinService
    x: number
    y: number
    sector_x: number
    sector_y: number
  }) {
    const perlin_x = this.getPerlinCoordinate(x, sector_x)
    const perlin_y = this.getPerlinCoordinate(y, sector_y)

    const intensity = perlin.get(perlin_x, perlin_y)
    const fixed_interval_intensity = this.fixInterval(intensity)
    return this.roundCoefficient(fixed_interval_intensity)
  }

  private static roundCoefficient(coefficient: number): number {
    return Math.round(coefficient * 1000) / 1000
  }

  private static getPerlinCoordinate(coordinate: number, sector_coordinate: number): number {
    const ratio = 4/64
    return (coordinate + SECTOR_SIZE*(sector_coordinate - 1)) * ratio
  }

  private static fixInterval(intensity: number): number {
    return (((intensity + 1)*1.5)+1)/2
  }
}