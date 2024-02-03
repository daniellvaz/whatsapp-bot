require("dotenv").config();

const { OpenAI } = require("openai");
const qrcode = require("qrcode-terminal");
const { LocalAuth } = require("whatsapp-web.js");
const { Client } = require("whatsapp-web.js");
const olympusScript = require("./prompt/script");

const client = new Client({
  authStrategy: new LocalAuth(),
});

const ia = new OpenAI({
  apiKey: process.env.OPENIA_APY_KEY,
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  console.log("Client is ready!");
});

const messages = [
  {
    role: "system",
    content: olympusScript,
  },
];

client.on("message", async (message) => {
  try {
    messages.push({
      role: "user",
      content: message.body,
    });

    const response = await ia.chat.completions.create({
      messages,
      model: "gpt-3.5-turbo",
    });

    message.reply(response.choices[0].message.content);
  } catch (e) {
    console.log(e.message);
  }
});

client.initialize();
