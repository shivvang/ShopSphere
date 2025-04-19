/* eslint-disable react/prop-types */
import React from 'react'

function LatestProducts({latestProducts,handleAddToWishlist}) {
  return (
    <>
         <h2 className="text-xl font-semibold mb-2">🛒 New Arrivals</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            {latestProducts.map((product) => (
              <div key={product._id} className="flex-shrink-0 w-36 sm:w-40 md:w-44 bg-[#1e1e1e] rounded-xl shadow-md p-3 mx-2">
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
                <p className="text-sm text-[#FFB74D] font-semibold">₹ {product.price}</p>

                <button className="mt-2 w-full bg-[#FF6F00] hover:bg-[#e65c00] text-white text-sm font-semibold py-1.5 rounded-md transition-all duration-200"
                onClick={()=>{handleAddToWishlist(product._id,product.name,product.imageUrl,product.brand,product.price)}}>
                  Add to Wishlist
                </button>
              </div>
            </div>
            ))}
          </div>
    </>
  )
}

export default React.memo(LatestProducts);