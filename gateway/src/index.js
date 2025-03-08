import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieparser from "cookie-parser";
import helmet from "helmet";
import express from "express";
import errorHandler from "./utils/errorHandler.js";
import Redis from "ioredis";
import {rateLimit} from "express-rate-limit"
import { ApiError } from "../src/utils/ApiError.js";
import {RedisStore} from "rate-limit-redis";
import proxy from "express-http-proxy";
import validatetoken from "./Middleware/authenticateUser.js";
import log from "./utils/logHandler.js";

const app = express();
const PORT = process.env.PORT || 7000;
const redisClient = new Redis(process.env.REDIS_URL);

const apiRateLimiter = rateLimit({
    windowMs:15*60*1000,  
    max:100,
    standardHeaders:true,
    legacyHeaders:false,
    handler:(req,res,next)=>{
        log.warn(`sensitive end point rate limit exceeded for Ip:${req.ip}`);
        return next(new ApiError(429,"too many requests"));
    },
    store: new RedisStore({
        sendCommand:(...args)=>redisClient.call(...args)
    }) 
})

app.use(helmet());
app.use(express.json());
const corsOptions = {
    origin: process.env.FRONTEND_URL,  
    credentials: true,                 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"], 
  };
  
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); 

app.use(cookieparser());
app.use(errorHandler);
app.use(apiRateLimiter);

app.use((req,res,next)=>{
log.info(`Recieved ${req.method} request to ${req.url}`);
log.info(`Request Body , ${req.body}`);
next();
})


const proxyOptions = {
    proxyReqPathResolver:(req)=>{
        return req.originalUrl.replace(/^\/v1/,"/api")
    },
    proxyErrorHandler:(req,res,next,err)=>{
        log.error(`Proxy Error : ${err.message}`);
        return next(new ApiError(500,"Internal server error",err.message));
    }
}

//Customer service

app.use("/v1/customers",proxy(process.env.CUSTOMER_SERVICE_URL,{
    ...proxyOptions,
    proxyReqOptDecorator:(proxyReqOpts,srcReq)=>{
        proxyReqOpts.headers["Content-Type"] = "application/json";
        return proxyReqOpts;
    },
    userResDecorator:(proxyRes,proxyResData,userReq,userRes)=>{
        log.info(`Response received from Customer service : ${proxyRes.statusCode}`);
        return proxyResData;
    }
}))

app.use("/v1/addresses",proxy(process.env.CUSTOMER_SERVICE_URL,{
    ...proxyOptions,
    proxyReqOptDecorator:(proxyReqOpts,srcReq)=>{
        proxyReqOpts.headers["Content-Type"] = "application/json"
        return proxyReqOpts;
    },
    userResDecorator:(proxyRes,proxyResData,userReq,userRes)=>{
        log.info(`Response received from Customer service : ${proxyRes.statusCode}`)
        return proxyResData;
    }
}))

//Product service 

app.use("/v1/products",proxy(process.env.PRODUCT_SERVICE_URL,{
    ...proxyOptions,
    proxyReqOptDecorator:(proxyReqOpts,srcReq)=>{
        proxyReqOpts.headers["Content-Type"] = "application/json"
        return proxyReqOpts;
    },
    userResDecorator:(proxyRes,proxyResData,userReq,userRes)=>{
        log.info(`Response received from Product service : ${proxyRes.statusCode}`)
        return proxyResData;
    }
}))


app.use("/v1/seller",proxy(process.env.PRODUCT_SERVICE_URL,{
    ...proxyOptions,
    proxyReqOptDecorator:(proxyReqOpts,srcReq)=>{
        proxyReqOpts.headers["Content-Type"] = "application/json"
        return proxyReqOpts;
    },
    userResDecorator:(proxyRes,proxyResData,userReq,userRes)=>{
        log.info(`Response received from Product service : ${proxyRes.statusCode}`)
        return proxyResData;
    }
}))


//Shopping service 

app.use("/v1/cart",validatetoken,proxy(process.env.SHOPPING_SERVICE_URL,{
    ...proxyOptions,
    proxyReqOptDecorator:(proxyReqOpts,srcReq)=>{
        proxyReqOpts.headers["Content-Type"] = "application/json",
        proxyReqOpts.headers["x-user-id"] = srcReq.user.userId
        return proxyReqOpts;
    },
    userResDecorator:(proxyRes,proxyResData,userReq,userRes)=>{
        log.info(`Response received from Shopping service : ${proxyRes.statusCode}`)
        return proxyResData;
    }
}))

app.use("/v1/wishlist",validatetoken,proxy(process.env.SHOPPING_SERVICE_URL,{
    ...proxyOptions,
    proxyReqOptDecorator:(proxyReqOpts,srcReq)=>{
        proxyReqOpts.headers["Content-Type"] = "application/json",
        proxyReqOpts.headers["x-user-id"] = srcReq.user.userId
        return proxyReqOpts;
    },
    userResDecorator:(proxyRes,proxyResData,userReq,userRes)=>{
        log.info(`Response received from Shopping service : ${proxyRes.statusCode}`)
        return proxyResData;
    }
}))


app.use("/v1/orders",validatetoken,proxy(process.env.SHOPPING_SERVICE_URL,{
    ...proxyOptions,
    proxyReqOptDecorator:(proxyReqOpts,srcReq)=>{
        proxyReqOpts.headers["Content-Type"] = "application/json",
        proxyReqOpts.headers["x-user-id"] = srcReq.user.userId
        return proxyReqOpts;
    },
    userResDecorator:(proxyRes,proxyResData,userReq,userRes)=>{
        log.info(`Response received from Shopping service : ${proxyRes.statusCode}`)
        return proxyResData;
    }
}))


app.listen(PORT,()=>{
    log.info(`Api Gateway is Running on Port ${PORT}`);
    log.info(`Customer service running on  ${process.env.CUSTOMER_SERVICE_URL}`);
    log.info(`Product service running on  ${process.env.PRODUCT_SERVICE_URL}`);
    log.info(`Shopping service running on  ${process.env.SHOPPING_SERVICE_URL}`);
    log.info(`Redis is running on  ${process.env.REDIS_URL}`);
})