import { Link, useParams } from 'react-router-dom'
import { useGetProductsQuery } from '../redux/api/productApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Header from '../components/Header'
import Product from './product/Product'
import { useEffect, useState } from 'react'
import { useGetCategoriesQuery } from '../redux/api/categoryApiSlice'
import { IoIosPhonePortrait } from 'react-icons/io'
import { IoMdTabletPortrait } from 'react-icons/io'
import { IoIosLaptop } from 'react-icons/io'
import { BsSpeaker } from 'react-icons/bs'
import { IoCameraOutline } from 'react-icons/io5'
import { IoHeadsetOutline } from 'react-icons/io5'
import { PiTelevisionSimpleBold } from 'react-icons/pi'
import { IoIosMenu } from 'react-icons/io'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { RiComputerLine } from 'react-icons/ri'
import { BsPrinter } from 'react-icons/bs'
import Slider from 'react-slick'
import { FaBox, FaClock, FaShoppingCart, FaStar, FaStore } from 'react-icons/fa'
import moment from 'moment'
import ProductCarousel from './product/ProductCarousel'

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
  const [active, setActive] = useState(0)
  const [query, setQuery] = useState({})
  const { data, isLoading, isError } = useGetProductsQuery(query)
  const { data: categories } = useGetCategoriesQuery()
  const products = data?.data?.response

  useEffect(() => {
    if (products) {
      switch (active) {
        case 0:
          setQuery({})
          break
        case 1:
          setQuery({ sort: '-rating' })
          break
        case 2:
          setQuery({ sort: 'price' })
          break
        default:
          break
      }
    }
  }, [active, products])
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">{isError?.data?.message || isError?.error}</Message>
      ) : (
        <div className="px-52">
          <div className="gap-16 flex">
            <div className="flex flex-col bg-[#151515] text-lg w-[30%]">
              <>
                <div className="p-4 flex gap-6 px-8 font-bold bg-slate-950 mb-4">
                  <IoIosMenu size={26} />
                  Tất cả danh mục
                </div>
                {categories?.map((category) => (
                  <div key={category._id} className="p-4 flex gap-6 px-6 hover:text-pink-500 cursor-pointer">
                    {getIconForCategory(category.name)}
                    <Link to={`/shop/?category=${category._id}`}>{category.name}</Link>
                  </div>
                ))}
              </>
            </div>
            <div className="w-[70%]">
              <ProductCarousel type={'banner'} products={products} />
            </div>
          </div>
          <div className="pt-10">
            <div className="flex text-xl text-gray-500 my-12 border-b relative">
              <div
                className={`${
                  active === 0 ? 'text-white border border-b-0 bg-black' : ''
                }  absolute -bottom-[1px] p-4 px-6 cursor-pointer`}
                onClick={() => setActive(0)}
              >
                HÀNG MỚI
              </div>
              <div
                className={`${
                  active === 1 ? 'text-white border border-b-0 bg-black' : ''
                }   absolute -bottom-[1px] left-40 p-4 px-6 cursor-pointer`}
                onClick={() => setActive(1)}
              >
                BÁN CHẠY
              </div>
              <div
                className={`${
                  active === 2 ? 'text-white border border-b-0 bg-black' : ''
                }   absolute -bottom-[1px] left-80 p-4 px-6 cursor-pointer`}
                onClick={() => setActive(2)}
              >
                GIÁ RẺ
              </div>
            </div>
            <ProductCarousel type={'product'} products={products} />
          </div>
        </div>
      )}
    </>
  )
}

export default Home
