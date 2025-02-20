import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieparser from "cookie-parser";
import { PORT } from "./config/config.js";
import log from "./utils/logHandler.js";
import connectDb from "./database/connect.js";
import errorHandler from "./utils/errorHandler.js";
import productRouter from "./routes/product.router.js";

connectDb();

const app = express();

//middlewares

app.use(express.json())
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  };
  
app.use(cors(corsOptions));
app.use(helmet());
app.use(cookieparser());
app.use(errorHandler);

app.use("/api/products",productRouter);



app.listen(PORT,()=>{
    log.info(`Product service is running on ${PORT}`);
})

process.on("unhandledRejection",(reason,promise)=>{
    log.error("unhandled Rejection at",promise,"reason",reason);
})  