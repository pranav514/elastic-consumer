import { deleteMessageFromQueue, receiveMessagesFromQueue } from "./sqs";

let idleTime = 0;
const MAX_IDLE_TIME = 60000;
const POLL_INTERVAL = 5000;

async function pollQueue(){
    while(true){
        const messages = await receiveMessagesFromQueue();
        if(messages.length === 0){
            idleTime += POLL_INTERVAL;
            console.log(`Queue empty. Idle for ${idleTime / 1000}s`);
            if(idleTime >= MAX_IDLE_TIME){
                console.log("No messages received for a while, exiting...");
                break;
            }
        } else{
            idleTime = 0;
            for(const message of messages){
                console.log("Recived: " , message.Body);
                if(message.ReceiptHandle) {
                    await deleteMessageFromQueue(message.ReceiptHandle);
                    console.log("Message deleted from queue:", message.Body);
                }
            }
        }
        await new Promise((res) => setTimeout(res , POLL_INTERVAL));
    }
}

setInterval(async () => {
    const message = await receiveMessagesFromQueue();
    if(message.length > 0){
        console.log("New message detected , restarting the consumer");
        idleTime = 0;
        pollQueue();
    }
} , 60000);
pollQueue();