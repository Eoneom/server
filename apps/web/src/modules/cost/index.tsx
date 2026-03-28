import React from 'react'

import { formatTime, transformDecimals } from '#helpers/transform'
import { IconPlastic } from '#ui/icon/plastic'
import { IconMushroom } from '#ui/icon/mushroom'
import { ResourceItem } from '#ui/resource-item'
import { IconDuration } from '#ui/icon/duration'
import { useAppSelector } from '#store/type'
import { selectCity } from '#city/slice'

interface Props {
  plastic: number
  mushroom: number
  duration: number
  action?: React.ReactNode
}

export const Cost: React.FC<Props> = ({ plastic, mushroom, duration, action }) => {
  const city = useAppSelector(selectCity)
  const plasticClassName = plastic > (city?.plastic ?? 0) ? 'danger' : 'success'
  const mushroomClassName = mushroom > (city?.mushroom ?? 0) ? 'danger' : 'success'

  return <div>
    <h3>Coût</h3>
    <ul>
      <li>
        <ResourceItem
          className={plasticClassName}
          icon={<IconPlastic /> }
          value={transformDecimals(plastic)}
        />
      </li>
      <li>
        <ResourceItem className={mushroomClassName}
          icon={<IconMushroom />}
          value={transformDecimals(mushroom)}
        />
      </li>
      <li>
        <ResourceItem
          icon={<IconDuration />}
          value={formatTime(duration)}
        />
      </li>
    </ul>
    {action}
  </div>
}
