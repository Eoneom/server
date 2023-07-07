import { Router } from 'express'
import { App } from '../core/app'
import { CityErrors } from '../core/city/domain/errors'
import { PlayerErrors } from '../core/player/domain/errors'

export const router = (app: App): Router => {
  const r = Router()

  r.get('/', (req, res) => {
    res.send('Hello world')
  })

  r.post('/signup', async (req, res) => {
    const player_name = req.body.player_name
    if (!player_name) {
      return res.status(400).json({ status: 'nok', error_code: 'player_name:not-found'})
    }

    const city_name = req.body.city_name
    if (!city_name) {
      return res.status(400).json({ status: 'nok', error_code: 'city_name:not-found'})
    }

    const { player_id, city_id } = await app.commands.signup({ player_name, city_name })
    return res.status(200).send({
      status: 'ok',
      data: { player_id, city_id }
    })
  })

  r.post('/sync', async (req, res) => {
    const token = req.body.token

    if (!token) {
      return res.status(400).json({ status: 'nok', error_code: 'token:not-found'})
    }

    const player = await app.modules.player.queries.findOne({ name: token })
    if (!player) {
      return res.status(404).json({ status: 'nok', error_code: PlayerErrors.NOT_FOUND})
    }

    const city = await app.modules.city.queries.findOne({ player_id: player.id })
    if (!city) {
      return res.status(404).json({ status: 'nok', error_code: CityErrors.NOT_FOUND})
    }

    const buildings = await app.modules.building.queries.getBuildings({ city_id: city.id })
    const technologies = await app.modules.technology.queries.getTechnologies({ player_id: player.id })

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

