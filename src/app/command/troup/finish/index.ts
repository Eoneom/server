import { GenericCommand } from '#app/command/generic'

export type TroupFinishMovementCommand = GenericCommand<{ player_id: string, movement_id: string }, any, any>
