import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

import { LayoutPage } from '#ui/layout/page'
import { TroopList } from '#troop/list'
import { TroopDetails } from '#troop/details'
import { useGetTroop } from '#troop/hooks'
import { Troop } from '#types'

export const TroopPage: React.FC = () => {
  const { cityId } = useParams()
  const [selectedTroopId, setSelectedTroopId] = useState<string | null>(null)
  const { data: troop } = useGetTroop(selectedTroopId)

  return <LayoutPage details={troop && <TroopDetails cityId={cityId ?? null} troop={troop as Troop} />}>
    <TroopList
      cityId={cityId ?? null}
      selectedTroopId={selectedTroopId}
      onSelect={setSelectedTroopId}
    />
  </LayoutPage>
}
