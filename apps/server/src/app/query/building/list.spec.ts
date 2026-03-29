import { BuildingListQuery } from '#app/query/building/list'
import type { BuildingListEntry } from '@eoneom/api-client/src/endpoints/building/list'
import { Factory } from '#adapter/factory'
import { Repository } from '#app/port/repository/generic'
import { BuildingEntity } from '#core/building/entity'
import { BuildingCode } from '#core/building/constant/code'
import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'
import { TechnologyCode } from '#core/technology/constant/code'
import { TechnologyEntity } from '#core/technology/entity'

describe('BuildingListQuery', () => {
  const player_id = 'player_id'
  let city: CityEntity
  let architecture: TechnologyEntity
  let b_idle: BuildingEntity
  let b_upgrade: BuildingEntity
  let repository: Pick<Repository, 'city' | 'building' | 'technology'>

  beforeEach(() => {
    city = CityEntity.create({
      ...CityEntity.initCity({
        name: 'c',
        player_id 
      }),
      plastic: 0,
      mushroom: 0
    })
    architecture = TechnologyEntity.create({
      id: 't1',
      player_id,
      code: TechnologyCode.ARCHITECTURE,
      level: 1
    })
    b_idle = BuildingEntity.create({
      id: 'b1',
      city_id: city.id,
      code: BuildingCode.RESEARCH_LAB,
      level: 1
    })
    b_upgrade = BuildingEntity.create({
      id: 'b2',
      city_id: city.id,
      code: BuildingCode.CLONING_FACTORY,
      level: 0,
      upgrade_at: 10_000
    })

    repository = {
      city: { get: jest.fn().mockResolvedValue(city) } as unknown as Repository['city'],
      building: {
        list: jest.fn().mockResolvedValue([
          b_upgrade,
          b_idle 
        ]) 
      } as unknown as Repository['building'],
      technology: { get: jest.fn().mockResolvedValue(architecture) } as unknown as Repository['technology']
    }
    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('throws when city is not owned by player', async () => {
    const other = CityEntity.create({
      ...CityEntity.initCity({
        name: 'x',
        player_id: 'other' 
      }),
      plastic: 0,
      mushroom: 0
    })
    ;(repository.city.get as jest.Mock).mockResolvedValue(other)

    await expect(new BuildingListQuery().run({
      city_id: other.id,
      player_id 
    })).rejects.toThrow(CityError.NOT_OWNER)
  })

  it('returns sorted buildings with upgrade fields when upgrade in progress', async () => {
    const result = await new BuildingListQuery().run({
      city_id: city.id,
      player_id 
    })

    expect(result.buildings).toHaveLength(2)
    const upgrading = result.buildings.find(
      (b): b is Extract<BuildingListEntry, { upgrade_at: number }> =>
        b.id === b_upgrade.id && 'upgrade_at' in b
    )
    expect(upgrading).toBeDefined()
    expect(upgrading!.upgrade_at).toBe(10_000)
    expect(upgrading!.upgrade_started_at).toBeDefined()
    const idle = result.buildings.find(b => b.id === b_idle.id)
    expect(idle).toBeDefined()
    expect(idle && !('upgrade_at' in idle)).toBe(true)
  })
})
