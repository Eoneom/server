import React, { useMemo } from 'react'
import { TroopListItem } from '#troop/list/item'
import { TroopListInProgress } from '#troop/list/in-progress'
import { List } from '#ui/list'
import { useAppSelector } from '#store/type'
import { selectTroop, selectTroops } from '#troop/slice'

export const TroopList: React.FC = () => {
  const troops = useAppSelector(selectTroops)
  const selectedTroop = useAppSelector(selectTroop)

  const items = useMemo(() => {
    return troops.map(troop => <TroopListItem
      active={selectedTroop?.code === troop.code}
      key={troop.id}
      troop={troop}
    />)
  }, [selectedTroop?.code, troops])

  return <List
    inProgress={<TroopListInProgress />}
    items={items}
  />
}
