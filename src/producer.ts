import { sendMessageToQueue } from "./sqs";

async function  produce() {
     const messages = ["Hello", "This", "Is", "From", "Producer"];
    for(const message of messages){
        await sendMessageToQueue(message);
    }

    
}
produce()