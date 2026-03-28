import { selectBuildings } from '#building/slice'
import { useAppSelector } from '#store/type'
import { selectTechnologies } from '#technology/slice'
import { BuildingItem, TechnologyItem } from '#types'
import { Requirement } from '@kroust/swarm-client'
import { useMemo } from 'react'

export const useRequirement = ({ requirement }: { requirement: Requirement }) => {
  const buildings = useAppSelector(selectBuildings)
  const technologies = useAppSelector(selectTechnologies)

  const isRequirementMet = useMemo(() => {
    return areRequirementsMet({ requirement, technologies, buildings })
  }, [requirement, technologies, buildings])

  return { isRequirementMet }
}

const areRequirementsMet = ({
  requirement,
  buildings,
  technologies
}: {
  requirement: Requirement
  buildings: BuildingItem[]
  technologies: TechnologyItem[]
}): boolean => {

  const buildingRequirementMet = requirement.buildings.every(
    r => buildings.some(({ code, level }) => r.code === code && level >= r.level)
  )
  const technologyRequirementMet = requirement.technologies.every(
    r => technologies.some(({ code, level }) => r.code === code && level >= r.level)
  )

  return buildingRequirementMet && technologyRequirementMet
}
