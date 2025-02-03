import {Worker} from "bullmq"
import log from "../utils/logHandler"

const deliveryWorker = new Worker("",async(job)=>{
    try {
        //notify the user about its ordered product delivery and here idk how im supposed to reflect this on frontend
        //use emails
        //use sockets (yes to this i guess)
    } catch (error) {
        
    }
},{
   connection:{
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    password:process.env.REDIS_PASSWORD,
   }
})

deliveryWorker.on("completed",(job)=>{
log.info(`Job ${job.id} completed`);
});

deliveryWorker.on("failed",(job,err)=>{
    log.error(`Job ${job.id} failed`,err);
})