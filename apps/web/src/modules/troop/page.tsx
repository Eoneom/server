import React, { useState } from 'react'

import { LayoutPage } from '#ui/layout/page'
import { TroopList } from '#troop/list'
import { TroopDetails } from '#troop/details'
import { useGetTroop } from '#troop/hooks'
import { Troop } from '#types'

type TroopPageProps = {
  cityId: string
}

export const TroopPage: React.FC<TroopPageProps> = ({ cityId }) => {
  const [selectedTroopId, setSelectedTroopId] = useState<string | null>(null)
  const { data: troop } = useGetTroop(selectedTroopId)

  return <LayoutPage details={troop && <TroopDetails cityId={cityId} troop={troop as Troop} />}>
    <TroopList
      cityId={cityId}
      selectedTroopId={selectedTroopId}
      onSelect={setSelectedTroopId}
    />
  </LayoutPage>
}
