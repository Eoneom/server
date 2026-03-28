import { selectToken } from '#auth/slice'
import { login } from '#auth/slice/thunk'
import { useAppDispatch, useAppSelector } from '#store/type'
import React, { FormEvent, useState } from 'react'
import { toast } from 'react-toastify'

export const AuthLoginForm: React.FC = () => {
  const [playerName, setPlayerName] = useState('')
  const token = useAppSelector(selectToken)
  const dispatch = useAppDispatch()

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.stopPropagation()
    event.preventDefault()

    if (!playerName) {
      toast.error('Le nom est requis pour se connecter')
      return
    }

    dispatch(login(playerName))
  }

  if (token) {
    return null
  }

  return <form onSubmit={onSubmit}>
    <input type="text" placeholder="Nom" onChange={event => setPlayerName(event.target.value)} />
    <input type="submit" value="Se connecter" />
  </form>
}
