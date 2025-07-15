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
Object.defineProperty(exports, "__esModule", { value: true });
const sqs_1 = require("./sqs");
let idleTime = 0;
const MAX_IDLE_TIME = 60000;
const POLL_INTERVAL = 5000;
function pollQueue() {
    return __awaiter(this, void 0, void 0, function* () {
        while (true) {
            const messages = yield (0, sqs_1.receiveMessagesFromQueue)();
            if (messages.length === 0) {
                idleTime += POLL_INTERVAL;
                console.log(`Queue empty. Idle for ${idleTime / 1000}s`);
                if (idleTime >= MAX_IDLE_TIME) {
                    console.log("No messages received for a while, exiting...");
                    break;
                }
            }
            else {
                idleTime = 0;
                for (const message of messages) {
                    console.log("Recived: ", message.Body);
                    if (message.ReceiptHandle) {
                        yield (0, sqs_1.deleteMessageFromQueue)(message.ReceiptHandle);
                        console.log("Message deleted from queue:", message.Body);
                    }
                }
            }
            yield new Promise((res) => setTimeout(res, POLL_INTERVAL));
        }
    });
}
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield (0, sqs_1.receiveMessagesFromQueue)();
    if (message.length > 0) {
        console.log("New message detected , restarting the consumer");
        idleTime = 0;
        pollQueue();
    }
}), 60000);
pollQueue();
