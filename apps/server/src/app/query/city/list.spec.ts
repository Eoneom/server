import { CityListQuery } from '#app/query/city/list'
import { Factory } from '#adapter/factory'
import { Repository } from '#app/port/repository/generic'
import { CityEntity } from '#core/city/entity'

describe('CityListQuery', () => {
  const player_id = 'player_id'
  let cities: CityEntity[]
  let repository: Pick<Repository, 'city'>

  beforeEach(() => {
    cities = [
      CityEntity.create({
        ...CityEntity.initCity({
          name: 'a',
          player_id 
        }),
        plastic: 0,
        mushroom: 0
      })
    ]
    repository = { city: { list: jest.fn().mockResolvedValue(cities) } as unknown as Repository['city'] }
    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns cities from repository', async () => {
    const result = await new CityListQuery().run({ player_id })

    expect(result.cities).toBe(cities)
    expect(repository.city.list).toHaveBeenCalledWith({ player_id })
  })
})
