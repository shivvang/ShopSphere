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
    <div className="w-full h-full py-4 px-44 flex flex-col gap-4 overflow-x-hidden">
      <Category/>
      <Carousel/>
      <ListOfProduct products={products} />
      <ListOfProduct products={products} />
    </div>
  )
}

export default MainContent