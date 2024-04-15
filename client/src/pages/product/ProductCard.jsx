import { Link } from 'react-router-dom'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../redux/features/cart/cartSlice'
import { toast } from 'react-toastify'
import HeartIcon from './HeartIcon'
import { FaArrowRight } from 'react-icons/fa6'
import Ratings from './Rating'
const ProductCard = ({ p }) => {
  const dispatch = useDispatch()

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }))
    toast.success('Item added successfully', {
      autoClose: 2000,
    })
  }
  return (
    <div className="bg-[#1A1A1A] rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
      <section className="relative">
        <Link to={`/product/${p._id}`}>
          <span className="absolute bottom-3 right-3 bg-pink-100 text-pink-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
            {p?.brand}
          </span>
          <img className="cursor-pointer w-full" src={p.image} alt={p.name} />
        </Link>
        <HeartIcon product={p} />
      </section>

      <div className="p-5">
        <div className="">
          <h5 className="mb-2 text-xl text-whiet dark:text-white line-clamp-1">{p?.name}</h5>

          <p className="text-black font-semibold text-pink-500">
            {p?.price?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
          </p>
        </div>

        <p className="mb-1 font-normal text-[#CFCFCF] line-clamp-2">{p?.description} ...</p>
        <Ratings value={p?.rating} text={`${p?.numReviews} reviews`} color={'yellow-500'} />
        <section className="flex justify-between items-center">
          <Link
            to={`/product/${p._id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
          >
            Chi Tiết
            <FaArrowRight className="w-3.5 h-3.5 ml-2" />
          </Link>

          <button className="p-2 rounded-full" onClick={() => addToCartHandler(p, 1)}>
            <AiOutlineShoppingCart size={25} />
          </button>
        </section>
      </div>
    </div>
  )
}

export default ProductCard
