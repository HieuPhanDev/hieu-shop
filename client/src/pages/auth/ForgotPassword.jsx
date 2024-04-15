import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Loader from '../../components/Loader'
import { useForgotPasswordMutation } from '../../redux/api/userApiSlice'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import path from '../../utils/path'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

const DisplayingError = Yup.object().shape({
  email: Yup.string().email('Email không đúng định dạng').required('Email không được để trống!'),
})

const ForgotPassword = () => {
  const navigate = useNavigate()

  const [forgot, { isLoading }] = useForgotPasswordMutation()
  const { userInfo } = useSelector((state) => state.auth)
  useEffect(() => {
    if (userInfo) {
      navigate('/')
    }
  }, [navigate, userInfo])
  const handleSubmit = async (values) => {
    try {
      await forgot(values).unwrap()
      setTimeout(() => {
        toast.success('Gửi mã xác nhận thành công! Vui lòng kiểm tra email của bạn')
      }, 100)
      navigate(path.LOGIN)
    } catch (error) {
      toast.error(error?.data?.message || error.error)
    }
  }

  return (
    <div className="mr-[4rem] py-20 px-72">
      <h1 className="text-2xl font-semibold mb-4">Nhập Email</h1>
      <Formik
        initialValues={{
          email: '',
        }}
        validationSchema={DisplayingError}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ errors, touched }) => (
          <Form className="container w-[40rem]">
            <div className="my-[2rem]">
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Nhập Email"
              />
              {touched.email && errors.email && (
                <div className="text-xs text-red-500 absolute mt-1">{errors.email}</div>
              )}
            </div>
            <button
              disabled={isLoading}
              type="submit"
              className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]"
            >
              {isLoading ? 'Gửi mail...' : 'Gửi mail'}
            </button>

            {isLoading && <Loader />}
          </Form>
        )}
      </Formik>
      <div className="mt-4 flex justify-between">
        <p className="text-white">
          Chưa có tài khoản?{' '}
          <Link to={path.REGISTER} className="text-pink-500 hover:underline">
            Đăng Kí
          </Link>
        </p>
        <p className="text-white pr-64">
          <Link to={path.FORGOTPASSWORD} className="text-pink-500 hover:underline">
            Quên mật khẩu?
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword
