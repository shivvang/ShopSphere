/* eslint-disable react/prop-types */
import Carousel from "./Carousel"
import Category from "./Category"
import ListOfProduct from "./ListOfProduct"




function MainContent({products}) {
  return (
    <div className="bg-gradient-to-br from-[#0d0d0d] to-[#1a1a1a] w-full min-h-screen h-full py-6 px-4 md:px-10 lg:px-20 flex flex-col gap-8 font-sans">

      {/* ✅ Hero Section */}
      <div className="text-center text-white py-12">
        <h1 className="text-4xl font-extrabold mb-4">
          Your One-Stop Shop for Everything
        </h1>
        <p className="text-lg text-gray-400 mb-6">
          Discover the best deals on top-quality products
        </p>
        <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-full font-bold transition-all duration-300">
          Start Shopping
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* ✅ Carousel */}
        <div className="md:col-span-2 row-span-2 bg-gradient-to-r from-[#FF6F00] to-[#FFA500] p-6 rounded-lg shadow-lg text-white flex items-center justify-center text-2xl font-bold min-h-[300px] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl relative">
          <Carousel products={products} />
          <div className="absolute bottom-0 left-6 bg-black/60 px-4 py-2 rounded-md">
            <p className="text-white">Explore now →</p>
          </div>
        </div>

        {/* ✅ Category */}
        <div className="col-span-1 bg-[#1a1a1a] border border-gray-700 text-white p-4 rounded-lg shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <Category />
        </div>

        {/* ✅ List of Products */}
        <div className="col-span-1 bg-[#1a1a1a] border border-gray-700 text-white p-4 rounded-lg shadow-md overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <ListOfProduct products={products} />
        </div>

        {/* ✅ Trending Products */}
        <div className="col-span-full bg-[#1a1a1a] border border-gray-700 text-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
          <h2 className="text-xl font-semibold mb-4 tracking-wide">
            🔥 Trending Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-[#121212] border border-gray-700 p-4 rounded-lg shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg relative"
              >
                {/* ✅ Shimmer Effect */}
                {!product.imageUrl ? (
                  <div className="animate-pulse bg-gray-800 h-40 w-full rounded-lg"></div>
                ) : (
                  <img
                    src={product.imageUrl}
                    alt={`Product ${product.id}`}
                    className="w-full h-40 object-cover rounded-lg mb-3 transition-transform duration-300 hover:scale-105 hover:brightness-90"
                  />
                )}

                {/* ✅ Discount Badge */}
                {product.discount && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-sm px-2 py-1 rounded">
                    {product.discount}% OFF
                  </div>
                )}

                <div className="flex items-center justify-between w-full mt-2">
                  {/* Price */}
                  <p className="text-white text-lg font-semibold tracking-wide">
                    ₹ {product.price}
                  </p>

                  {/* Name with Truncate + Tooltip */}
                  <div className="max-w-[60%] overflow-hidden text-ellipsis whitespace-nowrap">
                    <span 
                      className="text-gray-300 font-medium text-base hover:text-white transition-all duration-300" 
                      title={product.name}
                    >
                      {product.name}
                    </span>
                  </div>
              </div>


                <button className="mt-3 w-full bg-gradient-to-r from-[#FF6F00] to-[#FFA500] text-black font-semibold py-2 rounded-lg transition-all duration-300 hover:from-[#FFA500] hover:to-[#FF6F00] hover:scale-105 hover:shadow-lg">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>

          {/* ✅ Load More Button */}
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md mt-4">
            Load More
          </button>
        </div>
      </div>
    </div>
  )
}

export default MainContent