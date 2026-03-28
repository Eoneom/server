import React from 'react'

import { Building } from '#types'
import { Button } from '#ui/button'
import { hasEnoughResources } from '#city/helper'
import { useRequirement } from '#requirement/hook'
import { useAppDispatch, useAppSelector } from '#store/type'
import { selectCity } from '#city/slice'
import { upgradeBuilding } from '#building/slice/thunk'
import { selectBuildingInProgress, selectTotalBuildingsLevel } from '#building/slice'

interface Props {
  building: Building
}

export const BuildingDetailsUpgrade: React.FC<Props> = ({ building }) => {
  const dispatch = useAppDispatch()
  const inProgress = useAppSelector(selectBuildingInProgress)
  const levelsTotal = useAppSelector(selectTotalBuildingsLevel)
  const city = useAppSelector(selectCity)
  const { isRequirementMet } = useRequirement({ requirement: building.requirement })

  const canBuild = !inProgress &&
    levelsTotal < (city?.maximum_building_levels ?? 0) &&
    hasEnoughResources({ city, cost: building.upgrade_cost }) &&
    isRequirementMet

  return <Button
    disabled={!canBuild}
    onClick={() => dispatch(upgradeBuilding(building.code))}
  >
    Construire
  </Button>
}
