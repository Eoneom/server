import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { BuildingCode } from '@eoneom/api-client'

import { BuildingList } from '#building/list'
import { BuildingDetails } from '#building/details'
import { LayoutPage } from '#ui/layout/page'
import { useGetBuilding } from '#building/hooks'
import { Building } from '#types'

export const BuildingPage: React.FC = () => {
  const { cityId } = useParams()
  const [selectedCode, setSelectedCode] = useState<BuildingCode | null>(null)
  const { data: building } = useGetBuilding(cityId, selectedCode)

  return <LayoutPage details={building && <BuildingDetails building={building as Building} />}>
    <BuildingList
      cityId={cityId ?? null}
      selectedCode={selectedCode}
      onSelect={setSelectedCode}
    />
  </LayoutPage>
}
