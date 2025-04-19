/* eslint-disable react/prop-types */
import React from 'react'

function OrderedRecommendations({recommendedOrderedProducts,handleAddToCart}) {
  return (
    <>
    <h2 className="text-xl font-semibold mb-2">🚀 Frequently Bought Together</h2>
    <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
      {recommendedOrderedProducts.length == 0 ? (
        <div className="text-center px-6 py-10 bg-[#121212] rounded-lg shadow-inner border border-[#FF6F00]/20">
        <p className="text-[#FFB74D] text-base font-semibold mb-1">
          Nothing to see here yet 👀
        </p>
        <p className="text-sm text-white/70">
        No recommended products based on your orders.
        </p>
      </div>
      ):(recommendedOrderedProducts.map((product) => (
        <div key={product.id} className="overflow-y-hidden flex-shrink-0 w-36 sm:w-40 md:w-44 bg-[#1e1e1e] rounded-xl shadow-md p-3 mx-2">
          {!product.imageUrl ? (
            <div className="animate-pulse bg-gray-700 h-32 w-full rounded-lg"></div>
          ) : (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-32 object-cover rounded-lg"
              loading="lazy"
            />
          )}
          <div className="mt-3 space-y-1">
            <p className="text-sm font-medium text-white truncate">{product.name}</p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wide shadow-md">{product.brand}</p>
            <p className="text-sm text-[#FFB74D] font-semibold">₹{product.price}</p>

            <button className="mt-2 w-full bg-[#FF6F00] hover:bg-[#e65c00] text-white text-sm font-semibold py-1.5 rounded-md transition-all duration-200"
            onClick={()=>handleAddToCart(product.id,product.name,product.imageUrl,product.brand,product.price)}>
              Add to Cart
            </button>
          </div> 
        </div>
      )))
      }
    </div>
    </>
  )
}

export default React.memo(OrderedRecommendations);