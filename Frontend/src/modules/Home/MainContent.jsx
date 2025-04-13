import { useEffect, useState } from "react";
import Carousel from "./Carousel";
import Category from "./Category";
import ListOfProduct from "./ListOfProduct";
import { getDiscountedProducts, getLatestProducts, getRandomProducts } from "../../services/useProduct";
import { GetRecommendations } from "../../services/useAuth";
import toast from "react-hot-toast";
import {useSelector} from "react-redux";
import Spinner from "../common/Spinner";

function MainContent() {

  const [isLoading, setIsLoading] = useState(true);

  const {currentCustomer} = useSelector((state)=>state.customer);


  const [latestProducts,setLatestProducts] = useState([]);
  const [suggestedProducts,setSuggestedProducts] = useState([]);
  const [randomProducts ,setRandomProducts] = useState([]);
  const [discountedProducts ,setDiscountedProducts] = useState([]);
  const [recommendedOrderedProducts ,setRecommendedOrderedProducts] = useState([]);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const data = await getLatestProducts();
        if (data.success) {
          setLatestProducts(data.products);
        } else {
          toast.error(data.message || "Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Something went wrong");
      }
    };
  
    const fetchRecommendation = async () => {
      try {
        const response = await GetRecommendations(currentCustomer.id);
        if (response.success) {
          setSuggestedProducts(response.products);
          console.log("and whats going on overwhere at wishlist",response.products);
        } else {
          toast.error(response.message || "Failed to fetch recommendations");
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        toast.error("Something went wrong while fetching recommendations");
      }
    };

    const fetchOrderedRecommendation = async () => {
      try {
        const response = await GetRecommendations(currentCustomer.id);
        if (response.success) {
          setRecommendedOrderedProducts(response.products);
          console.log("and whats going on overwhere at orders",response.products);
        } else {
          toast.error(response.message || "Failed to fetch recommendations");
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        toast.error("Something went wrong while fetching recommendations");
      }
    };
  
    const fetchRandoms = async () => {
      try {
        const response = await getRandomProducts();
        if (response.success) {
          setRandomProducts(response.products);
        } else {
          toast.error(response.message || "Failed to fetch random products");
        }
      } catch (error) {
        console.error("Error fetching randoms:", error);
        toast.error("Something went wrong while fetching randoms");
      }
    };

    const fetchDiscounted = async () => {
      try {
        const response = await getDiscountedProducts();
        if (response.success) {
          setDiscountedProducts(response.products);
        } else {
          toast.error(response.message || "Failed to fetch random products");
        }
      } catch (error) {
        console.error("Error fetching randoms:", error);
        toast.error("Something went wrong while fetching randoms");
      }
    };
  
    const fetchAllData = async () => {
      setIsLoading(true);

      await Promise.all([
        fetchLatestProducts(),
        fetchRecommendation(),
        fetchOrderedRecommendation(),
        fetchRandoms(),
        fetchDiscounted(),
      ]);

      setIsLoading(false);
    };
  
    fetchAllData(); // trigger the parallel calls
  }, []);

  return (
    <>
    {isLoading ? (
    <div className="min-h-screen w-full flex items-center justify-center bg-black text-white">
    <Spinner/>
    </div>
    ):(
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
          <Carousel products={randomProducts}/>
        </div>

        {/* ✅ Category Section */}
        <div className="md:col-span-3 md:row-span-1">
          <Category />
        </div>

        {/* ✅ New Arrivals */}
        <div className="md:col-span-3 row-span-1 bg-[#121212] p-6 rounded-lg shadow-md hover:scale-105 transition-transform">
          <h2 className="text-xl font-semibold mb-2">🛒 New Arrivals</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            {latestProducts.slice(0, 4).map((product) => (
              <div key={product._id} className="flex-shrink-0 w-36 sm:w-40 md:w-44 bg-[#1e1e1e] rounded-xl shadow-md p-3 mx-2">
              {!product.imageUrl ? (
                <div className="animate-pulse bg-gray-700 h-32 w-full rounded-lg"></div>
              ) : (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
              )}

              <div className="mt-3 space-y-1">
                <p className="text-sm font-medium text-white truncate">{product.name}</p>
                <p className="text-xs text-gray-400 truncate">Brand: {product.brand}</p>
                <p className="text-sm text-[#FFB74D] font-semibold">₹ {product.price}</p>

                <button className="mt-2 w-full bg-[#FF6F00] hover:bg-[#e65c00] text-white text-sm font-semibold py-1.5 rounded-md transition-all duration-200">
                  Add to Wishlist
                </button>
              </div>
            </div>
            ))}
          </div>
        </div>

        {/*Frequently Bought together */}
        <div className="md:col-span-3 row-span-1 bg-[#121212] p-6 rounded-lg shadow-md hover:scale-105 transition-transform">
          <h2 className="text-xl font-semibold mb-2">🚀 Frequently Bought Together</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            {recommendedOrderedProducts.slice(4, 8).map((product) => (
              <div key={product.id} className="overflow-y-hidden flex-shrink-0 w-36 sm:w-40 md:w-44 bg-[#1e1e1e] rounded-xl shadow-md p-3 mx-2">
                {!product.imageUrl ? (
                  <div className="animate-pulse bg-gray-700 h-32 w-full rounded-lg"></div>
                ) : (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}
                <div className="mt-3 space-y-1">
                  <p className="text-sm font-medium text-white truncate">{product.name}</p>
                  <p className="text-xs text-gray-400 truncate">Brand: {product.brand}</p>
                  <p className="text-sm text-[#FFB74D] font-semibold">₹{product.price}</p>

                  <button className="mt-2 w-full bg-[#FF6F00] hover:bg-[#e65c00] text-white text-sm font-semibold py-1.5 rounded-md transition-all duration-200">
                    Add to Cart
                  </button>
                </div> 
              </div>
            ))}
          </div>
        </div>

        {/* ✅ List of Products */}
        <div className="md:col-span-9 row-span-2">
          <ListOfProduct  products={suggestedProducts}/>
        </div>

        {/* ✅ Updated Text Section */}
        <div className="md:col-span-3 row-span-1">
        <p className="leading-snug text-white font-medium space-y-1">
          <span className="text-[#f39c12] text-xl font-semibold">Welcome</span>
          <span className="text-sm ml-1">to your ultimate shopping destination.</span>
          <span className="text-[#e67e22] text-xs ml-1">Discover</span>
          <span className="text-sm ml-1">exclusive deals and top-rated products.</span>
          <span className="text-[#e74c3c] text-2xl font-bold block mt-2">Explore</span>
          <span className="text-[#ecf0f1] text-sm ml-1">our curated collections.</span>
          <span className="text-[#f39c12] text-lg font-semibold block mt-2">Uncover</span>
          <span className="text-[#bdc3c7] text-xs ml-1">hidden treasures and unique finds.</span>
          <span className="text-[#ecf0f1] text-[0.65rem] ml-1">Shop Now</span>
          <span className="text-sm ml-1">for the latest trends and savings!</span>
        </p>
        </div>
      </div>

      {/* ✅  Discounted Products */}
      <div className="mt-12 px-4 md:px-10 lg:px-20">
        <div className="p-6 bg-[#1a1a1a] rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4">🔥 Discounted Deals </h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 snap-x snap-mandatory">
            {discountedProducts.length > 0 ? (discountedProducts.map((product) => (
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
                <button className="mt-3 w-full bg-[#FF6F00] text-white font-semibold py-2 rounded-lg hover:bg-[#e65c00] transition-all">
                  Add to Cart
                </button>
              </div>
            ))):(
              <div className="flex flex-col items-center justify-center w-full py-10 text-center text-gray-400">
                <div className="text-4xl mb-4 animate-bounce">🛍️</div>
                <h3 className="text-xl font-semibold mb-1">No Deals Right Now</h3>
                <p className="text-sm max-w-md">
                  We’re freshening up the discounts! Check back soon for exciting offers and hot deals. 🔥
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    )}
    </>
  )
}

export default MainContent;
