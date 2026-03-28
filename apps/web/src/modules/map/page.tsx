import React, { useEffect, useMemo, useState } from 'react'
import { MapCanvas } from '#map/canvas'
import { LayoutPage } from '#ui/layout/page'
import { MapDetails } from '#map/details'
import { useWorld } from '#map/hook/world'
import { useAppDispatch, useAppSelector } from '#store/type'
import { selectCityCoordinates } from '#city/slice'
import { selectOutpostCoordinates } from '#outpost/slice'
import { listTroups } from '#troup/slice/thunk'

export const MapPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const cityCoordinates = useAppSelector(selectCityCoordinates)
  const outpostCoordinates = useAppSelector(selectOutpostCoordinates)
  const { fetch, sector } = useWorld()
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ x: number, y: number} | null>(null)

  useEffect(() => {
    const sectorId = cityCoordinates ? cityCoordinates.sector : outpostCoordinates?.sector
    if (!sectorId) {
      return
    }

    dispatch(listTroups())
    fetch({ sectorId })
  }, [cityCoordinates, outpostCoordinates])

  const details = useMemo(() => {
    if (!selectedCoordinates || !sector) {
      return null
    }

    return <MapDetails coordinates={selectedCoordinates} sector={sector}/>
  }, [ selectedCoordinates, sector])

  return <LayoutPage details={details}>
    { sector && <MapCanvas onCellClicked={setSelectedCoordinates} sector={sector}/>}
  </LayoutPage>
}
