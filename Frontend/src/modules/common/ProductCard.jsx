/* eslint-disable react/prop-types */
function ProductCard({ product }) {
    return (
      <div className="border rounded-lg shadow-md p-4 w-64 bg-white">
        
        <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover rounded-md" />
  
        <h2 className="text-lg font-bold mt-2">{product.name}</h2>
  
       
        <p className="text-sm text-gray-500">Brand: {product.brand}</p>
  
       
        <div className="mt-2">
          {product.discount > 0 ? (
            <p className="text-red-500 font-bold">
              ${product.finalPrice.toFixed(2)} 
              <span className="text-gray-500 line-through text-sm ml-2">${product.price.toFixed(2)}</span>
            </p>
          ) : (
            <p className="font-bold">${product.price.toFixed(2)}</p>
          )}
        </div>
  
        <button className="mt-3 bg-[#FF6F00] text-white w-full py-2 rounded-lg hover:bg-[#e65c00]">
          Buy Now
        </button>
      </div>
    );
  }
  
  export default ProductCard;
  