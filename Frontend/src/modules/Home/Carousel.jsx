import { useEffect, useState } from "react";

const tempImagesOfCarousel =[
    {
        id:1,
        url:"https://images.unsplash.com/photo-1739239130013-f8d430e8a147?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id:2,
        url:"https://images.unsplash.com/photo-1735399570412-fe0fd40fdcd6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id:3,
        url:"https://images.unsplash.com/photo-1700183094896-951ee0f43c58?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id:4,
        url:"https://images.unsplash.com/photo-1729287124143-77c73e2f8c46?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id:5,
        url:"https://images.unsplash.com/photo-1707996631108-ab1108f3a8fb?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id:6,
        url:"https://images.unsplash.com/photo-1707996631817-cb5b533fb079?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id:7,
        url:"https://plus.unsplash.com/premium_photo-1698183570604-29e39927c78a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Ds",
    },
]


function Carousel() {
    const [index, setIndex] = useState(0);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % tempImagesOfCarousel.length);
      }, 3000); // Change image every 3 seconds
  
      return () => clearInterval(interval); // Cleanup when component unmounts
    }, []);
  
    return (
      <div className="w-full h-80 flex justify-center items-center bg-gray-100">
        <img
          src={tempImagesOfCarousel[index].url}
          alt="Carousel Image"
          className="w-full h-full object-cover rounded-lg shadow-lg transition-opacity duration-500"
        />
      </div>
    );
  }
  

export default Carousel