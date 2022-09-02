import { App } from './core/app'
import { BuildingCode } from './core/building/domain/constants'
import { BuildingEventCode } from './core/building/domain/events'
import { CityEventCode } from './core/city/domain/events'
import { EventBus } from './core/eventbus'
import { Factory } from './core/factory'
import { PlayerEventCode } from './core/player/domain/events'
import { TechnologyCode } from './core/technology/domain/constants'
import { TechnologyEventCode } from './core/technology/domain/events'
import { init_costs } from './core/migrations/init_costs'
import { now } from './core/shared/time'
import repl from 'repl'

const randomString = (): string => {
  const inOptions: string = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let outString: string = ''

  for (let i = 0; i < 10; i++) {
    outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length))
  }

  return outString
}

const init = async (app: App): Promise<void> => {
  const existing_costs = await app.pricing.queries.doesLevelCostsExists()
  if (!existing_costs) {
    console.log('initializing level costs...')
    await init_costs(app)
    console.log('done')
  }

  try {
    console.log('initialiazing player and city...')
    await app.player.commands.init({ name: randomString(), first_city_name: randomString() })
  } catch (err) {
    console.log(err)
  }
}

const log_events = (eventbus: EventBus) => {
  const event_codes = [
    ...Object.values(CityEventCode).filter(value => value !== CityEventCode.RESOURCES_GATHERED),
    ...Object.values(BuildingEventCode)
  ]

  event_codes.forEach((event_code) => {
    eventbus.listen(
      event_code,
      (payload) => console.log(event_code, payload)
    )
  })
}

const launch_app = ({
  player_id,
  city_id,
  app,
  eventbus
}: {
  player_id: string
  city_id: string
  app: App
  eventbus: EventBus
}) => {
  setInterval(async () => {
    await app.building.commands.finishUpgradeIfAny({ city_id })
    await app.technology.commands.finishResearches({ player_id })
    await app.city.commands.gatherResources({ id: city_id, gather_at_time: now() })
  }, 1000)

  const local = repl.start('> ')
  local.context.g = {
    city: () => app.city.queries.findByIdOrThrow(city_id).then(console.log),
    researchBuilding: () => {
      eventbus.emit(TechnologyEventCode.REQUEST_RESEARCH_TRIGGERED, {
        code: TechnologyCode.BUILDING,
        city_id,
        player_id
      })
    },
    upgradeRecyclingPlant: () => {
      eventbus.emit(BuildingEventCode.REQUEST_UPGRADE_TRIGGERED, {
        code: BuildingCode.RECYCLING_PLANT,
        city_id
      })
    },
    upgradeMushroomFarm: () => {
      eventbus.emit(BuildingEventCode.REQUEST_UPGRADE_TRIGGERED, {
        code: BuildingCode.MUSHROOM_FARM,
        city_id
      })
    },
    upgradeResearchLab: () => {
      eventbus.emit(BuildingEventCode.REQUEST_UPGRADE_TRIGGERED, {
        code: BuildingCode.RESEARCH_LAB,
        city_id
      })
    },
    buildings: () => {
      app.building.queries.getBuildings({ city_id }).then(console.log)
    }
  }
}

(async () => {
  const repository = Factory.getRepository()
  await repository.connect()

  const app = new App()
  const eventbus = Factory.getEventBus()

  log_events(eventbus)

  let city_id: string | null = null
  let player_id: string | null = null
  eventbus.listen(PlayerEventCode.CREATED, payload => player_id = payload.player_id)
  eventbus.listen(BuildingEventCode.FIRST_INITIALIZED, payload => city_id = payload.city_id)

  await init(app)

  const timer = setInterval(() => {
    if (player_id && city_id) {
      launch_app({ player_id, city_id, app, eventbus })
      clearInterval(timer)
    }
  }, 100)
})()

export { }
