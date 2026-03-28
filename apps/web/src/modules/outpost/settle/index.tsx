import { useAppSelector } from '#store/type'
import { selectTroups } from '#troup/slice'
import { TroupCode } from '@kroust/swarm-client'
import React, { useMemo, useState } from 'react'

interface Props {
  onSettle: (cityName: string) => void
}

export const OutpostSettle: React.FC<Props> = ({ onSettle }) => {
  const [ cityName, setCityName ] = useState('')
  const troups = useAppSelector(selectTroups)
  const settler = useMemo(() => {
    return troups.find(troup => troup.code === TroupCode.SETTLER)
  }, [ troups ])

  const disabled = useMemo(() => {
    return (settler?.count ?? 0) === 0
  }, [ settler ])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!cityName) {
      return
    }

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
