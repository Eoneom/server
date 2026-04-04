import { TroopCode } from '@eoneom/api-client'
import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useListOutpostTroops } from '#troop/hooks'

interface Props {
  onSettle: (cityName: string) => void
}

export const OutpostSettle: React.FC<Props> = ({ onSettle }) => {
  const { outpostId } = useParams()
  const [cityName, setCityName] = useState('')
  const { data: troops = [] } = useListOutpostTroops(outpostId)

  const settler = useMemo(() => {
    return troops.find(troop => troop.code === TroopCode.SETTLER)
  }, [troops])

  const disabled = useMemo(() => {
    return (settler?.count ?? 0) === 0
  }, [settler])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!cityName) return
    onSettle(cityName)
  }

  const handleCityNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCityName(event.target.value)
  }

  return <form onSubmit={handleSubmit}>
    <input
      type="text"
      disabled={disabled}
      value={cityName}
      onChange={handleCityNameChange}
    />
    <input
      disabled={disabled}
      type="submit"
      value="Coloniser"
    />
  </form>
}
