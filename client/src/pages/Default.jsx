import Navigation from './auth/Navigation'
import { Outlet } from 'react-router-dom'

const Default = () => {
  return (
    <div className="flex justify-between">
      <div className="w-[8%] hover:w-[14%] fixed z-50 hover:pr-50px">
        <Navigation />
      </div>
      <div className="py-3 flex-auto ">
        <Outlet className="" />
      </div>
    </div>
  )
}

export default Default
