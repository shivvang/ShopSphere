/* eslint-disable react/prop-types */
function ListOfProduct({ products=[] ,handleAddToWishlist}) {
  return (
    <div className="mt-12 px-4 md:px-10 lg:px-20">
      <div className="p-6 bg-[#1a1a1a] rounded-xl shadow-md">
        {/* ✅ Heading */}
        <h2 className="text-2xl font-bold text-white mb-4">
          🔥 You Might Like This
        </h2>

        {/* ✅ Horizontally Scrollable Container */}
        <div className="flex gap-4 overflow-x-auto overflow-y-hidden whitespace-nowrap snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 -webkit-overflow-scrolling-touch">
          {products.length === 0 ? (
            <div className="text-center px-6 py-10 bg-[#1a1a1a] rounded-lg shadow-inner border border-[#FF6F00]/20">
              <p className="text-[#FF6F00] text-base font-semibold mb-1">
              Wishlist is feeling lonely 🧡
             </p>
            <p className="text-sm text-white/70">
              No recommended products based on your Wishlist yet.
            </p>
            </div>
            ):(
            products.map((product) => (
            <div
              key={product.id}
              className="bg-[#121212] border border-gray-700 p-4 rounded-lg shadow-md w-56 flex-shrink-0 snap-start"
            >
              {/* ✅ Image Handling */}
              {!product.imageUrl ? (
                <div className="animate-pulse bg-gray-800 h-40 w-full rounded-lg" />
              ) : (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}

            
              <div className="mt-2">
                <span className="text-white font-medium truncate block">
                  {product.name}
                </span>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wide shadow-md">{product.brand}</p>
                <p className="text-[#FFB74D]  font-semibold text-lg">
                  ₹ {product.price}
                </p>
              </div>

              {/* ✅ Wishlist Button */}
              <button className="mt-3 w-full bg-[#FF6F00] text-white font-semibold py-2 rounded-lg hover:bg-[#e65c00] transition-all"
              onClick={()=>{handleAddToWishlist(product.id,product.name,product.imageUrl,product.price)}}>
                Add to Wishlist
              </button>
            </div>
          ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ListOfProduct;
