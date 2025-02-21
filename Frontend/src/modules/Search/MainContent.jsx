/* eslint-disable react/prop-types */
import ProductCard from "../common/ProductCard"

function MainContent({products}) {
  return (
    <div className="w-[70%] h-full flex flex-wrap gap-4 p-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

export default MainContent