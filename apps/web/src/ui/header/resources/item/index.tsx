import { transformApproximateTimeUntilSeconds, transformDailyEarnings, transformDecimals, transformHourlyEarnings } from '#helpers/transform'
import { ResourceItem } from '#ui/resource-item'
import { Tooltip } from '#ui/tooltip'
import React from 'react'

interface Props {
  value: number
  warehouse_capacity: number
  earnings_per_second: number
  warehouse_full_in_seconds: number
  icon: React.ReactNode
}

export const HeaderResourcesItem: React.FC<Props> = ({ value, warehouse_capacity, earnings_per_second, warehouse_full_in_seconds, icon }) => {
  const warnCapacity = 70/100
  const className = value >= warehouse_capacity ? 'danger' : ''
  const earningsPerHour = transformHourlyEarnings(earnings_per_second)
  const earningsPerDay = transformDailyEarnings(earnings_per_second)
  const storageLevel = Math.round(value / warehouse_capacity*100 * 100)/100
  const progressClassName = value >= warehouse_capacity * warnCapacity ? 'warn' : ''
  const tooltipContent = <>
    {earningsPerHour}<br />
    {earningsPerDay}
  </>
  const storageTooltipContent = <>
    {storageLevel}%<br />
    Max = {transformDecimals(warehouse_capacity)}
    {warehouse_full_in_seconds > 0 ? <>
      <br />
      Plein dans {transformApproximateTimeUntilSeconds(warehouse_full_in_seconds)}
    </> : null}
  </>

  return <li>
    <Tooltip content={tooltipContent} position='bottom'>
      <ResourceItem
        className={className}
        icon={icon}
        value={transformDecimals(value)}
      />
    </Tooltip>
    <Tooltip content={storageTooltipContent} position='bottom'>
      <progress
        className={progressClassName}
        value={value}
        max={warehouse_capacity}
      />
    </Tooltip>
  </li>
}
