/* eslint-disable react/prop-types */
function ListOfProduct({ products }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-2">
      {products.map((p) => (
        <div
          key={p.id}
          className="bg-[#121212] border border-gray-700 shadow-md rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg"
        >
          {/* ✅ Shimmer Effect for Loading */}
          {!p.imageUrl ? (
            <div className="animate-pulse bg-gray-800 h-40 w-full rounded-t-xl"></div>
          ) : (
            <img
              className="w-full h-44 object-cover rounded-t-xl"
              src={p.imageUrl}
              alt={p.name}
            />
          )}

          <div className="p-4 flex flex-col items-center">
            {/* ✅ Price and Name */}
            <div className="flex justify-between w-full">
              <span className="text-[#FFA500] font-semibold text-lg">
                ₹ {p.price}
              </span>
              <span 
                className="text-gray-300 font-medium text-sm truncate max-w-[60%]" 
                title={p.name}
              >
                {p.name}
              </span>
            </div>

            {/* ✅ "Add to Wishlist" Button */}
            <button className="mt-3 px-5 py-2 bg-[#FF6F00] text-white font-semibold rounded-full shadow-md hover:bg-[#e65c00] transition-all duration-300">
              ❤️ Add to Wishlist
            </button>
          </div>
        </div>
      ))}
    </div>
  );
  }

  export default ListOfProduct;