import { GenericCommand } from '#app/command/generic'

export type TroupMovementFinishCommand = GenericCommand<{ player_id: string, movement_id: string }, any, any>
