import { useCallback, useEffect, useState } from "react";
import Carousel from "./Carousel";
import Category from "./Category";
import WishlistRecommendations  from "./WishlistRecommendations";
import { getDiscountedProducts, getLatestProducts, getRandomProducts } from "../../services/useProduct";
import { GetOrderedRecommendations, GetRecommendations } from "../../services/useAuth";
import toast from "react-hot-toast";
import {useSelector} from "react-redux";
import Spinner from "../common/Spinner";
import { addToCart, addToWishlist } from "../../services/useShopping";
import Lottie from "lottie-react";
import animationJson from "../../assets/Animation - 1744810780956.json";
import LatestProducts from "./LatestProducts";
import OrderedRecommendations from "./OrderedRecommendations";
import DiscountedProducts from "./DiscountedProducts";
import Hero from "./Hero";


function MainContent() {

  const [isLoading, setIsLoading] = useState(true);

  const {currentCustomer} = useSelector((state)=>state.customer);


  const [latestProducts,setLatestProducts] = useState([]);
  const [suggestedProducts,setSuggestedProducts] = useState([]);
  const [randomProducts ,setRandomProducts] = useState([]);
  const [discountedProducts ,setDiscountedProducts] = useState([]);
  const [recommendedOrderedProducts ,setRecommendedOrderedProducts] = useState([]);


  const fetchHandler = async (apiFn, setter, fallbackMessage) => {
    try {
      const response = await apiFn();
      if (response.success) {
        setter(response.products);
      } else {
        toast.error(response.message || fallbackMessage);
      }
    } catch (error) {
      console.error(fallbackMessage, error);
      toast.error("Something went wrong");
    }
  };

  const fetchLatestProducts = useCallback(() => fetchHandler(getLatestProducts, setLatestProducts, "Failed to fetch products"), []);
  const fetchRecommendation = useCallback(() => fetchHandler(() => GetRecommendations(currentCustomer.id), setSuggestedProducts, "Failed to fetch recommendations"), [currentCustomer.id]);
  const fetchOrderedRecommendation = useCallback(() => fetchHandler(() => GetOrderedRecommendations(currentCustomer.id), setRecommendedOrderedProducts, "Failed to fetch recommendations"), [currentCustomer.id]);
  const fetchRandoms = useCallback(() => fetchHandler(getRandomProducts, setRandomProducts, "Failed to fetch random products"), []);
  const fetchDiscounted = useCallback(() => fetchHandler(getDiscountedProducts, setDiscountedProducts, "Failed to fetch discounted products"), []);


  useEffect(() => {
    if (!currentCustomer?.id) return;
  
    setIsLoading(true);
    
    Promise.all([
      fetchLatestProducts(),
      fetchRecommendation(),
      fetchOrderedRecommendation(),
      fetchRandoms(),
      fetchDiscounted(),
    ]).finally(() => setIsLoading(false));
  }, [currentCustomer]);

  const handleAddToWishlist = async(productId,name,imageUrl,brand,price)=>{

      const response = await addToWishlist(productId,name,imageUrl,brand,price);

      if(response.success){
        toast.success("successfully added to wishlist");
      }else{
        toast.error(response.error);
      }
  }

  const handleAddToCart = async(productId,name,imageUrl,brand,price)=>{

    const response = await addToCart(productId,name,imageUrl,brand,price);

    if(response.success){
      toast.success("successfully added to Cart");
    }else{
      toast.error(response.error);
    }
  }

  return (
    <>
    {isLoading ? (
    <div className="min-h-screen w-full flex items-center justify-center bg-black text-white">
    <Spinner/>
    </div>
    ):(
      <div className="min-h-screen w-full bg-gradient-to-br from-black to-[#1a1a1a] text-white">
      {/* ✅ Hero Section */}
       <Hero/>

      {/* ✅ Bento Box Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 px-4 md:px-10 lg:px-20">
        {/* ✅ Big Carousel */}
        <div className="md:col-span-6 row-span-2">
          <Carousel products={randomProducts}/>
        </div>

        {/* ✅ Category Section */}
        <div className="md:col-span-3 md:row-span-1">
          <div className="bg-[#1f1f1f] p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-white border-b border-gray-700 pb-2">
            Explore Featured Categories
          </h2>
          <Category />
          </div>
        </div>

        {/* ✅ New Arrivals */}
        <div className="md:col-span-3 row-span-1 border-4 border-[#FF6F00] bg-[#121212] p-6 rounded-lg shadow-md">
        <LatestProducts latestProducts={latestProducts} handleAddToWishlist={handleAddToWishlist}/>
        </div>

        {/*Frequently Bought together */}
        <div className="md:col-span-3 row-span-1 bg-[#121212] p-6 rounded-lg shadow-md">
          <OrderedRecommendations recommendedOrderedProducts={recommendedOrderedProducts} handleAddToCart={handleAddToCart}/>
        </div>

        
        <div className="md:col-span-9 row-span-2">
          <WishlistRecommendations   products={suggestedProducts} handleAddToWishlist={handleAddToWishlist}/>
        </div>

       
        <div className="md:col-span-3 row-span-1 border-6 border-[#FF6F00] rounded-xl overflow-hidden shadow-lg flex items-center justify-center bg-gray-900 p-4">
          <Lottie
            animationData={animationJson}
            loop
            autoplay
            className="w-full max-w-[400px] h-auto"
          />
        </div>
      </div>

      {/* ✅  Discounted Products */}
      <div className="mt-12 px-4 md:px-10 lg:px-20">
      <DiscountedProducts discountedProducts={discountedProducts} handleAddToCart={handleAddToCart}/>
      </div>
    </div>
    )}
    </>
  )
}

export default MainContent;
