import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useGetProductByIdQuery, useCreateReviewMutation } from '../../redux/api/productApiSlice'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import { FaBox, FaClock, FaShoppingCart, FaStar, FaStore } from 'react-icons/fa'
import moment from 'moment'
import HeartIcon from './HeartIcon'
import Rating from './Rating'
import ProductTab from './ProductTab'
import { addToCart } from '../../redux/features/cart/cartSlice'

const ProductDetails = () => {
  const { id: productId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const { data: product, isLoading, refetch, error } = useGetProductByIdQuery(productId)
  const { userInfo } = useSelector((state) => state.auth)

  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation()
  console.log([...Array(product.countInStock).keys()])
  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      await createReview({
        id: productId,
        data: { rating, comment },
      }).unwrap()
      refetch()
      toast.success('Review created successfully')
    } catch (error) {
      toast.error(error?.data || error.message)
    }
  }

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }))
    navigate('/cart')
  }

  return (
    <>
      <div>
        <Link to="/" className="text-white font-semibold hover:underline ml-[10rem]">
          Go Back
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.message}</Message>
      ) : (
        <>
          <div className="flex flex-wrap relative items-between mt-[2rem] ml-[10rem]">
            <div>
              <img src={product.image} alt={product.name} className="w-[500px] mr-[2rem]" />

              <HeartIcon product={product} />
            </div>

            <div className="flex flex-col justify-between">
              <h2 className="text-2xl font-semibold">{product.name}</h2>
              <p className="my-4 xl:w-[35rem] lg:w-[35rem] md:w-[30rem] text-[#B0B0B0]">
                {product.description.map((des, index) => (
                  <p key={index}>{des}</p>
                ))}
              </p>

              <p className="text-3xl my-4 font-extrabold">
                Giá: {product?.price?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
              </p>

              <div className="flex items-center justify-between w-[20rem]">
                <div className="one">
                  <h1 className="flex items-center mb-6">
                    <FaStore className="mr-2 text-white" /> Nhãn hàng: {product.brand}
                  </h1>
                  <h1 className="flex items-center mb-6 w-[20rem]">
                    <FaClock className="mr-2 text-white" /> Ngày thêm: {moment(product.createAt).fromNow()}
                  </h1>
                  <h1 className="flex items-center mb-6">
                    <FaStar className="mr-2 text-white" /> Nhận xét: {product.numReviews}
                  </h1>
                </div>

                <div className="two">
                  <h1 className="flex items-center mb-6">
                    <FaStar className="mr-2 text-white" /> Đánh giá: {product.rating}
                  </h1>
                  <h1 className="flex items-center mb-6">
                    <FaShoppingCart className="mr-2 text-white" /> Số lượng: {product.quantity}
                  </h1>
                  <h1 className="flex items-center mb-6 w-[10rem]">
                    <FaBox className="mr-2 text-white" /> Còn lại: {product.countInStock}
                  </h1>
                </div>
              </div>

              <div className="flex justify-between flex-wrap">
                <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'yellow-500'} />

                {product.countInStock > 0 && (
                  <div>
                    <select
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      className="p-2 w-[6rem] rounded-lg text-black"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="btn-container">
                <button
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className="bg-pink-600 text-white py-2 px-4 rounded-lg mt-4 md:mt-0 cursor-pointer"
                >
                  Add To Cart
                </button>
              </div>
            </div>

            <div className="mt-[5rem] container flex flex-wrap items-start justify-between ml-[10rem]">
              <ProductTab
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              />
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default ProductDetails
