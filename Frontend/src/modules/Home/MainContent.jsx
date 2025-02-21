import Carousel from "./Carousel"
import Category from "./Category"
import ListOfProduct from "./ListOfProduct"


const products = [
  { id: 1, url: "https://example.com/product1.jpg", price: 20 },
  { id: 2, url: "https://example.com/product2.jpg", price: 80 },
  { id: 3, url: "https://example.com/product3.jpg", price: 40 },
  { id: 4, url: "https://example.com/product4.jpg", price: 50 },
  { id: 5, url: "https://example.com/product5.jpg", price: 60 },
];


function MainContent() {
  return (
    <div className="w-full min-h-screen py-6 px-4 md:px-10 lg:px-20 flex flex-col gap-6">
    
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        <div className="md:col-span-2 lg:col-span-2 row-span-2 bg-gradient-to-r from-[#FF6F00] to-[#e65c00] p-6 rounded-lg shadow-lg text-white flex items-center justify-center text-2xl font-bold min-h-[250px]">
          <Carousel />
        </div>

      
        <div className="bg-gray-900 text-white p-4 rounded-lg shadow-md w-full 
          md:max-h-[450px] lg:max-h-[500px] md:overflow-y-auto lg:overflow-y-auto
          scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
         <ListOfProduct products={products} />
        </div> 

        
        <div className="bg-gray-700 text-white p-4 rounded-lg shadow-md w-full">
          <Category />
        </div>

       
        <div className="col-span-full bg-gray-800 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Trending Products 🔥</h2>
          <ListOfProduct products={products} />
        </div>
      </div>
    </div>
  )
}

export default MainContent