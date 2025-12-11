import * as dotenv from 'dotenv'
dotenv.config()

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0
});

const result = await model.invoke('Hi')
console.log(result.content)