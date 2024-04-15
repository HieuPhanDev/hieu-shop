import { Link, useParams } from 'react-router-dom'
import { useGetProductsQuery } from '../redux/api/productApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Header from '../components/Header'
import Product from './product/Product'
import { useEffect } from 'react'
import { useGetCategoriesQuery } from '../redux/api/categoryApiSlice'
import { IoIosPhonePortrait } from 'react-icons/io'
import { IoMdTabletPortrait } from 'react-icons/io'
import { IoIosLaptop } from 'react-icons/io'
import { BsSpeaker } from 'react-icons/bs'
import { IoCameraOutline } from 'react-icons/io5'
import { IoHeadsetOutline } from 'react-icons/io5'
import { PiTelevisionSimpleBold } from 'react-icons/pi'
import { RiComputerLine } from 'react-icons/ri'
import { BsPrinter } from 'react-icons/bs'

const getIconForCategory = (categoryName) => {
  if (categoryName === 'Smartphone') {
    return <IoIosPhonePortrait size={26} />
  } else if (categoryName === 'Tablet') {
    return <IoMdTabletPortrait size={26} />
  } else if (categoryName === 'Laptop') {
    return <IoIosLaptop size={26} />
  } else if (categoryName === 'Speaker') {
    return <BsSpeaker size={26} />
  } else if (categoryName === 'Camera') {
    return <IoCameraOutline size={26} />
  } else if (categoryName === 'Accessories') {
    return <IoHeadsetOutline size={26} />
  } else if (categoryName === 'Television') {
    return <RiComputerLine size={26} />
  } else if (categoryName === 'Printer') {
    return <BsPrinter size={26} />
  }
}
const Home = () => {
  const { keyword } = useParams()
  const { data, isLoading, isError, refetch } = useGetProductsQuery()
  const { data: categories } = useGetCategoriesQuery()
  console.log(categories)
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">{isError?.data?.message || isError?.error}</Message>
      ) : (
        <div className="flex px-60">
          <div className="flex flex-col p-6 bg-[#151515] text-lg">
            <>
              <div>hello</div>
              {categories?.map((category) => (
                <div key={category._id} className=" p-2  flex gap-6">
                  {getIconForCategory(category.name)}
                  <Link to={`/category/${category._id}`}>{category.name}</Link>
                </div>
              ))}
            </>
          </div>
          <div></div>
        </div>
      )}
    </>
  )
}

export default Home
