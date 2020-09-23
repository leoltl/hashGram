import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_host,
  port: process.env.SMTP_port,
  auth: {
    user: process.env.SMTP_user,
    pass: process.env.SMTP_pass
  }
});

export default function handler(ack) {
  return function handler(message) {
    if (message !== null) {
      const emailConfig = JSON.parse(message.content.toString())
      onEmailRequest(emailConfig, () => ack(message))
    }
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


