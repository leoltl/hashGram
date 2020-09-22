const amqplib = require('amqplib');
const nodemailer = require('nodemailer');

const CloudAMQP_URI = process.env.CloudAMQP_URI;
 
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_host,
  port: SMTP_port,
  auth: {
    user: process.env.SMTP_user,
    pass: process.env.SMTP_pass
  }
});

async function consumer(connection, queue) {
  try {
    const channel = await connection.createChannel();
    const queueOK = channel.assertQueue(queue);
    console.log('rabbitMQ connected')
    if (queueOK) {
      channel.consume(queue, (message) => {
        if (message !== null) {
          const emailConfig = JSON.parse(message.content.toString())
          onEmailRequest(emailConfig, () => channel.ack(message))
        }
      });
    }
  } catch (e) {
    console.log(e) 
  }
}

function onEmailRequest(config, ack) {
  transporter.verify(function(error, success) {
    if (error) {
      throw error
    }
    // if transporter is available
    sendMail(config, function (error, info) {
      if (error) {
        console.error(error);
        return;
      }
      console.log('sent', info);
      ack();
    })
  });
}

function sendMail(config, cb) {
  const mailContent = buildMessage(config);
  console.log(mailContent)
  transporter.sendMail(mailContent, cb);
}

function buildMessage(payload) {
  const text = `Hello ${payload.user}, Thanks for signin up with hashgram. Here's is your email confirm code ${payload.verificationCode}`
  const html = `<p>Hello ${payload.user}, Thanks for signin up with hashgram. Here's is your email confirm code <strong>${payload.verificationCode}</strong></p>`
  return {
    from: 'noreply.hashgram@gmail.com',
    to: payload.to,
    subject: '[hashGram] Email verification',
    text,
    html,
  }
}

async function main() {
  const connection = await amqplib.connect(CloudAMQP_URI);
  const queue = 'job';
  consumer(connection, queue);
}

main();