import { transformApproximateTimeUntilSeconds, transformDailyEarnings, transformDecimals, transformHourlyEarnings } from '#helpers/transform'
import { ResourceItem } from '#ui/resource-item'
import { Tooltip } from '#ui/tooltip'
import React from 'react'

interface Props {
  value: number
  icon: React.ReactNode
  warehouse_capacity?: number
  earnings_per_second?: number
  warehouse_full_in_seconds?: number
}

export const HeaderResourcesItem: React.FC<Props> = ({ value, warehouse_capacity, earnings_per_second, warehouse_full_in_seconds, icon }) => {
  const warnCapacity = 70/100
  const className = warehouse_capacity !== undefined && value >= warehouse_capacity ? 'danger' : ''

  const resourceItem = <ResourceItem
    className={className}
    icon={icon}
    value={transformDecimals(value)}
  />

  const hasWarehouse = warehouse_capacity !== undefined
  const hasEarnings = earnings_per_second !== undefined

  const earningsTooltipContent = hasEarnings ? <>
    {transformHourlyEarnings(earnings_per_second)}<br />
    {transformDailyEarnings(earnings_per_second)}
  </> : null

  const storageLevel = hasWarehouse ? Math.round(value / warehouse_capacity * 100 * 100) / 100 : 0
  const progressClassName = hasWarehouse && value >= warehouse_capacity * warnCapacity ? 'warn' : ''
  const storageTooltipContent = hasWarehouse ? <>
    {storageLevel}%<br />
    Max = {transformDecimals(warehouse_capacity)}
    {warehouse_full_in_seconds !== undefined && warehouse_full_in_seconds > 0 ? <>
      <br />
      Plein dans {transformApproximateTimeUntilSeconds(warehouse_full_in_seconds)}
    </> : null}
  </> : null

  return <li>
    {earningsTooltipContent
      ? <Tooltip content={earningsTooltipContent} position='bottom'>{resourceItem}</Tooltip>
      : resourceItem
    }
    {hasWarehouse && storageTooltipContent && (
      <Tooltip content={storageTooltipContent} position='bottom'>
        <progress
          className={progressClassName}
          value={value}
          max={warehouse_capacity}
        />
      </Tooltip>
    )}
  </li>
}
