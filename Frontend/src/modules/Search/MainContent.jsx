/* eslint-disable react/prop-types */
import ProductCard from "../common/ProductCard"
import noMoreProduct from "../../assets/NoMoreProduct.png"
import React from 'react'

// eslint-disable-next-line react/display-name
const MainContent = React.memo(({ products }) => {
  const isEmpty = products.length === 0;
  return (
    <div className="w-[70%] h-full flex flex-wrap gap-4 p-4">
      {isEmpty ? (
        <div className="w-full flex flex-col items-center justify-center mt-20 text-gray-500">
          <img
            src={noMoreProduct}
            alt="No products"
            className="w-32 h-32 mb-4 opacity-70"
          />
          <p className="text-lg font-semibold">No products found</p>
          <p className="text-sm text-gray-400">
            Try adjusting your filters or search again.
          </p>
        </div>
      ) : (
        products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))
      )}
    </div>
  );
});


export default MainContent