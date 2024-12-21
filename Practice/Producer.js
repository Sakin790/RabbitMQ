const amqp = require("amqplib");

async function init() {
  try {
    const data = "Hello, world! from Producer";

    let connection = await amqp.connect("amqp://root:secret@localhost");
    let channel = await connection.createChannel();

    const queue = "Mail_Data";
    const exchange = "Mail_Exchange";
    const routingKey = "Mail_RoutingKey";

    await channel.assertExchange(exchange, "direct", { durable: false });
    await channel.assertQueue(queue, { durable: false });

    await channel.bindQueue(queue, exchange, routingKey);
    await channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(data))
    );
    console.log("Message sent successfully", data);
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error initializing amqp: " + error);
  }
}

init();
