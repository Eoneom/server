import React from 'react'

import { Building } from '#types'
import { BuildingTranslations } from '#building/translations'
import { Requirement } from '#requirement/index'
import { LayoutDetailsContent } from '#ui/layout/details/content'
import { Cost } from '#cost/index'
import { BuildingDetailsMetadata } from '#building/details/metadata'
import { BuildingDetailsUpgrade } from '#building/details/upgrade'
import { useGetCity } from '#city/hooks'

interface Props {
  cityId: string
  building: Building
}

export const BuildingDetails: React.FC<Props> = ({ cityId, building }) => {
  const { data: city } = useGetCity(cityId)
  const { name, description, effect } = BuildingTranslations[building.code]

  return <>
    <LayoutDetailsContent>
      <h2>{name}</h2>
      <p>{effect}</p>
      <BuildingDetailsUpgrade cityId={cityId} building={building} />
      <BuildingDetailsMetadata building={building} />
      <p className='description'>{description}</p>
    </LayoutDetailsContent>

    <aside id="requirement">
      <Requirement
        cityId={cityId}
        requirements={building.requirement}
        building_levels_used={city?.building_levels_used}
        building_levels_capacity={city?.maximum_building_levels}
      />
      <Cost cityId={cityId} {...building.upgrade_cost} />
    </aside>
  </>
}
