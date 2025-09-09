import * as dotenv from 'dotenv'
dotenv.config()

import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile", // llama meta open souce model
  temperature: 0
});

const result = await model.invoke('Hi')
console.log(result)