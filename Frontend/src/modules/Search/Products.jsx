import Product from "./Product"


const products = [
    {
      name: "Wireless Headphones",
      description: "High-quality noise-canceling wireless headphones with deep bass.",
      imageUrl: "https://example.com/images/headphones.jpg",
      price: 199.99,
      discount: 10,
      category: "Electronics",
      brand: "Sony"
    },
    {
      name: "Gaming Mouse",
      description: "Ergonomic gaming mouse with customizable RGB lighting and high DPI sensor.",
      imageUrl: "https://example.com/images/gaming-mouse.jpg",
      price: 49.99,
      discount: 5,
      category: "Accessories",
      brand: "Logitech"
    },
    {
      name: "Smartwatch",
      description: "Feature-packed smartwatch with heart rate monitoring and GPS tracking.",
      imageUrl: "https://example.com/images/smartwatch.jpg",
      price: 129.99,
      discount: 15,
      category: "Wearables",
      brand: "Apple"
    },
    {
      name: "Mechanical Keyboard",
      description: "RGB backlit mechanical keyboard with blue switches for a tactile feel.",
      imageUrl: "https://example.com/images/mechanical-keyboard.jpg",
      price: 89.99,
      discount: 20,
      category: "Accessories",
      brand: "Razer"
    },
    {
      name: "4K Ultra HD Monitor",
      description: "27-inch 4K UHD monitor with HDR support and ultra-thin bezels.",
      imageUrl: "https://example.com/images/4k-monitor.jpg",
      price: 299.99,
      discount: 10,
      category: "Electronics",
      brand: "LG"
    }
  ];

  
function Products() {
  return (
    <div className="bg-[#FF6F00] min-h-screen flex flex-col items-center gap-6 p-6">
      {products.map((product, index) => (
        <Product key={index} product={product} />
      ))}
    </div>
  )
}

export default Products