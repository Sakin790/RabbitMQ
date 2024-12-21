const amqp = require("amqplib");

async function sendMail() {
  let connection;
  let channel;
  try {
    connection = await amqp.connect("amqp://root:secret@localhost");
    channel = await connection.createChannel();

    // Producer => exchange=> routingKey => Queue => Consumer
    const queue = "mail_queue"; //All data to send this queue
    const exchange = "main_exchange";
    const routingKey = "send_mail";
    const message = {
      to: "sakinisla79@gmail.com",
      from: "sakinislam790@gmail.com",
      note: "This is a test email sent using RabbitMQ and will be sent to the following addresses",
    };

    //Creating exchange
    await channel.assertExchange(exchange, "direct", { durable: false });

    //Creating Queue
    await channel.assertQueue(queue, { durable: false });

    // Creating Connection between Queue and exchange
    await channel.bindQueue(queue, exchange, routingKey);

    // Publish the message
    const isPublished = channel.publish(
      exchange,
      routingKey, //routingKey ta mail_queue k refer korche
      Buffer.from(JSON.stringify(message))
    );

    if (isPublished) {
      console.log("Message sent successfully", message);
    } else {
      console.error("Failed to send message");
    }
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error.message);
  } finally {
    if (channel) {
      await channel.close();
    }
    if (connection) {
      await connection.close();
    }
  }
}

sendMail();
