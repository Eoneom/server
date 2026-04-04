import React from 'react'
import { Outlet } from '@tanstack/react-router'
import { ToastContainer } from 'react-toastify'

import { AuthLoginForm } from '#auth/login-form'
import { Header } from '#ui/header'
import { NavMenu } from '#ui/nav/menu'
import { NavLocation } from '#ui/nav/location'
import { useAuth } from '#auth/context'
import { useInitStoredToken } from '#auth/hooks'
import { useListCities } from '#city/hooks'

const App: React.FC = () => {
  useInitStoredToken()

  const { token } = useAuth()
  const { data: citiesData } = useListCities()

  if (!token) {
    return <AuthLoginForm />
  }

  if (!citiesData?.cities.length) {
    return <>Loading</>
  }

  return <>
    <Header />
    <div id="main">
      <NavMenu />
      <main>
        <Outlet />
      </main>

      <NavLocation />
    </div>

    <ToastContainer
      position='bottom-right'
      autoClose={3000}
    />
  </>
}

export default App
