const STARTING_WOOD = 200

interface City {
  readonly name: string
  readonly wood: number
}

const gatherResources = (city: City): City => {
  return {
    ...city,
    wood: city.wood + 100
  }
}

const createCity = (name: string): City => {
  return {
    name,
    wood: STARTING_WOOD
  }
}

let city = createCity('Moustachiopolis')
setInterval(() => {
  city = gatherResources(city)
  console.log(city)
}, 1000)

export { }