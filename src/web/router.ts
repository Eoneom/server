import { Router } from 'express'
import { App } from '../core/app'
import { CityErrors } from '../core/city/domain/errors'
import { PlayerErrors } from '../core/player/domain/errors'

export const router = (app: App): Router => {
  const r = Router()

  r.get('/', (req, res) => {
    res.send('Hello world')
  })

  r.post('/sync', async (req, res) => {
    const token = req.body.token

    if (!token) {
      return res.status(400).json({ status: 'nok', error_code: 'token:not-found'})
    }

    const player = await app.player.queries.findOne({ name: token })
    if (!player) {
      return res.status(404).json({ status: 'nok', error_code: PlayerErrors.NOT_FOUND})
    }

    const city = await app.city.queries.findOne({ player_id: player.id })
    if (!city) {
      return res.status(404).json({ status: 'nok', error_code: CityErrors.NOT_FOUND})
    }

    const buildings = await app.building.queries.getBuildings({ city_id: city.id })
    const technologies = await app.technology.queries.getTechnologies({ player_id: player.id })

    return res.json({
      status: 'ok',
      player,
      city,
      buildings,
      technologies
    })
  })

  return r
}

