
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    description: { type: String, trim: true },
    imageUrl: { type: String, },
    price: { type: Number, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    category: { type: String, trim: true },
    brand: { type: String, trim: true },
    tags: [{ type: String, lowercase: true, trim: true }],
    searchKeywords: [{ type: String, lowercase: true, trim: true }],
  },
  { timestamps: true }
);

// **Indexes for better search performance**
productSchema.index({ name: "text", description: "text", tags: "text" ,searchKeywords:"text"});

productSchema.index({ tags: 1 });
productSchema.index({ searchKeywords: 1 });

//By default, virtuals are not included in JSON

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });


// **Virtual field for final price after discount**
productSchema.virtual("finalPrice").get(function () {
  return this.price - (this.price * this.discount) / 100;
});

const Product = mongoose.model("Product", productSchema);

export default Product;
