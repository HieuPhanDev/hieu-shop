import { useGetProductsQuery } from '../../redux/api/productApiSlice'
import Message from '../../components/Message'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import moment from 'moment'
import { FaBox, FaClock, FaShoppingCart, FaStar, FaStore } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import ProductBanner from './ProductBanner'
import ProductCard from './ProductCard'

const ProductCarousel = ({ type, products }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: type === 'banner' ? 1 : 4,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  }
  return (
    <div className="mb-4 lg:block xl:block md:block">
      <Slider {...settings}>
        {products?.map((product) =>
          type === 'banner' ? (
            <div key={product._id}>
              <ProductBanner product={product} />
            </div>
          ) : (
            <div key={product._id}>
              <ProductCard p={product} />
            </div>
          )
        )}
      </Slider>
    </div>
  )
}

export default ProductCarousel
