/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

function Carousel({ products }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (products.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [products]);

  return (
    <div className="w-full h-[30vh] sm:h-[40vh] md:h-[50vh] lg:h-[60vh] relative overflow-hidden rounded-[24px]">
    {products.map((product, i) => (
      <div 
        key={product._id} 
        className={`w-full h-full absolute transition-opacity duration-700 ${
          i === index ? "opacity-100 z-10" : "opacity-0 z-0"
        }`}
      >
        {/* ✅ Image */}
        <img
          src={product.imageUrl}
          alt="Carousel Image"
          className="w-full h-full object-cover rounded-[24px]"
        />
  
        {/* ✅ Brand Name Overlay */}
        <span 
          className="absolute bottom-4 left-4 text-[#FF6F00] bg-black/50 px-4 py-1 rounded-md font-bold uppercase text-sm tracking-wide shadow-md"
        >
          {product.brand}
        </span>
      </div>
    ))}
  
    {/* ✅ Custom Indicators */}
    <div className="absolute bottom-4 flex gap-2 justify-center w-full">
      {products.map((_, i) => (
        <span
          key={i}
          className={`w-3 h-3 rounded-full transition-all ${
            i === index ? "bg-[#FF6F00] scale-125" : "bg-gray-500"
          }`}
        />
      ))}
    </div>
  
    {/* ✅ Left Button */}
    <button
      onClick={() =>
        setIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length)
      }
      className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#FF6F00] hover:bg-[#e65c00] text-white p-2 rounded-full shadow-md z-20"
    >
      ❮
    </button>
  
    {/* ✅ Right Button */}
    <button
      onClick={() =>
        setIndex((prevIndex) => (prevIndex + 1) % products.length)
      }
      className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#FF6F00] hover:bg-[#e65c00] text-white p-2 rounded-full shadow-md z-20"
    >
      ❯
    </button>
  </div>
  
  );
}

export default Carousel;
