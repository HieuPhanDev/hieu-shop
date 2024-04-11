import { useGetProductsQuery } from '../redux/api/productApiSlice'
import { useGetCategoriesQuery } from '../redux/api/categoryApiSlice'
import { useNavigate, createSearchParams, useSearchParams } from 'react-router-dom'
import Loader from '../components/Loader'
import ProductCard from './product/ProductCard'
import { useEffect, useState } from 'react'
import Ratings from './product/Rating'
const Shop = () => {
  const navigate = useNavigate()
  let [searchParams, setSearchParams] = useSearchParams()
  const { data: categories } = useGetCategoriesQuery()
  let [query, setQuery] = useState({})
  const updateQuery = (key, value) => {
    const params = Object.fromEntries(searchParams.entries())
    navigate({ search: createSearchParams({ ...params, [key]: value }).toString() })
  }
  useEffect(() => {
    let newQuery = { ...query }
    if (searchParams.has('category')) {
      newQuery.category = searchParams.get('category')
    }
    if (searchParams.has('rating') && +searchParams.has('rating') >= 1 && +searchParams.has('rating') <= 5) {
      const rating = +searchParams.get('rating')
      newQuery['rating[lte]'] = rating
      newQuery['rating[gte]'] = rating - 1
    }
    if (searchParams.has('priceFrom')) {
      if (searchParams.get('priceFrom') === '') {
        searchParams.delete('priceFrom')
        setSearchParams(searchParams)
      }
      const priceFrom = parseFloat(searchParams.get('priceFrom'))
      if (!isNaN(priceFrom)) {
        newQuery['price[gte]'] = priceFrom
      }
    }
    if (searchParams.has('priceTo')) {
      if (searchParams.get('priceTo') === '') {
        searchParams.delete('priceTo')
        setSearchParams(searchParams)
      }
      const priceTo = parseFloat(searchParams.get('priceTo'))
      if (!isNaN(priceTo)) {
        newQuery['price[lte]'] = priceTo
      }
    }
    if (searchParams.has('sort')) {
      if (searchParams.get('sort') === '') {
        searchParams.delete('sort')
        setSearchParams(searchParams)
      }
      newQuery.sort = searchParams.get('sort')
    }
    setQuery(newQuery) // Cập nhật trạng thái truy vấn
  }, [searchParams])
  let { data } = useGetProductsQuery(query)
  const products = data?.data?.response
  const handleCategory = (id) => updateQuery('category', id)
  const handleRating = (rating) => updateQuery('rating', rating)
  const handlePriceFrom = (priceFrom) => updateQuery('priceFrom', priceFrom)
  const handlePriceTo = (priceTo) => updateQuery('priceTo', priceTo)
  const handleSort = (sort) => updateQuery('sort', sort)
  const handleReset = () => {
    const inputs = document.querySelectorAll('input[type="radio"], input[type="number"]')
    inputs.forEach((input) => {
      input.checked = false
      input.value = ''
    })
    setSearchParams({})
    setQuery({})
  }
  return (
    <>
      <div className="container">
        <div className="flex md:flex-row pl-28">
          <div className="bg-[#151515] p-3 mt-2 mb-2">
            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">Lọc Theo</h2>
            <div className="w-[15rem] text-black pl-10 my-4">
              <select className="rounded" onChange={(e) => handleSort(e.target.value)}>
                <option value="">Tất cả</option>
                <option value="-price">Giá giảm dần</option>
                <option value="price">Giá tăng dần</option>
                <option value="-rating">Đánh giá giảm dần</option>
                <option value="-rating">Đánh giá tăng dần</option>
              </select>
            </div>
            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">Danh Mục</h2>
            <div className="p-5 w-[15rem]">
              {categories?.map((c) => (
                <div key={c._id} className="mb-2 pl-6">
                  <div className="flex ietms-center mr-4">
                    <input
                      type="radio"
                      id={c._id}
                      name="category"
                      onChange={() => handleCategory(c._id)}
                      className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />

                    <label htmlFor={c._id} className="ml-2 text-sm font-medium text-white dark:text-gray-300">
                      {c.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="h4 text-center py-2 bg-black rounded-full mb-4">Đánh Giá</h2>
            {[1, 2, 3, 4, 5].map((r) => (
              <div className="flex pl-10 mb-2" key={r}>
                <input type="radio" id={r} name="rating" onChange={() => handleRating(r)} />
                <label htmlFor={r}>
                  <Ratings value={r} text={`${r}`} color={'yellow-500'} />
                </label>
              </div>
            ))}

            <h2 className="h4 text-center py-2 bg-black rounded-full mt-8 mb-4">Giá Tiền</h2>

            <div className=" w-[15rem] flex">
              <input
                type="number"
                placeholder="From"
                onChange={(e) => handlePriceFrom(e.target.value)}
                className="w-full px-3 mr-2 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
              />
              <div className="text-xl mt-1">-</div>
              <input
                type="number"
                placeholder="To"
                onChange={(e) => handlePriceTo(e.target.value)}
                className="w-full px-3 py-2 ml-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
              />
            </div>

            <div className="p-5 pt-0">
              <button className="w-full border my-4" onClick={() => handleReset()}>
                Reset
              </button>
            </div>
          </div>

          <div className="p-3">
            <h2 className="h4 text-center mb-2">{products?.length} Products</h2>
            <div className="flex flex-wrap">
              {products?.length === 0 ? (
                <Loader />
              ) : (
                products?.map((p) => (
                  <div className="p-3" key={p._id}>
                    <ProductCard p={p} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Shop
