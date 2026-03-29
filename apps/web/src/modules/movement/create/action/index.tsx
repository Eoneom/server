import { MovementAction } from '@eoneom/api-client'
import React from 'react'

import { MovementActionLabels } from '#movement/translations'

interface Props {
  action: MovementAction
  onChange: (action: MovementAction) => void
}

export const MovementCreateAction: React.FC<Props> = ({ action, onChange }) => {
  return (
    <fieldset className="movement-fieldset">
      <legend className="movement-fieldset__legend">Ordre</legend>
      <div className="movement-action-radios" role="radiogroup" aria-label="Type de déplacement">
        {Object.values(MovementAction)
          .sort((a, b) => a.localeCompare(b))
          .map(movementAction => {
            const id = `movement-action-${movementAction}`
            return (
              <label
                key={movementAction}
                className={
                  action === movementAction
                    ? 'movement-action-option movement-action-option--checked'
                    : 'movement-action-option'
                }
                htmlFor={id}
              >
                <input
                  id={id}
                  type="radio"
                  name="action"
                  value={movementAction}
                  checked={action === movementAction}
                  onChange={event => onChange(event.target.value as MovementAction)}
                />
                <span className="movement-action-option__label">
                  {MovementActionLabels[movementAction]}
                </span>
              </label>
            )
          })}
      </div>
    </fieldset>
  )
}
