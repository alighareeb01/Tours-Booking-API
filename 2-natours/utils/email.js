import nodemailer from "nodemailer";
export const sendEmail = async (options) => {
  //transporter
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: "9d7d5092048769",
      pass: "d18d087e240abf",
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
  await transport.verify();
  console.log("SMTP connected");
  let mailOptions = {
    from: "aly abdullkareeem <ghareeeb@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  return await transport.sendMail(mailOptions);
};
