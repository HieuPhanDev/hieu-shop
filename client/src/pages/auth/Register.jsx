import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../../components/Loader'
import { useRegisterMutation } from '../../redux/api/userApiSlice'
import { setCredentials } from '../../redux/features/auth/authSlice'
import { toast } from 'react-toastify'
import path from '../../utils/path'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

const DisplayingError = Yup.object().shape({
  name: Yup.string().min(2, 'Quá ngắn!').max(50, 'Quá dài!').required('Tên không được để trống!'),
  email: Yup.string().email('Email không đúng định dạng').required('Email không được để trống!'),
  password: Yup.string().min(4, 'Tối thiểu 4 kí tự').required('Password không được để trống!'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Password không khớp!'),
})
const Register = () => {
  const navigate = useNavigate()
  const [register, { isLoading }] = useRegisterMutation()
  const { userInfo } = useSelector((state) => state.auth)
  useEffect(() => {
    if (userInfo) {
      navigate('/')
    }
  }, [navigate, userInfo])

  const handleSubmit = async (values, resetForm) => {
    try {
      const res = await register({ name: values.name, email: values.email, password: values.password }).unwrap()
      if (res.success) {
        toast.success('Vui lòng kiểm tra email của bạn để xác nhận tài khoản!')
        resetForm()
      }
    } catch (err) {
      console.log(err)
      toast.error(err.data.message)
    }
  }

  return (
    <div className="mr-[4rem] py-20 px-72">
      <h1 className="text-2xl font-semibold mb-4">Đăng Kí</h1>
      <Formik
        initialValues={{
          email: '',
          password: '',
          name: '',
          confirmPassword: '',
        }}
        validationSchema={DisplayingError}
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values, resetForm)
        }}
      >
        {({ errors, touched }) => (
          <Form className="container w-[40rem]">
            <div className="my-[2rem]">
              <label htmlFor="name" className="block text-sm font-medium text-white">
                Tên
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Enter name"
              />
              {touched.name && errors.name && <div className="text-xs text-red-500 absolute mt-1">{errors.name}</div>}
            </div>

            <div className="my-[2rem]">
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Nhập email"
              />
              {touched.email && errors.email && (
                <div className="text-xs text-red-500 absolute mt-1">{errors.email}</div>
              )}
            </div>

            <div className="my-[2rem]">
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Nhập password"
              />
              {touched.password && errors.password && (
                <div className="text-xs text-red-500 absolute mt-1">{errors.password}</div>
              )}
            </div>

            <div className="my-[2rem]">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                Xác Nhận Password
              </label>
              <Field
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Xác Nhận password"
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <div className="text-xs text-red-500 absolute mt-1">{errors.confirmPassword}</div>
              )}
            </div>
            <button
              disabled={isLoading}
              type="submit"
              className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
            {isLoading && <Loader />}
          </Form>
        )}
      </Formik>
      <div className="mt-4">
        <p className="text-white">
          Đã có tài khoản?{' '}
          <Link to={path.LOGIN} className="text-pink-500 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
