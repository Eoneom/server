import React, { useEffect, useMemo, useState } from 'react'
import { MapCanvas } from '#map/canvas'
import { MapDetails } from '#map/details'
import { useWorld } from '#map/hook/world'
import { useAppDispatch, useAppSelector } from '#store/type'
import { selectCity, selectCityCoordinates } from '#city/slice'
import { selectOutpostCoordinates } from '#outpost/slice'
import { listTroops } from '#troop/slice/thunk'
import { LayoutPage } from '#ui/layout/page'

export const MapPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const city = useAppSelector(selectCity)
  const cityCoordinates = useAppSelector(selectCityCoordinates)
  const outpostCoordinates = useAppSelector(selectOutpostCoordinates)
  const { fetch, sector } = useWorld()
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ x: number, y: number} | null>(null)

  useEffect(() => {
    const sectorId = cityCoordinates ? cityCoordinates.sector : outpostCoordinates?.sector
    if (!sectorId) {
      return
    }

    dispatch(listTroops())
    fetch({ sectorId })
  }, [cityCoordinates, outpostCoordinates])

  const details = useMemo(() => {
    if (!selectedCoordinates || !sector) {
      return null
    }

    return <MapDetails coordinates={selectedCoordinates} sector={sector}/>
  }, [ selectedCoordinates, sector])

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
