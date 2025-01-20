import mongoose  from "mongoose";

const addressSchema = new mongoose.Schema({
street: { type: String, required: true },
postalCode: { type: String, required: true },
city: { type: String, required: true },
state: { type: String },
country: { type: String, required: true },
userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
})

const Address = mongoose.model("Address", addressSchema);

export default Address;