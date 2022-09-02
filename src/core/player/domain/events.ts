export enum PlayerEventCode {
  CREATED = 'player:created',
}

export interface PlayerPayloads {
  [PlayerEventCode.CREATED]: {
    player_id: string
  },
}
