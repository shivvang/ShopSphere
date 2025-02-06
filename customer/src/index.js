import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieparser from "cookie-parser";
import { PORT } from "./config/config.js";
import log from "./utils/logHandler.js";
import connectDb from "./database/connect.js";
import errorHandler from "./utils/errorHandler.js";
import {customerRouter,addressRouter} from "./routes/router.js"
import { consumeRabbitMQEvent, initializeRabbitMQ } from "./queue/rabbitmq.js";

connectDb();

const app = express();

//middlewares

app.use(express.json())
app.use(cors());
app.use(helmet());
app.use(cookieparser());
app.use(errorHandler);

app.use("/api/customers",customerRouter);
app.use("/api/addresses",addressRouter);


async function initializeCustomerService(){
    try {
        
        await initializeRabbitMQ();

        //consume events

        await consumeRabbitMQEvent("some routing key",callbackfn());

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