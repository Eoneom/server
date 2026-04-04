import { Requirement } from '@eoneom/api-client'
import React, { useMemo } from 'react'

import { TechnologyTranslations } from '#technology/translations'
import { useListTechnologies } from '#technology/hooks'

interface Props {
  requirement: Requirement['technologies'][number]
}

export const RequirementTechnology: React.FC<Props> = ({ requirement }) => {
  const { data: technologies = [] } = useListTechnologies()

  const requiredTechnologyLevel = useMemo(() => {
    return technologies.find(technology => technology.code === requirement.code)?.level ?? 0
  }, [technologies, requirement.code])

  const isMetClassName = requiredTechnologyLevel >= requirement.level ? 'success' : 'danger'

  return <li key={requirement.code} className={isMetClassName}>
    {TechnologyTranslations[requirement.code].name} {requirement.level}
  </li>
}
