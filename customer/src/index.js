import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieparser from "cookie-parser";
import { PORT } from "./config/config.js";
import log from "./utils/logHandler.js";
import connectDb from "./database/connect.js";
import errorHandler from "./utils/errorHandler.js";
import {customerRouter} from "./routes/router.js"
import { consumeRabbitMQEvent, initializeRabbitMQ } from "./queue/rabbitmq.js";
import { addWishlistToCustomer, clearWishlistToCustomer, deleteWishlistToCustomer } from "./eventHandlers/wishlist.eventHandler.js";
import { addCartToCustomer, clearCartToCustomer, deleteCartToCustomer } from "./eventHandlers/cart.eventHandler.js";
import { addOrderToCustomer, createOrderFromCheckout, deleteOrderToCustomer, processOrder } from "./eventHandlers/order.eventHandler.js";
import { handleProductDeletion, handleProductUpdation } from "./eventHandlers/product.eventHandler.js";
import notificationRouter from "./routes/notification.router.js";



connectDb();

const app = express();

//middlewares

app.use(express.json())
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  };
  
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(helmet());
app.use(cookieparser());
app.use(errorHandler);

app.use("/api/customers",customerRouter);
app.use("/api/notifications",notificationRouter);


async function initializeCustomerService(){
    try {
        
        await initializeRabbitMQ();

        //consume events

        //wishlist
        await consumeRabbitMQEvent("wishlist.itemAdded", addWishlistToCustomer);
        await consumeRabbitMQEvent("wishlist.itemRemoved", deleteWishlistToCustomer);
        await consumeRabbitMQEvent("wishlist.cleared", clearWishlistToCustomer);


        //cart
        await consumeRabbitMQEvent("cart.add", addCartToCustomer);
        await consumeRabbitMQEvent("cart.reduceQuantity", deleteCartToCustomer);
        await consumeRabbitMQEvent("cart.delete", clearCartToCustomer);

        //order
        await consumeRabbitMQEvent("order.place",addOrderToCustomer)
        await consumeRabbitMQEvent("order.cancel",deleteOrderToCustomer);
        await consumeRabbitMQEvent("order.processed",processOrder);
        await consumeRabbitMQEvent("order.checkout",createOrderFromCheckout);

        //Product
        await consumeRabbitMQEvent("product.delete",handleProductDeletion);
        await consumeRabbitMQEvent("product.update",handleProductUpdation);

        app.listen(PORT,()=>{
            log.info(`Customer service is running on ${PORT}`);
        })
    } catch (error) {
        log.error("Failed to connect to server",error);
        process.exit(1);
    }
}

initializeCustomerService();

process.on("unhandledRejection",(reason,promise)=>{
    log.error("unhandled Rejection at",promise,"reason",reason);
})  