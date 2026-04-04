import React from 'react'
import { HeaderTitle } from '#ui/header/title'
import { HeaderResources } from '#ui/header/resources'
import { formatCoordinates } from '#helpers/transform'
import { useLocation } from '#location/context'
import { useGetCity } from '#city/hooks'
import { useGetOutpost } from '#outpost/hooks'

export const Header: React.FC = () => {
  const { cityId, outpostId } = useLocation()
  const { data: city } = useGetCity(cityId)
  const { data: outpost } = useGetOutpost(outpostId)

  const text = city ? city.name : outpost ? formatCoordinates(outpost.coordinates) : ''

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <h3>Eoneom</h3>
      </div>
      <div className="app-header__context">
        <HeaderTitle
          text={text}
          cityId={city?.id}
          outpostId={city ? undefined : outpost?.id}
        />
      </div>
      <div className="app-header__resources">
        <HeaderResources city={city ?? null} outpost={outpost ?? null} />
      </div>
    </header>
  )
}
