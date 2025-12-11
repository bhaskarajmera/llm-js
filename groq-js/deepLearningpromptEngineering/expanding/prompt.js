/**
 * 
 * Generate customer service emails that are tailored to each customer's review.
 * 
 */

import * as dotenv from 'dotenv'
dotenv.config() 

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

let text, prompt, response
export async function get_completion(prompt) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
        // temperature: temperature   // temperature only supported for specific models & versions
      },
    ],
    model: "openai/gpt-oss-20b",
  });
}

/**
 * 
 * Customize the automated reply to a customer email
 * 
 */

// given the sentiment from the lesson on "inferring",
// and the original customer message, customize the email
let sentiment = "negative"

// review for a blender
let review = `
So, they still had the 17 piece system on seasonal \
sale for around $49 in the month of November, about \
half off, but for some reason (call it price gouging) \
around the second week of December the prices all went \
up to about anywhere from between $70-$89 for the same \
system. And the 11 piece system went up around $10 or \
so in price also from the earlier sale price of $29. \
So it looks okay, but if you look at the base, the part \
where the blade locks into place doesn’t look as good \
as in previous editions from a few years ago, but I \
plan to be very gentle with it (example, I crush \
very hard items like beans, ice, rice, etc. in the \ 
blender first then pulverize them in the serving size \
I want in the blender then switch to the whipping \
blade for a finer flour, and use the cross cutting blade \
first when making smoothies, then use the flat blade \
if I need them finer/less pulpy). Special tip when making \
smoothies, finely cut and freeze the fruits and \
vegetables (if using spinach-lightly stew soften the \ 
spinach then freeze until ready for use-and if making \
sorbet, use a small to medium sized food processor) \ 
that you plan to use that way you can avoid adding so \
much ice if at all-when making your smoothie. \
After about a year, the motor was making a funny noise. \
I called customer service but the warranty expired \
already, so I had to buy another one. FYI: The overall \
quality has gone done in these types of products, so \
they are kind of counting on brand recognition and \
consumer loyalty to maintain sales. Got it in about \
two days.`

prompt =`
You are a customer service AI assistant.
Your task is to send an email reply to a valued customer.
Given the customer email delimited by """, \
Generate a reply to thank the customer for their review.
If the sentiment is positive or neutral, thank them for \
their review.
If the sentiment is negative, apologize and suggest that \
they can reach out to customer service. 
Make sure to use specific details from the review.
Write in a concise and professional tone.
Sign the email as 'AI customer agent'.
Customer review: """${review}"""
Review sentiment: ${sentiment}`
response = await get_completion(prompt)
console.log("Automated reply::: \n",  prompt, '\n', response.choices[0].message)


/**
 * 
 * Remind the model to use details from the customer's email
 * 
 * Temperature
 * 0: gives reliability, predictability output i.e. for Customer review, it should give similar response. 
 * 0.3, 0.7: Provides multiple response i.e. for customer review, it can add multiple variety response.
 * 
 */

prompt =`
You are a customer service AI assistant.
Your task is to send an email reply to a valued customer.
Given the customer email delimited by """, \
Generate a reply to thank the customer for their review.
If the sentiment is positive or neutral, thank them for \
their review.
If the sentiment is negative, apologize and suggest that \
they can reach out to customer service. 
Make sure to use specific details from the review.
Write in a concise and professional tone.
Sign the email as 'AI customer agent'.
Customer review: ${review}
Review sentiment: ${sentiment}`
response = await get_completion(prompt)
// response = await get_completion(prompt, 0.7)   // temperature param only supported for specific models & versions
console.log("Use customers email detail::: \n",  prompt, '\n', response.choices[0].message)
