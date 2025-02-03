import {Queue} from "bullmq";

const deilveryQueue = new Queue("",{
    connection:{
        host:process.env.REDIS_HOST,
        port:process.env.REDIS_PORT,
        password:process.env.REDIS_PASSWORD,    
    }
});

export {deilveryQueue}