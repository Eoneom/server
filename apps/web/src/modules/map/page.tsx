import React, { useMemo, useState } from 'react'

import { MapCanvas } from '#map/canvas'
import { MapDetails } from '#map/details'
import { useWorld } from '#map/hook/world'
import { useGetCity } from '#city/hooks'
import { useGetOutpost } from '#outpost/hooks'
import { useListTroops } from '#troop/hooks'
import { LayoutPage } from '#ui/layout/page'

type MapPageProps =
  | { cityId: string; outpostId?: never }
  | { cityId?: never; outpostId: string }

export const MapPage: React.FC<MapPageProps> = ({ cityId, outpostId }) => {
  const { data: city } = useGetCity(cityId)
  const { data: outpost } = useGetOutpost(outpostId)
  useListTroops(cityId ? { cityId } : { outpostId: outpostId as string })

  const cityCoordinates = city?.coordinates ?? null
  const outpostCoordinates = outpost?.coordinates ?? null

  const { fetch, sector } = useWorld()
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ x: number, y: number} | null>(null)

  React.useEffect(() => {
    const sectorId = cityCoordinates ? cityCoordinates.sector : outpostCoordinates?.sector
    if (!sectorId) return
    fetch({ sectorId })
  }, [cityCoordinates, outpostCoordinates])

  const details = useMemo(() => {
    if (!selectedCoordinates || !sector) return null
    if (cityId) {
      return <MapDetails cityId={cityId} coordinates={selectedCoordinates} sector={sector} />
    }
    if (!outpostId) {
      return null
    }
    return <MapDetails outpostId={outpostId} coordinates={selectedCoordinates} sector={sector} />
  }, [cityId, outpostId, selectedCoordinates, sector])

  return <LayoutPage details={details}>
    {sector && (
      <div className="map-page">
        <MapCanvas
          sector={sector}
          onCellClicked={setSelectedCoordinates}
          selectedCoordinates={selectedCoordinates}
          cityMarker={city?.coordinates ?? null}
          outpostMarker={outpostCoordinates ?? null}
        />
      </div>
    )}
  </LayoutPage>
}
