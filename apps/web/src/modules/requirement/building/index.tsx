import { Requirement } from '@eoneom/api-client'
import React from 'react'
import { useParams } from 'react-router-dom'

import { BuildingTranslations } from '#building/translations'
import { useListBuildings } from '#building/hooks'

interface Props {
  requirement: Requirement['buildings'][number]
}

export const RequirementBuilding: React.FC<Props> = ({ requirement }) => {
  const { cityId } = useParams()
  const { data: buildings = [] } = useListBuildings(cityId)
  const requiredBuildingLevel = buildings.find(building => building.code === requirement.code)?.level ?? 0
  const isMetClassName = requiredBuildingLevel >= requirement.level ? 'success' : 'danger'

  return <li key={requirement.code} className={isMetClassName}>
    {BuildingTranslations[requirement.code].name} {requirement.level}
  </li>
}
