const AWS = require("aws-sdk");
const ec2 = new AWS.EC2({ region: "ap-south-1" });
const sqs = new AWS.SQS({ region: "ap-south-1" });

const instanceId = "i-0b6d0a8462b01e9af";
const queueUrl = "https://sqs.ap-south-1.amazonaws.com/905418020910/test";

exports.handler = async () => {
  const messages = await sqs.receiveMessage({
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 0,
  }).promise();
  console.log("messages" , messages.Messages.length);
  const hasMessages = messages.Messages && messages.Messages.length > 0;

  const ec2Status = await ec2.describeInstances({
    InstanceIds: [instanceId],
  }).promise();

  const state = ec2Status.Reservations[0].Instances[0].State.Name;
  console.log("hasmessages" , hasMessages);
  console.log("state", state);
  if (!hasMessages && state === "running") {
    console.log("Queue empty. Shutting down EC2.");
    await ec2.stopInstances({ InstanceIds: [instanceId] }).promise();
  }else if(hasMessages && state === "stopped"){
    console.log("Queue not empty. Starting EC2.");
    await ec2.startInstances({ InstanceIds: [instanceId] }).promise();
  }
   else {
    console.log("No shutdown needed.");
  }
};
