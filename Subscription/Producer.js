const amqp = require("amqplib");

async function init() {
  const data = "Hello, world! from Producer";

  let Subscriber = {
    QueueName: "SentMailToSubscriber",
    RoutingKey: "routingKeyForSub",
  };

  let nonSubscriber = {
    QueueName: "SentMessageNonSubscriber",
    RoutingKey: "routingKeyForUser",
  };

  try {
    let connection = await amqp.connect("amqp://root:secret@localhost");
    let channel = await connection.createChannel();

    const exchange = "Mail_Exchange";

    await channel.assertExchange(exchange, "direct", { durable: false });

    //Queue Bancchi , jar jonno sudhu ekta nam holei hoi
    await channel.assertQueue(Subscriber.QueueName, { durable: false });
    await channel.assertQueue(nonSubscriber.QueueName, { durable: false });

    //Queue exchange routing key ek sathe bind korchi,

    await channel.bindQueue(
      Subscriber.QueueName,
      exchange,
      Subscriber.RoutingKey
    );

    await channel.bindQueue(
      nonSubscriber.QueueName,
      exchange,
      nonSubscriber.RoutingKey
    );

    await channel.publish(
      exchange,
      nonSubscriber.RoutingKey,
      Buffer.from(JSON.stringify(data))
    );
    console.log("Message sent successfully", data);
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error initial RabbitMQ connection", error);
  }
}
init();
