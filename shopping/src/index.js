import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieparser from "cookie-parser";
import { PORT } from "./config/config.js";
import log from "./utils/logHandler.js";
import connectDb from "./database/connect.js";
import errorHandler from "./utils/errorHandler.js";
import {cartRouter,orderRouter,wishlistRouter} from "./routes/router.js";
import { consumeRabbitMQEvent, initializeRabbitMQ } from "./Queue/rabbitmq.js";
import { handleProductDeletion, handleProductUpdation } from "./eventHandlers/product.eventHandler.js";
import { handleUserDeletion } from "./eventHandlers/user.eventHandler.js";


connectDb();

const app = express();

//middlewares
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};


app.use(express.json())
app.use(cors(corsOptions));
app.use(helmet());
app.use(cookieparser());
app.use(errorHandler);

app.use("/api/cart", cartRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/orders", orderRouter);


async function initializeShoppingService(){
   try {

    await initializeRabbitMQ();

    //Products updates
    await consumeRabbitMQEvent("product.delete",handleProductDeletion);

    await consumeRabbitMQEvent("product.update",handleProductUpdation);

    //user updates
    await consumeRabbitMQEvent("user.delete",handleUserDeletion);

    app.listen(PORT,()=>{
        log.info(`Shopping service is running on ${PORT}`);
    })

   } catch (error) {
     log.error("Failed to connect to server",error);
     process.exit(1);
   } 
}


initializeShoppingService();

process.on("unhandledRejection",(reason,promise)=>{
    log.error("unhandled Rejection at",promise,"reason",reason);
})  