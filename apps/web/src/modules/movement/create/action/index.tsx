import { MovementAction } from '@kroust/swarm-client'
import React from 'react'

interface Props {
  action: MovementAction
  onChange: (action: MovementAction) => void
}

export const MovementCreateAction: React.FC<Props> = ({ action, onChange }) => {
  return <div>
    <h3>Ordre</h3>
    {
      Object.values(MovementAction).sort((a, b) => a.localeCompare(b)).map(movementAction => (
        <div key={movementAction}>
          <input

            type="radio"
            name="action"
            value={movementAction}
            id={movementAction}
            checked={action === movementAction}
            onChange={(event) => onChange(event.target.value as MovementAction)}
          />
          <label htmlFor={movementAction}>{movementAction}</label>
        </div>
      ))
    }
  </div>
}
