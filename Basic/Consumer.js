const amqp = require("amqplib");
async function reciveMain() {
  try {
    const connection = await amqp.connect("amqp://root:secret@localhost");
    const channel = await connection.createChannel();

    const queue = "mail_queue"; //ai queue a data ache
    await channel.assertQueue(queue, { durable: false });


    channel.consume(queue, (msg) => {
      if (msg !== null) {
        console.log("Received message", JSON.parse(msg.content));
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error reciving message", error);
  }
}

reciveMain();
