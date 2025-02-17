/* eslint-disable react/prop-types */


  const Product = ({ product }) => {
    return (
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden flex gap-4 p-4 w-full max-w-lg border border-gray-200">
        {/* Product Image */}
        <div className="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={product.imageUrl || "https://via.placeholder.com/150"}
            alt={product.name}
          />
        </div>
  
        {/* Product Info */}
        <div className="flex flex-col justify-between flex-1">
          <div>
            <h1 className="text-xl font-bold text-black">{product.name}</h1>
            <p className="text-gray-600 text-sm">{product.description}</p>
          </div>
  
          {/* Pricing & Discount */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#FF6F00]">
              ₹{(product.price - (product.price * product.discount) / 100).toFixed(2)}
            </h2>
            {product.discount > 0 && (
              <span className="bg-[#FF6F00] text-white text-xs px-2 py-1 rounded-md">
                {product.discount}% OFF
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default Product;
  