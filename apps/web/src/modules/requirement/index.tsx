import React from 'react'
import { RequirementBuilding } from '#requirement/building'
import { RequirementTechnology } from '#requirement/technology'
import { Requirement as RequirementValue } from '@eoneom/api-client'

interface Props {
  requirements?: RequirementValue
  building_levels_used?: number
  building_levels_capacity?: number
}

export const Requirement: React.FC<Props> = ({
  requirements,
  building_levels_used,
  building_levels_capacity,
}) => {
  const requirement_elements = [
    ...(requirements?.buildings ?? []).map(requirement => <RequirementBuilding
      key={requirement.code}
      requirement={requirement}
    />),
    ...(requirements?.technologies ?? []).map(requirement => <RequirementTechnology
      key={requirement.code}
      requirement={requirement}
    />)
  ]

  const requirement_display = requirement_elements.length ?
    <ul>{requirement_elements}</ul> :
    <span className='success'>Aucun</span>

  const has_building_levels =
    building_levels_used !== undefined &&
    building_levels_capacity !== undefined
  const building_levels_class =
    has_building_levels && building_levels_used >= building_levels_capacity
      ? 'danger'
      : 'success'

  return <div>
    <h3>Pré-requis</h3>
    {has_building_levels && (
      <p className={building_levels_class}>
        Niveaux de bâtiments (ville){' '}
        {building_levels_used} / {building_levels_capacity}
      </p>
    )}
    {requirement_display}
  </div>
}
