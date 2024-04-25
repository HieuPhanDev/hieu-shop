import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AiOutlineHome,
  AiOutlineLogin,
  AiOutlineShopping,
  AiOutlineShoppingCart,
  AiOutlineUserAdd,
} from 'react-icons/ai'
import { FaUserCircle } from 'react-icons/fa'
import { FaHeart } from 'react-icons/fa'
import path from '../../utils/path'
import { useDispatch, useSelector } from 'react-redux'
import { useLogoutMutation } from '../../redux/api/userApiSlice'
import { logout } from '../../redux/features/auth/authSlice'
import FavoritesCount from '../product/FavoritesCount'
function capitalizeFirstLetter(string) {
  string = string.split(' ').pop()
  return string.charAt(0).toUpperCase() + string.slice(1)
}
const Navigation = () => {
  const { isLogged } = useSelector((state) => state.auth)
  const { userInfo } = useSelector((state) => state.auth)
  const { cartItems } = useSelector((state) => state.cart)
  const [show, setShow] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [logoutApiCall] = useLogoutMutation()
  useEffect(() => {}, [isLogged])
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap()
      dispatch(logout())
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className={`flex p-6 px-28 text-white bg-[#000] justify-between`}>
      <div className="flex space-x-14 ">
        <Link to={path.DEFAULT} className="flex items-center transition-transform transform hover:-translate-y-2">
          <AiOutlineHome className="mr-2" size={26} />
          <span>Trang Chủ</span>{' '}
        </Link>
        <Link to={path.SHOP} className="flex items-center transition-transform transform hover:-translate-y-2">
          <AiOutlineShopping className="mr-2" size={26} />
          <span>Shopping</span>{' '}
        </Link>
        <Link to={path.CART} className="flex relative">
          <div className="flex items-center transition-transform transform hover:-translate-y-2">
            <AiOutlineShoppingCart className="mr-2" size={26} />
            <span>Giỏ Hàng</span>{' '}
          </div>
          <div className="absolute top-9">
            {cartItems.length > 0 && (
              <span>
                <span className="px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              </span>
            )}
          </div>
        </Link>
        <Link to={path.FAVORITE} className="flex relative">
          <div className="flex justify-center items-center transition-transform transform hover:-translate-y-2">
            <FaHeart className="mr-2" size={20} />
            <span>Yêu Thích</span> <FavoritesCount />
          </div>
        </Link>
      </div>
      <div className="relative">
        <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
          <div className="relative items-center transition-transform transform hover:-translate-y-1 cursor-pointer mt-2 z-50">
            <FaUserCircle className="mx-auto text-center" size={26} />
            <span>{userInfo ? 'Hi ' + capitalizeFirstLetter(userInfo.name) + '!' : 'User'}</span>
          </div>
          {show && !userInfo && (
            <div className="absolute flex flex-col border rounded-md p-4 bg-stone-900 border-slate-200 left-1/2 transform -translate-x-1/2 w-[150px]">
              <Link
                to={path.LOGIN}
                className="flex items-center pb-2 transition-transform transform hover:-translate-y-1"
              >
                <span>Đăng Nhập</span>
                <AiOutlineLogin className="ml-2" size={26} />
              </Link>
              <hr />
              <Link
                to={path.REGISTER}
                className="flex items-center mt-2 transition-transform transform hover:-translate-y-1"
              >
                <span>Đăng Kí</span>
                <AiOutlineUserAdd className="ml-2" size={26} />
              </Link>
            </div>
          )}
          {show && userInfo && (
            <div className="absolute flex flex-col border rounded-md p-4 bg-stone-900 border-slate-200 left-1/2 transform -translate-x-1/2 w-[150px]">
              {userInfo.role === 'Admin' && (
                <>
                  <Link
                    to={path.DASHBOARD}
                    className="flex items-center pb-2 transition-transform transform hover:-translate-y-1"
                  >
                    <span>Dashboard</span>
                  </Link>
                  <hr />
                  <Link
                    to="/admin/productlist"
                    className="flex items-center mt-2 transition-transform transform hover:-translate-y-1 pb-2"
                  >
                    <span>Products</span>
                  </Link>
                  <hr />
                  <Link
                    to="/admin/categorylist"
                    className="flex items-center mt-2 transition-transform transform hover:-translate-y-1 pb-2"
                  >
                    <span> Category</span>
                  </Link>
                  <hr />
                  <Link
                    to="/admin/orderlist"
                    className="flex items-center mt-2 transition-transform transform hover:-translate-y-1 pb-2"
                  >
                    <span> Orders</span>
                  </Link>
                  <hr />
                  <Link
                    to={`${path.ADMIN}/${path.USERLIST}`}
                    className="flex items-center mt-2 transition-transform transform hover:-translate-y-1 pb-2"
                  >
                    <span> Users</span>
                  </Link>
                  <hr />
                </>
              )}
              <Link
                to={path.PROFILE}
                className="flex items-center mt-2 transition-transform transform hover:-translate-y-1 pb-2"
              >
                <span> Profile</span>
              </Link>
              <hr />
              <button
                onClick={logoutHandler}
                className="flex items-center mt-2 transition-transform transform hover:-translate-y-1 pb-2"
              >
                <span> Đăng Xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navigation
