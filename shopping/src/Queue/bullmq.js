import {Queue} from "bullmq";

const deilveryQueue = new Queue("",{
    connection:{
        host:"",
        port:0,
        password:"",    
    }
});

export {deilveryQueue}