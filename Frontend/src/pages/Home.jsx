
import { useEffect, useState } from "react";
import MainContent from "../modules/Home/MainContent";
import { getRandomProducts } from "../services/useProduct";
import {toast} from "react-hot-toast";



function Home() {

  const [products,setProducts] = useState([]);

  useEffect(() => {
    const getRandomProduct = async () => {
      try {
        const data = await getRandomProducts();
  
        if (data.success) {
          toast.success("Successfully fetched");
          setProducts(data.products);
        } else {
          toast.error(data.message || "Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Something went wrong");
      }
    };
  
    getRandomProduct(); 
  }, []);

  return (
    <div className="flex flex-col min-h-screen  w-screen">
        <MainContent products={products}/>
    </div>
  )
}

export default Home 