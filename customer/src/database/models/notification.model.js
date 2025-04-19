import  { Schema,model }  from "mongoose";

const notificationSchema = new Schema({
    customerId: { type:Schema.Types.ObjectId, ref: 'Customer', required: true },
    message: String,
    name:String,
    imageUrl: String,
    brand:String,
    productId: { type:Schema.Types.ObjectId, ref: 'Customer', required: true },
    priceAtPurchase: Number,
    quantity: Number,
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, expires: '1d' } 
  });

  
const Notification = model('Notification', notificationSchema);

export default Notification;