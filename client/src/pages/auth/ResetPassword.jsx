import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loader from '../../components/Loader'
import { useResetPasswordMutation } from '../../redux/api/userApiSlice'
import { setCredentials } from '../../redux/features/auth/authSlice'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import path from '../../utils/path'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

const DisplayingError = Yup.object().shape({
  password: Yup.string().min(4, 'Tối thiểu 4 kí tự').required('Password không được để trống!'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Password không khớp!'),
})
const ResetPassword = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  let { token } = useParams()
  console.log(token)
  const [reset, { isLoading }] = useResetPasswordMutation()
  const { userInfo } = useSelector((state) => state.auth)
  useEffect(() => {
    if (userInfo) {
      navigate('/')
    }
  }, [navigate, userInfo])
  const handleSubmit = async (values) => {
    try {
      await reset({ token, data: values }).unwrap()
      setTimeout(() => {
        toast.success('Lấy lại mật khẩu thành công! Hãy đăng nhập lại!')
      }, 100)
      navigate(path.LOGIN)
    } catch (error) {
      toast.error(error?.data?.message || error.error)
    }
  }

  return (
    <div className="mr-[4rem] py-20 px-72">
      <h1 className="text-2xl font-semibold mb-4">Nhập Mật Khẩu Mới</h1>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={DisplayingError}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ errors, touched }) => (
          <Form className="container w-[40rem]">
            <div className="my-[2rem]">
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Nhập password mới"
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
              {isLoading ? 'Xác nhận...' : 'Xác nhận'}
            </button>

            {isLoading && <Loader />}
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default ResetPassword
