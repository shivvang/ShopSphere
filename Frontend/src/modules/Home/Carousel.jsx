/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";



function Carousel({products}) {
    const [index, setIndex] = useState(0);
  
    useEffect(() => {
      if (products.length === 0) return;
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % products.length);
      }, 3000); // Change image every 3 seconds
  
      return () => clearInterval(interval); // Cleanup when component unmounts
    }, [products]);
  
    return (
      <div className="w-full h-80 flex justify-center items-center bg-gray-100">
        <img
          src={products[index]?.imageUrl}
          alt="Carousel Image"
          className="w-full h-full object-cover rounded-lg shadow-lg transition-opacity duration-500"
        />
      </div>
    );
  }
  

export default Carousel