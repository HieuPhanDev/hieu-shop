import { Route, Routes } from 'react-router-dom'
import Default from './pages/Default'
import path from './utils/path'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Private from './components/Private'
import Profile from './pages/user/Profile'
import AdminRoute from './pages/admin/AdminRoute'
import UserList from './pages/admin/UserList'
import CategoryList from './pages/admin/CategoryList'
import ProductList from './pages/admin/ProductList'
import ProductUpdate from './pages/admin/ProductUpdate'
import AllProducts from './pages/admin/AllProduct'
import Home from './pages/Home'
import Favorites from './pages/product/Favorites'
import ProductDetails from './pages/product/ProductDetails'
import Cart from './pages/Cart'
import Shop from './pages/Shop'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Shipping from './pages/order/Shipping'
import PlaceOrder from './pages/order/PlaceOrder'
import Order from './pages/order/Order'
import UserOrder from './pages/user/UserOrder'
import OrderList from './pages/admin/OrderList'
import AdminDashboard from './pages/admin/AdminDashboard'
function App() {
  return (
    <div>
      <Routes>
        <Route path={path.DEFAULT} element={<Default />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.LOGIN} element={<Login />} />
          <Route path={path.REGISTER} element={<Register />} />
          <Route path={path.FAVORITE} element={<Favorites />} />
          <Route path={path.CART} element={<Cart />} />
          <Route path={path.SHOP} element={<Shop />} />
          <Route path={path.FORGOTPASSWORD} element={<ForgotPassword />} />
          <Route path={path.RESETPASSWORD} element={<ResetPassword />} />

          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="" element={<Private />}>
            <Route path={path.PROFILE} element={<Profile />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/placeorder" element={<PlaceOrder />} />
            <Route path="/order/:id" element={<Order />} />
            <Route path="/user-orders" element={<UserOrder />} />
          </Route>
          <Route path={path.ADMIN} element={<AdminRoute />}>
            <Route path={path.USERLIST} element={<UserList />} />
            <Route path={path.CATEGORYLIST} element={<CategoryList />} />
            <Route path={path.PRODUCTLIST} element={<ProductList />} />
            <Route path="allproductslist" element={<AllProducts />} />
            <Route path="product/update/:_id" element={<ProductUpdate />} />
            <Route path="orderlist" element={<OrderList />} />
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ToastContainer />
    </div>
  )
}

export default App
