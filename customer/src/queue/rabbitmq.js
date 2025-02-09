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

        //log.info(`Exchange "${EXCHANGE_NAME}" set up successfully.`);

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

async function consumeRabbitMQEvent(routingKey, callback) {
    try {
        if (!routingKey || typeof routingKey !== "string") {
            throw new Error("Invalid routingKey provided. It must be a non-empty string.");
        }
        if (typeof callback !== "function") {
            throw new Error("Invalid callback function provided.");
        }

        if (!rabbitMqChannel) {
            log.info("Initializing RabbitMQ connection...");
            await initializeRabbitMQ();
        }

        //log.info(`Setting up consumer for routing key: ${routingKey}`);

        const queue = await rabbitMqChannel.assertQueue("", { exclusive: true });

        await rabbitMqChannel.bindQueue(queue.queue, EXCHANGE_NAME, routingKey);

        rabbitMqChannel.consume(queue.queue, (msg) => {
            if (msg !== null) {
                try {
                    const content = JSON.parse(msg.content.toString());
                    log.info(`Received message on routing key '${routingKey}':`, content);
                    callback(content);
                    rabbitMqChannel.ack(msg);
                } catch (error) {
                    log.error("Failed to process message:", error.message);
                }
            }
        });

        //log.info(`Consumer successfully set up for routing key: ${routingKey}`);
    } catch (error) {
        log.error("Error in consumeRabbitMQEvent:", error.message);
        throw error;
    }
}

export {initializeRabbitMQ,publishEventToExchange,consumeRabbitMQEvent};