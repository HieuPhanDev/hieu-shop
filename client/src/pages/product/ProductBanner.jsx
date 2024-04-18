import { useGetProductsQuery } from '../../redux/api/productApiSlice'
import Message from '../../components/Message'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import moment from 'moment'
import { FaBox, FaClock, FaShoppingCart, FaStar, FaStore } from 'react-icons/fa'
import { Link } from 'react-router-dom'
const ProductBanner = ({ product }) => {
  const { image, _id, name, price, description, brand, createdAt, numReviews, rating, quantity, countInStock } = product
  return (
    <div>
      <Link to={`/product/${_id}`}>
        <img src={image} alt={name} className="w-full rounded-lg object-cover h-[25rem]" />
      </Link>
      <div className="mt-4 flex justify-between gap-4">
        <div className="one">
          <Link to={`/product/${_id}`}>
            <h2 className="text-xl font-bold hover:text-pink-500">{name}</h2>
          </Link>
          <p className="font-bold">Giá: {price?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>{' '}
          <br /> <br />
          <p className="w-[25rem] ">{description[0]} ...</p>
        </div>

        <div className="flex justify-between w-[20rem]">
          <div className="one">
            <h1 className="flex items-center mb-6">
              <FaStore className="mr-2 text-white" /> Nhãn hàng: {brand}
            </h1>
            <h1 className="flex items-center mb-6">
              <FaClock className="mr-2 text-white" /> Ngày thêm: {moment(createdAt).fromNow()}
            </h1>
            <h1 className="flex items-center mb-6">
              <FaStar className="mr-2 text-white" /> Nhận xét: {numReviews}
            </h1>
          </div>

          <div className="two">
            <h1 className="flex items-center mb-6">
              <FaStar className="mr-2 text-yellow-500" /> Đánh giá: {Math.round(rating)}
            </h1>
            <h1 className="flex items-center mb-6">
              <FaShoppingCart className="mr-2 text-white" /> Số lượng: {quantity}
            </h1>
            <h1 className="flex items-center mb-6">
              <FaBox className="mr-2 text-white" /> Còn lại: {countInStock}
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductBanner
