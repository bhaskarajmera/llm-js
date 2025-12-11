import * as dotenv from 'dotenv'
dotenv.config()

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Hi",
  });
  console.log(response.text);
}

await main();