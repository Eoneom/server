import { createCity, gatherResources } from './cities/commands'

let city = createCity('Moustachiopolis')
setInterval(() => {
  city = gatherResources(city)
  console.log(city)
}, 1000)

export { }
