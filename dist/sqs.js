"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessageFromQueue = exports.receiveMessagesFromQueue = exports.sendMessageToQueue = exports.QUEUE_URL = exports.sqsclient = void 0;
const client_sqs_1 = require("@aws-sdk/client-sqs");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.sqsclient = new client_sqs_1.SQSClient({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
    }
});
exports.QUEUE_URL = process.env.AWS_QUEUE_URL;
function sendMessageToQueue(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const cmd = new client_sqs_1.SendMessageCommand({
            QueueUrl: exports.QUEUE_URL,
            MessageBody: message
        });
        yield exports.sqsclient.send(cmd);
        console.log("Message sent to SQS queue:", message);
    });
}
exports.sendMessageToQueue = sendMessageToQueue;
function receiveMessagesFromQueue() {
    return __awaiter(this, void 0, void 0, function* () {
        const cmd = new client_sqs_1.ReceiveMessageCommand({
            QueueUrl: exports.QUEUE_URL,
            MaxNumberOfMessages: 10,
            WaitTimeSeconds: 20 // Long polling
        });
        const res = yield exports.sqsclient.send(cmd);
        if (res.Messages) {
            return res.Messages;
        }
        else {
            return [];
        }
    });
}
exports.receiveMessagesFromQueue = receiveMessagesFromQueue;
function deleteMessageFromQueue(receiptHandle) {
    return __awaiter(this, void 0, void 0, function* () {
        const cmd = new client_sqs_1.DeleteMessageCommand({
            QueueUrl: exports.QUEUE_URL,
            ReceiptHandle: receiptHandle
        });
        yield exports.sqsclient.send(cmd);
    });
}
exports.deleteMessageFromQueue = deleteMessageFromQueue;
