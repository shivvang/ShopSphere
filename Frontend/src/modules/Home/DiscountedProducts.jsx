/* eslint-disable react/prop-types */
import React from 'react'
import { useNavigate } from 'react-router-dom';

function DiscountedProducts({discountedProducts,handleAddToCart}) {
  const navigate = useNavigate();
  return (
    <>
    <div className="p-6 bg-[#1a1a1a] rounded-xl shadow-md">
    <h2 className="text-2xl font-semibold mb-4">🔥 Discounted Deals </h2>
    <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 snap-x snap-mandatory">
      {discountedProducts.length > 0 ? (discountedProducts.map((product) => (
        <div
          key={product._id}
          onClick={()=>navigate(`/product/${product._id}`)}
          className="bg-[#121212] border-2 border-[#FF6F00] p-4 rounded-lg shadow-md w-56 flex-shrink-0 snap-start"
        >
          {!product.imageUrl ? (
            <div className="animate-pulse bg-gray-800 h-40 w-full rounded-lg"></div>
          ) : (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-40 object-cover rounded-lg"
              loading="lazy"
            />
          )}
          <div className="mt-2">
            <div className="flex items-center space-x-2">
              <p className="text-gray-400 font-semibold line-through">
                ₹ {product.price}
              </p>
              <p className="text-white font-bold text-lg">
                ₹ {product.price - product.discount}
              </p>
              {product.discount > 0 && (
                <p className="text-[#FF6F00] font-semibold">
                  ({product.discount} off)
                </p>
              )}
            </div>
            <span className="text-gray-400 truncate block">
              {product.name}
            </span>
            <span className="text-[#FF6F00] text-sm font-bold uppercase tracking-wide shadow-md">
              {product.brand}
            </span>
          </div>
          <button className="mt-3 w-full bg-[#FF6F00] text-white font-semibold py-2 rounded-lg hover:bg-[#e65c00] transition-all"
          onClick={(e)=>{
            e.stopPropagation();
            handleAddToCart(product._id,product.name,product.imageUrl,product.brand,product.price)
          }}>
            Add to Cart
          </button>
        </div>
      ))):(
        <div className="flex flex-col items-center justify-center w-full py-10 text-center text-gray-400">
          <div className="text-4xl mb-4 animate-bounce">🛍️</div>
          <h3 className="text-xl font-semibold mb-1">No Deals Right Now</h3>
          <p className="text-sm max-w-md">
            We&apos;re freshening up the discounts! Check back soon for exciting offers and hot deals. 🔥
          </p>
        </div>
      )}
    </div>
  </div>
  </>
  )
}

export default React.memo(DiscountedProducts);