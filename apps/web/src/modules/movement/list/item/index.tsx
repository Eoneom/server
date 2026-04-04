import React from 'react'
import { NavLink } from 'react-router-dom'

import { formatCoordinates, formatTime } from '#helpers/transform'
import { useTimer } from '#hook/timer'
import { MovementActionLabels } from '#movement/translations'
import { MovementItem } from '#types'
import { getUrlPrefix } from '#helpers/url'
import { useLocation } from '#location/context'
import { useFinishMovement } from '#troop/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { reportKeys } from '#communication/report/hooks'

interface Props {
  movement: MovementItem
}

export const MovementListItem: React.FC<Props> = ({ movement }) => {
  const { cityId, outpostId } = useLocation()
  const finishMovement = useFinishMovement()
  const queryClient = useQueryClient()

  const { remainingTime } = useTimer({
    onDone: async () => {
      finishMovement.mutate()
      queryClient.invalidateQueries({ queryKey: reportKeys.unreadCount })
    },
    doneAt: movement.arrive_at
  })

  const urlPrefix = getUrlPrefix({ cityId, outpostId })
  const actionLabel = MovementActionLabels[movement.action]

  return (
    <li>
      <NavLink
        className="movement-active-item__link"
        to={`${urlPrefix}/movement/${movement.id}`}
      >
        <span className="movement-active-item__row movement-active-item__row--top">
          <span className="movement-active-item__action">{actionLabel}</span>
          <span className="movement-active-item__timer">{formatTime(remainingTime)}</span>
        </span>
        <span className="movement-active-item__route">
          <span className="movement-active-item__coord" title="Départ">
            {formatCoordinates(movement.origin)}
          </span>
          <span className="movement-active-item__arrow" aria-hidden>
            →
          </span>
          <span className="movement-active-item__coord" title="Arrivée">
            {formatCoordinates(movement.destination)}
          </span>
        </span>
      </NavLink>
    </li>
  )
}
