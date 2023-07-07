import { App } from '../app'
import { init_costs } from './init_costs'


export const initData = async (app: App): Promise<void> => {
  const existing_costs = await app.modules.pricing.queries.doesLevelCostsExists()
  if (!existing_costs) {
    console.log('initializing level costs...')
    await init_costs(app)
    console.log('done')
  }
}
