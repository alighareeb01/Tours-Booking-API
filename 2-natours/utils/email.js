import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { convert } from "html-to-text";

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: "./config.env" });

export class Email {
  constructor(user, url) {
    this.to = user.email;
    this.from = `Aly Abdullkareem <${process.env.EMAIL_FROM}>`;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
  }

  async getTemplate(template) {
    const templatePath = path.join(__dirname, "templates", `${template}.html`);

    let html = await fs.readFile(templatePath, "utf-8");

    //replace place holders
    html = html
      .replace(/{{firstName}}/g, this.firstName)
      .replace(/{{url}}/g, this.url);

    return html;
  }

  newTransport() {
    if (process.env.NODE_ENV.trim() === "production") {
      console.log("here is", process.env.NODE_ENV.trim() === "production");
      console.log("here is", process.env.SENDGRID_USERNAME);
      console.log("here is", process.env.SENDGRID_PASSWORD);

      //sendgrid
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    } else {
      return nodemailer.createTransport({
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
    }
  }

  async send(template, subject) {
    //html
    const html = await this.getTemplate(template);

    //options
    let mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    //create transport and send
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "hello  to our app");
  }
  async sendPasswordReset() {
    await this.send("passwordReset", "your password reset token");
  }
}

