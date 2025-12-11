/***
 * 
 * Models:
 * llama-3.1-8b-instant
 * llama-3.3-70b-versatile
 * meta-llama/llama-guard-4-12b
 * openai/gpt-oss-120b
 * openai/gpt-oss-20b
 * whisper-large-v3
 * whisper-large-v3-turbo
 * 
 * Get all active models:
 * curl -X GET "https://api.groq.com/openai/v1/models" \
     -H "Authorization: Bearer $GROQ_API_KEY" \
     -H "Content-Type: application/json"
 * 
 */

import * as dotenv from 'dotenv'
dotenv.config()

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function main() {
  await getGroqChatCompletion();
  // console.log(chatCompletion.choices[0]?.message?.content || "");

  await promptEngineering();

  await rolePrompt();

  await fewShot();

  await reasoning();

  await structuredOutput();

  await batchPrompts();

  await contextMemory();

  await errorHandling();

}

export async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: "Hi",
      },
    ],
    model: "openai/gpt-oss-20b",
  });
}

export async function promptEngineering() {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: "You are a summarizer." },
      { role: "user", content: "Summarize the story of Cinderella in 3 bullet points." }
    ]
  });

  console.log(response.choices[0].message.content);
}

// Set model personality.
async function rolePrompt() {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: "You are a strict grammar teacher." },
      { role: "user", content: "Correct this sentence: 'She dont like apple'." }
    ]
  });

  console.log(response.choices[0].message.content);
}

// Give examples so model follows pattern.
async function fewShot() {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: "Answer like a dictionary." },
      { role: "user", content: "Word: Happy\nDefinition: Feeling pleasure or contentment" },
      { role: "user", content: "Word: Sad\nDefinition: Experiencing sorrow or unhappiness" },
      { role: "user", content: "Word: Curious\nDefinition:" }
    ]
  });

  console.log(response.choices[0].message.content);
}

// Ask model to explain steps.
async function reasoning() {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: "You are a math tutor." },
      { role: "user", content: "If a train travels 60 km in 1.5 hours, what is its speed? Show steps." }
    ]
  });

  console.log(response.choices[0].message.content);
}

//Force model to respond in JSON for easy parsing.
async function structuredOutput() {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: "Always respond in valid JSON." },
      { role: "user", content: "Give me a summary of 'Inception' with fields: title, genre, year." }
    ]
  });

  console.log(response.choices[0].message.content);
}

// Send Batch of prompts in parallel.
async function batchPrompts() {
  const prompts = [
    "Explain quantum computing in simple terms.",
    "Write a haiku about the moon.",
    "Translate 'Good morning' to French."
  ];

  const results = await Promise.all(
    prompts.map(async (p) => {
      const res = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: p }]
      });
      return res.choices[0].message.content;
    })
  );

  console.log(results);
}

// Maintain previous chat context.
async function contextMemory() {
  const messages = [
    { role: "system", content: "You are a travel assistant." },
    { role: "user", content: "Suggest a city in Italy for food lovers." },
    { role: "assistant", content: "Bologna is famous for its cuisine." },
    { role: "user", content: "What dish should I try there?" }
  ];

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages
  });

  console.log(response.choices[0].message.content);
}

// Catch and handle API failures.
async function errorHandling() {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: "Tell me about Mars." }]
    });

    console.log(response.choices[0].message.content);
  } catch (err) {
    console.error("Groq API Error:", err.message);
  }
}

await main()