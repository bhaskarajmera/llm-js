import * as dotenv from 'dotenv'
dotenv.config()

import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({ model: "gpt-3.5-turbo" });
const result = await model.invoke('Hi');
console.log(result)