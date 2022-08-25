const STARTING_WOOD = 200
const WOOD_CAMP = 'wood_camp'

interface City {
  readonly name: string
  readonly wood: number
  readonly buildings: Record<string, Building>
  readonly last_gather: number
}

interface Building {
  readonly level: number
}

const wood_camp_gains_by_level_by_seconds: Record<number, number> = {
  1: 10,
  2: 20,
  3: 45,
  4: 70
}

const getSecondsSinceLastGather = (city: City): number => {
  const now_in_seconds = new Date().getTime()
  return Math.floor((now_in_seconds - city.last_gather) / 1000)
}

const gatherResources = (city: City): City => {
  const seconds_since_last_gather = getSecondsSinceLastGather(city)
  if (seconds_since_last_gather < 1) {
    return city
  }

  const wood_camp = city.buildings[WOOD_CAMP]
  const wood_gains = seconds_since_last_gather * wood_camp_gains_by_level_by_seconds[wood_camp.level]

  return {
    ...city,
    last_gather: new Date().getTime(),
    wood: city.wood + wood_gains
  }
}

const createCity = (name: string): City => ({
  name,
  buildings: {
    [WOOD_CAMP]: {
      level: 2
    }
  },
  wood: STARTING_WOOD,
  last_gather: new Date().getTime()
})

let city = createCity('Moustachiopolis')
setInterval(() => {
  city = gatherResources(city)
  console.log(city)
}, 1000)

export { }
