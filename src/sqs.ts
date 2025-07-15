import { DeleteMessageCommand, ReceiveMessageCommand, SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import dotenv from "dotenv";
dotenv.config();

export const sqsclient = new SQSClient({
    region :"ap-south-1",
    credentials : {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
    }
})

export const QUEUE_URL = process.env.AWS_QUEUE_URL

export async function sendMessageToQueue(message : string){
    const cmd = new SendMessageCommand({
        QueueUrl: QUEUE_URL,
        MessageBody: message
    })
    await sqsclient.send(cmd);
    console.log("Message sent to SQS queue:", message);
}
export async function receiveMessagesFromQueue() {
    const cmd = new ReceiveMessageCommand({
        QueueUrl: QUEUE_URL,
        MaxNumberOfMessages: 10, // Adjust as needed
        WaitTimeSeconds: 20 // Long polling
    })
    const res = await sqsclient.send(cmd);
    if (res.Messages) {
        return res.Messages;
    }else{
        return [];
    }
}

export async function deleteMessageFromQueue(receiptHandle: string) {
    const cmd = new DeleteMessageCommand({
        QueueUrl : QUEUE_URL,
        ReceiptHandle: receiptHandle
    })
    await sqsclient.send(cmd);
}