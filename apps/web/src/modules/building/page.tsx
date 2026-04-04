import React, { useState } from 'react'
import { BuildingCode } from '@eoneom/api-client'

import { BuildingList } from '#building/list'
import { BuildingDetails } from '#building/details'
import { LayoutPage } from '#ui/layout/page'
import { useGetBuilding } from '#building/hooks'
import { Building } from '#types'

type BuildingPageProps = {
  cityId: string
}

export const BuildingPage: React.FC<BuildingPageProps> = ({ cityId }) => {
  const [selectedCode, setSelectedCode] = useState<BuildingCode | null>(null)
  const { data: building } = useGetBuilding(cityId, selectedCode)

  return <LayoutPage details={building && <BuildingDetails cityId={cityId} building={building as Building} />}>
    <BuildingList
      cityId={cityId}
      selectedCode={selectedCode}
      onSelect={setSelectedCode}
    />
  </LayoutPage>
}
