import React from 'react'
import { HeaderTitle } from '#ui/header/title'
import { HeaderResources } from '#ui/header/resources'
import { formatCoordinates } from '#helpers/transform'
import { useAppSelector } from '#store/type'
import { selectCity } from '#city/slice'
import { selectOutpost } from '#outpost/slice'

export const Header: React.FC = () => {
  const city = useAppSelector(selectCity)
  const outpost = useAppSelector(selectOutpost)
  const text = city ? city.name : outpost ? formatCoordinates(outpost.coordinates) : ''
  const to = city ? `/city/${city.id}` : `/outpost/${outpost?.id}`

  return <header>
    <h3>Eoneom</h3>
    <HeaderTitle to={to} text={text} />
    <HeaderResources city={city} />
  </header>
}
