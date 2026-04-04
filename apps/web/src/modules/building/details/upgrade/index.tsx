import React from 'react'
import { useParams } from 'react-router-dom'

import { Building, BuildingItem } from '#types'
import { Button } from '#ui/button'
import { hasEnoughResources } from '#city/helper'
import { useRequirement } from '#requirement/hook'
import { useGetCity } from '#city/hooks'
import { useListBuildings, useUpgradeBuilding } from '#building/hooks'

interface Props {
  building: Building
}

export const BuildingDetailsUpgrade: React.FC<Props> = ({ building }) => {
  const { cityId } = useParams()
  const { data: city } = useGetCity(cityId)
  const { data: buildings = [] } = useListBuildings(cityId)
  const upgrade = useUpgradeBuilding(cityId)
  const { isRequirementMet } = useRequirement({ requirement: building.requirement })

  const inProgress = buildings.find(
    (b): b is Extract<BuildingItem, { upgrade_at: number }> => 'upgrade_at' in b
  )

  const canBuild = !inProgress &&
    city != null &&
    city.building_levels_used < city.maximum_building_levels &&
    hasEnoughResources({ city, cost: building.upgrade_cost }) &&
    isRequirementMet

  return <Button
    disabled={!canBuild}
    onClick={() => upgrade.mutate(building.code)}
  >
    Construire
  </Button>
}
