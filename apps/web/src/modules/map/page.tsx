import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { MapCanvas } from '#map/canvas'
import { MapDetails } from '#map/details'
import { useWorld } from '#map/hook/world'
import { useGetCity } from '#city/hooks'
import { useGetOutpost } from '#outpost/hooks'
import { useListTroops } from '#troop/hooks'
import { LayoutPage } from '#ui/layout/page'

export const MapPage: React.FC = () => {
  const { cityId, outpostId } = useParams()
  const { data: city } = useGetCity(cityId)
  const { data: outpost } = useGetOutpost(outpostId)
  useListTroops(cityId, outpostId)

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
    return <MapDetails coordinates={selectedCoordinates} sector={sector}/>
  }, [selectedCoordinates, sector])

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
