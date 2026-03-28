import React, { useEffect } from 'react'

import { MovementListItem } from '#movement/list/item'
import { useAppDispatch, useAppSelector } from '#store/type'
import { selectMovements } from '#troup/slice'
import { listMovements } from '#troup/slice/thunk'

export const MovementList: React.FC = () => {
  const dispatch = useAppDispatch()
  const movements = useAppSelector(selectMovements)

  useEffect(() => {
    dispatch(listMovements())
  }, [])

  return <>
    <h2>En cours</h2>
    {
      movements.length ?
        <ul>
          {movements.map(movement => <MovementListItem key={movement.id} movement={movement}/>)}
        </ul>:
        <p>Pas de déplacement actuellement</p>
    }
  </>
}
