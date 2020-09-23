import '../env';
import amqplib from 'amqplib';
import emailHandler from './email';
import chatHandler from './chat';

const CloudAMQP_URI = process.env.CloudAMQP_URI;

async function consumer(connection, queue, makeHandler) {
  try {
    const channel = await connection.createChannel();
    const queueOK = channel.assertQueue(queue);
    if (queueOK) {
      const handler = makeHandler(channel.ack.bind(channel));
      channel.consume(queue, handler);
    }
  } catch (e) {
    console.log(e) 
  }
}


async function main() {
  const connection = await amqplib.connect(CloudAMQP_URI);
  console.log('rabbitMQ connected')
  const emailConsumer = consumer(connection, 'job', emailHandler);
  const chatHistoryConsumer = consumer(connection, 'chat', chatHandler);
}

main();