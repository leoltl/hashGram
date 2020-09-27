const amqplib = require('amqplib');

function makePublisher() {
  let channel;
  // connect to CloudAMQP and create a single channel
  amqplib
    .connect(process.env.CloudAMQP_URI)
    .then(conn => {
      return conn.createChannel()
    })
    .then(ch => {
      console.log('rabbitMQ connected - publisher')
      channel = ch;
    })
    .catch(console.log);

  async function publish(queue, message) {
    try {
      const queueOK = await channel.assertQueue(queue);
      if (queueOK) {
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)))
      }
    } catch (e) {
      console.log(e);
    }
  }
  return {
    publish: publish,
  }
}

function makeConsumer() {
  let channel;
  // connect to CloudAMQP and create a single channel
  amqplib
    .connect(process.env.CloudAMQP_URI)
    .then(conn => {
      return conn.createChannel()
    })
    .then(ch => {
      console.log('rabbitMQ connected - consumer')
      channel = ch;
    })
    .catch(console.log);

  async function consume(queue, makeHandler, options) {
    try {
      const queueOK = await channel.assertQueue(queue);
      if (queueOK) {
        const handler = makeHandler(channel);
        channel.consume(queue, handler, options);
        channel.cancel
      }
    } catch (e) {
      console.log(e) 
    }
  }

  return {
    consume: consume,
  }
}


export default {
  publisher: makePublisher(),
  consumer: makeConsumer()
};