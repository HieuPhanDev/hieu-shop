import Navigation from './auth/Navigation'
import { Outlet } from 'react-router-dom'

const Default = () => {
  return (
    <div>
      <div className="fixed top-0 w-full h-24 z-50">
        <Navigation />
      </div>
      <div className="mt-28 mx-auto">
        <Outlet />
      </div>
    </div>
  )
}

export default Default
