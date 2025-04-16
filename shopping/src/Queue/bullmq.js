    import {Queue} from "bullmq";



    const deliveryQueue = new Queue("DeliveryQueue",{
        connection:{
            host:process.env.REDIS_HOST,
            port:process.env.REDIS_PORT,
            password:process.env.REDIS_PASSWORD,    
        }
    });

    export {deliveryQueue}

  