import React from 'react'

import { BuildingItem } from '#types'
import { BuildingTranslations } from '#building/translations'
import { ListItemLevel } from '#ui/list/item/level'
import { useAppDispatch } from '#store/type'
import { getBuilding } from '#building/slice/thunk'

interface Props {
  buildingItem: BuildingItem
  active: boolean
}

export const BuildingListItem: React.FC<Props> = ({ buildingItem, active }) => {
  const dispatch = useAppDispatch()
  const { name } = BuildingTranslations[buildingItem.code]

  return <ListItemLevel
    name={name}
    active={active}
    level={buildingItem.level}
    onSelect={() => dispatch(getBuilding(buildingItem.code))}
  />
}
