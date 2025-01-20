import express from "express";
import cors from"cors";
import proxy from "express-http-proxy"

const app = express();
app.use(cors());

app.use("/customer",proxy('http://localhost:8001/'));
app.use("/product",proxy('http://localhost:8002/'));
app.use("/shopping",proxy('http://localhost:8003/'));

app.use("/",()=>{
    console.log("currently running the api gateway")
})

app.listen(8000,()=>{
    console.log("running the api gateway");
})