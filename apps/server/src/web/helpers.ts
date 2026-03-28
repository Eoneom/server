import { Response } from 'express'

export const getPlayerIdFromContext = (res: Response): string => {
  const player_id = res.locals.player_id
  if (!player_id) {
    throw new Error('player_id:not-in-context')
  }

  return player_id
}
