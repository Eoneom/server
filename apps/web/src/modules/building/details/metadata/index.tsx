import React from 'react'

import { isProductionBuilding, isWarehouseBuilding } from '@kroust/swarm-client'

import { Building } from '#types'

import { BuildingDetailsMetadataWarehouse } from '#building/details/metadata/warehouse'
import { BuildingDetailsMetadataProduction } from '#building/details/metadata/production'

interface Props {
  building: Building
}

export const BuildingDetailsMetadata: React.FC<Props> = ({ building }) => {
  if (isWarehouseBuilding(building)) {
    return <BuildingDetailsMetadataWarehouse
      currentCapacity={building.metadata.current_capacity}
      nextCapacity={building.metadata.next_capacity}
    />
  }

  if (isProductionBuilding(building)) {
    return <BuildingDetailsMetadataProduction
      currentProduction={building.metadata.current_production}
      nextProduction={building.metadata.next_production}
    />
  }

  return null
}
