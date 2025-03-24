/* eslint-disable react/prop-types */
import Carousel from "./Carousel";
import Category from "./Category";
import ListOfProduct from "./ListOfProduct";

function MainContent({ products }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black to-[#1a1a1a] text-white">
      {/* ✅ Hero Section */}
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Your One-Stop Shop for Everything
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-6">
          Discover the best deals on top-quality products
        </p>
        <button className="bg-[#FF6F00] hover:bg-[#e65c00] px-6 py-3 rounded-full font-semibold transition-all">
          Start Shopping
        </button>
      </div>

      {/* ✅ Bento Box Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 px-4 md:px-10 lg:px-20">
        {/* ✅ Big Carousel */}
        <div className="md:col-span-6 row-span-2">
          <Carousel products={products} />
        </div>

        {/* ✅ Category Section */}
        <div className="md:col-span-3 md:row-span-1">
          <Category />
        </div>

        {/* ✅ New Arrivals */}
        <div className="md:col-span-3 row-span-1 bg-[#121212] p-6 rounded-lg shadow-md hover:scale-105 transition-transform">
          <h2 className="text-xl font-semibold mb-2">🛒 New Arrivals</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            {products.slice(0, 4).map((product) => (
              <div key={product._id} className="flex-shrink-0 w-32">
                {!product.imageUrl ? (
                  <div className="animate-pulse bg-gray-800 h-28 w-full rounded-lg"></div>
                ) : (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-28 object-cover rounded-lg"
                  />
                )}
                <p className="text-white text-sm font-semibold mt-1">
                  ₹ {product.price}
                </p>
                <span className="text-gray-400 truncate block text-xs">
                  {product.name}
                </span>
                <span className="text-[#FF6F00] text-sm font-bold uppercase tracking-wide shadow-md">
                  {product.brand}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ Flash Sales */}
        <div className="md:col-span-3 row-span-1 bg-[#121212] p-6 rounded-lg shadow-md hover:scale-105 transition-transform">
          <h2 className="text-xl font-semibold mb-2">🚀 Flash Sales</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            {products.slice(4, 8).map((product) => (
              <div key={product._id} className="flex-shrink-0 w-32">
                {!product.imageUrl ? (
                  <div className="animate-pulse bg-gray-800 h-28 w-full rounded-lg"></div>
                ) : (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-28 object-cover rounded-lg"
                  />
                )}
                <div className="mt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[#FF6F00] font-semibold text-sm">
                      ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                    </span>
                    <span className="text-gray-400 text-xs line-through">
                      ₹{product.price}
                    </span>
                  </div>
                  <span className="text-gray-400 truncate block text-xs">
                    {product.name}
                  </span>
                  <span className="text-[#FF6F00] text-sm font-bold uppercase tracking-wide shadow-md">
                    {product.brand}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ List of Products */}
        <div className="md:col-span-9 row-span-2">
          <ListOfProduct products={products} />
        </div>

        {/* ✅ Updated Text Section */}
        <div className="md:col-span-3 row-span-1">
          <p className="leading-snug text-white font-medium space-y-1">
            <span className="text-[#27ae60] text-xl font-semibold">Welcome</span>
            <span className="text-sm ml-1">to the ultimate shopping experience.</span>
            <span className="text-[#7f8c8d] text-xs ml-1">Discover</span>
            <span className="text-sm ml-1">top-rated products at unbeatable prices.</span>
            <span className="text-[#e67e22] text-2xl font-bold block mt-2">Explore</span>
            <span className="text-[#95a5a6] text-sm ml-1">our premium collections.</span>
            <span className="text-[#3498db] text-lg font-semibold block mt-2">Uncover</span>
            <span className="text-[#bdc3c7] text-xs ml-1">hidden gems and exclusive deals.</span>
            <span className="text-[#bdc3c7] text-[0.6rem] ml-1">Shop Now</span>
            <span className="text-sm ml-1">for the latest trends and savings!</span>
          </p>
        </div>
      </div>

      {/* ✅ Trending Products */}
      <div className="mt-12 px-4 md:px-10 lg:px-20">
        <div className="p-6 bg-[#1a1a1a] rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4">🔥 Trending Products</h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 snap-x snap-mandatory">
            {products.slice(0, 8).map((product) => (
              <div
                key={product._id}
                className="bg-[#121212] border border-gray-700 p-4 rounded-lg shadow-md w-56 flex-shrink-0 snap-start"
              >
                {!product.imageUrl ? (
                  <div className="animate-pulse bg-gray-800 h-40 w-full rounded-lg"></div>
                ) : (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                )}
                <div className="mt-2">
                  <p className="text-white font-semibold">
                    ₹ {product.price}
                  </p>
                  <span className="text-gray-400 truncate block">
                    {product.name}
                  </span>
                  <span className="text-[#FF6F00] text-sm font-bold uppercase tracking-wide shadow-md">
                    {product.brand}
                  </span>
                </div>
                <button className="mt-3 w-full bg-[#FF6F00] text-white font-semibold py-2 rounded-lg hover:bg-[#e65c00] transition-all">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainContent;
