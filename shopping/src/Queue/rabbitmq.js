import amqplib from "amqplib";
import log from "../utils/logHandler.js";
import { ApiError } from "../utils/ApiError.js";

let rabbitMqConnection = null;
let rabbitMqChannel = null;

const EXCHANGE_NAME = "orders_exchange"; 

async function initializeRabbitMQ() {
    try {
        log.info("Connecting to RabbitMQ...");
        rabbitMqConnection = await amqplib.connect(process.env.RABBITMQ_URL);

        log.info("RabbitMQ connection established.");

        rabbitMqChannel = await rabbitMqConnection.createChannel();
        await rabbitMqChannel.assertExchange(EXCHANGE_NAME, "topic", { durable: true });

        log.info(`Exchange "${EXCHANGE_NAME}" set up successfully.`);

        return rabbitMqChannel;
    } catch (error) {
        log.error("Failed to initialize RabbitMQ:", error);
        throw new ApiError("Error initializing RabbitMQ. Please check the connection and configuration.", 500);
    }
}

async function publishEventToExchange(routingKey,message){
    try {
        if(!rabbitMqChannel) {
            await initializeRabbitMQ();
        }

        const messageBuffer = Buffer.from(JSON.stringify(message));

        rabbitMqChannel.publish(EXCHANGE_NAME,routingKey,messageBuffer);

        log.info(`📤 Event published to exchange: "${EXCHANGE_NAME}" | Routing Key: "${routingKey}"`);

    } catch (error) {
        log.error(`❌ Failed to publish event to RabbitMQ | Routing Key: "${routingKey}"`, error);
    }
}

export {initializeRabbitMQ,publishEventToExchange};

