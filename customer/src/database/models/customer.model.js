import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
    {
      email: {
        type: String,
        unique: true,
        required: true,
      },
      password: { 
        type: String,
        required: true,
      },
      phone: {
        type: Number,
        unique: true,
      },
      address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
      cart: [
        {
          product: {
            _id: { type: String, required: true },
            name: { type: String, required: true },
            photo: { type: String, default: "default.jpg" },
            price: { type: Number, required: true },
          },
          unit: { type: Number, required: true, min: 1 },
        },
      ],
      wishlist: [
        {
          _id: { type: String, required: true },
          name: { type: String, required: true },
          description: { type: String, required: true },
          photo: { type: String, required: true },
          available: { type: Boolean, required: true },
          price: { type: Number, required: true },
        },
      ],
      orders: [
        {
          _id: { type: String, required: true },
          amount: { type: Number, required: true },
          timeWhenOrdered: { type: Date, default: Date.now },
        },
      ],
    },
    {
      toJSON: {
        transform(doc, ret) {
          delete ret.password;
          delete ret.__v;
        },
      },
      timestamps: true,
    }
  );

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;