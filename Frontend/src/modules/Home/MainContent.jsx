import Carousel from "./Carousel"
import Category from "./Category"
import ListOfProduct from "./ListOfProduct"


const products = [
  { id: 1, url: "https://example.com/product1.jpg", price: 20 },
  { id: 2, url: "https://example.com/product2.jpg", price: 80 },
  { id: 3, url: "https://example.com/product3.jpg", price: 40 },
  { id: 4, url: "https://example.com/product4.jpg", price: 50 },
  { id: 5, url: "https://example.com/product5.jpg", price: 60 }
];


function MainContent() {
  return (
    <div className="bg-gradient-to-br from-[#0d0d0d] to-[#1a1a1a]  w-full min-h-screen h-full  py-6 px-4 md:px-10 lg:px-20 flex flex-col gap-8 font-sans">

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      
      {/* Carousel */}
      <div className="md:col-span-2 row-span-2 bg-gradient-to-r from-[#FF6F00] to-[#FFA500] p-6 rounded-lg shadow-lg text-white flex items-center justify-center text-2xl font-bold min-h-[300px] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
        <Carousel />
      </div>

      {/* Category */}
      <div className="col-span-1 bg-[#1a1a1a] border border-gray-700 text-white p-4 rounded-lg shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
        <Category />
      </div>

      {/* List of Products */}
      <div className="col-span-1 bg-[#1a1a1a] border border-gray-700 text-white p-4 rounded-lg shadow-md md:max-h-[450px] lg:max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-lg">
        <ListOfProduct products={products} />
      </div>

      {/* Trending Products */}
      <div className="col-span-full bg-[#1a1a1a] border border-gray-700 text-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
        <h2 className="text-xl font-semibold mb-4 tracking-wide">🔥 Trending Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-[#121212] border border-gray-700 p-4 rounded-lg shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <img 
                src={product.url} 
                alt={`Product ${product.id}`} 
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <p className="text-white text-lg font-medium">${product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  )
}

export default MainContent