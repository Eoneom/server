import React from 'react'
import { NavLink } from 'react-router-dom'

import { formatCoordinates, formatTime } from '#helpers/transform'
import { useTimer } from '#hook/timer'
import { MovementActionLabels } from '#movement/translations'
import { MovementItem } from '#types'
import { getUrlPrefix } from '#helpers/url'
import { useAppDispatch, useAppSelector } from '#store/type'
import { selectCityId } from '#city/slice'
import { countUnreadReports } from '#communication/report/slice/thunk'
import { selectOutpostId } from '#outpost/slice'
import { finishMovement } from '#troop/slice/thunk'

interface Props {
  movement: MovementItem
}

export const MovementListItem: React.FC<Props> = ({ movement }) => {
  const dispatch = useAppDispatch()
  const cityId = useAppSelector(selectCityId)
  const outpostId = useAppSelector(selectOutpostId)

  const { remainingTime } = useTimer({
    onDone: async () => {
      dispatch(finishMovement())

      dispatch(countUnreadReports())
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
