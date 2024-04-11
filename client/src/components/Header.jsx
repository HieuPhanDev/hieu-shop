import { useGetProductsQuery } from '../redux/api/productApiSlice'
import Loader from './Loader'
import SmallProduct from '../pages/product/SmallProduct'
import ProductCarousel from '../pages/product/ProductCarousel'

const Header = () => {
  const { data, isLoading, error } = useGetProductsQuery({ limit: 4 })
  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return <h1>ERROR</h1>
  }

  return (
    <>
      <div className="flex justify-around pl-16">
        <div className="xl:block lg:hidden md:hidden:sm:hidden">
          <div className="grid grid-cols-2">
            {data?.data?.response?.map((product) => (
              <div key={product._id}>
                <SmallProduct product={product} />
              </div>
            ))}
          </div>
        </div>
        <ProductCarousel />
      </div>
    </>
  )
}

export default Header
