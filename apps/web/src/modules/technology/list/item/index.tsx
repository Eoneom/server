import React from 'react'
import { TechnologyItem } from '#types'
import { TechnologyTranslations } from '#technology/translations'
import { ListItemLevel } from '#ui/list/item/level'
import { useAppDispatch } from '#store/type'
import { getTechnology } from '#technology/slice/thunk'

interface Props {
  active: boolean
  technologyItem: TechnologyItem
}

export const TechnologyListItem: React.FC<Props> = ({ active, technologyItem }) => {
  const dispatch = useAppDispatch()

  const { name } = TechnologyTranslations[technologyItem.code]

  return <ListItemLevel
    active={active}
    name={name}
    level={technologyItem.level}
    onSelect={() => dispatch(getTechnology(technologyItem.code))}
  />
}
