import * as dotenv from 'dotenv'
dotenv.config()

import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-3.5-turbo",
  input: "Hi",
});

console.log(response.output_text);
