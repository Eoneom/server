import React, { useMemo } from 'react'

import { BuildingListItem } from '#building/list/item'
import { BuildingTranslations } from '#building/translations'
import { Button } from '#ui/button'
import { CountdownProgress } from '#ui/countdown-progress'
import { List } from '#ui/list'
import { useCountdownProgress } from '#hook/countdown-progress'
import { useAppDispatch, useAppSelector } from '#store/type'
import { cancelBuildingUpgrade, finishBuildingUpgrade } from '#building/slice/thunk'
import { selectBuilding, selectBuildingInProgress, selectBuildings } from '#building/slice'

export const BuildingList: React.FC = () => {
  const dispatch = useAppDispatch()
  const inProgress = useAppSelector(selectBuildingInProgress)
  const building = useAppSelector(selectBuilding)
  const buildings = useAppSelector(selectBuildings)

  const { remainingSeconds, elapsedProgress, reset } = useCountdownProgress({
    onDone: () => dispatch(finishBuildingUpgrade()),
    endAt: inProgress?.upgrade_at,
    startAt: inProgress?.upgrade_started_at
  })

  const handleCancel = () => {
    dispatch(cancelBuildingUpgrade())
    reset()
  }

  const inProgressComponent = inProgress && <>
    <CountdownProgress
      summary={<>En cours: {BuildingTranslations[inProgress.code].name}</>}
      elapsedProgress={elapsedProgress}
      remainingSeconds={remainingSeconds}
    />
    <Button onClick={handleCancel}>Annuler</Button>
  </>

  const items = useMemo(() => buildings.map(buildingItem =>
    <BuildingListItem
      active={building?.code === buildingItem.code}
      key={buildingItem.id}
      buildingItem={buildingItem}
    />
  ), [building?.code, buildings])

  return <List
    inProgress={inProgressComponent}
    items={items}
  />
}
