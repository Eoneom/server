import cron from 'node-cron'
import { cronSync } from '#cron/sync'

export const sync_task = cron.schedule('0 * * * *', async () => {
  await cronSync()
}, { scheduled: false })

