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

function App() {
  return (
    <div>
      <Routes>
        <Route path={path.DEFAULT} element={<Default />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.LOGIN} element={<Login />} />
          <Route path={path.REGISTER} element={<Register />} />
          <Route path={path.FAVORITE} element={<Favorites />} />
          <Route path="/cart" element={<Cart />} />
          <Route path={path.SHOP} element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="" element={<Private />}>
            <Route path={path.PROFILE} element={<Profile />} />
          </Route>
          <Route path={path.ADMIN} element={<AdminRoute />}>
            <Route path={path.USERLIST} element={<UserList />} />
            <Route path={path.CATEGORYLIST} element={<CategoryList />} />
            <Route path={path.PRODUCTLIST} element={<ProductList />} />
            <Route path="allproductslist" element={<AllProducts />} />
            <Route path="product/update/:_id" element={<ProductUpdate />} />
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
