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
      console.log('rabbitMQ connected')
      channel = ch;
    })
    .catch(console.log);

  async function publish(queue, message) {
    try {
      const queueOK = await channel.assertQueue(queue);
      if (queueOK) {
        channel.sendToQueue(queue, Buffer.from(message))
      }
    } catch (e) {
      console.log(e);
    }
  }
  return {
    publish: publish,
  }
}

export default makePublisher();