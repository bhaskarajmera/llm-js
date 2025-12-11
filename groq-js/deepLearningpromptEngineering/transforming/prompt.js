/**
 * 
 * Transformation tasks such as language translation, spelling and grammar checking, 
 * tone adjustment, and format conversion.
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
      },
    ],
    model: "openai/gpt-oss-20b",
  });
}


/**
 * 
 * Translation
 * ChatGPT is trained with sources in many languages. This gives the model the ability 
 * to do translation. Here are some examples of how to use this capability.
 * 
 */

prompt = `
Translate the following English text to Spanish: \ 
"""Hi, I would like to order a blender"""
`
response = await get_completion(prompt)
console.log("P1 Translation::: \n",  prompt, '\n', response.choices[0].message)

prompt = `
Tell me which language this is: 
"""Combien coûte le lampadaire?"""
`
response = await get_completion(prompt)
console.log("P2 Translation::: \n",  prompt, '\n', response.choices[0].message)

prompt = `
Translate the following  text to French and Spanish
and English pirate: \
"""I want to order a basketball"""
`
response = await get_completion(prompt)
console.log("P3 Translation::: \n",  prompt, '\n', response.choices[0].message)

prompt = `
Translate the following text to Spanish in both the \
formal and informal forms: 
'Would you like to order a pillow?'
`
response = await get_completion(prompt)
console.log("P4 Translation::: \n",  prompt, '\n', response.choices[0].message)


/**
 * 
 * Universal Translator
 * 
 * Imagine you are in charge of IT at a large multinational e-commerce company. 
 * Users are messaging you with IT issues in all their native languages. 
 * Your staff is from all over the world and speaks only their native languages. 
 * You need a universal translator!
 * 
 */

let user_messages = [
  "La performance du système est plus lente que d'habitude.",  // System performance is slower than normal         
  "Mi monitor tiene píxeles que no se iluminan.",              // My monitor has pixels that are not lighting
  "Il mio mouse non funziona",                                 // My mouse is not working
  "Mój klawisz Ctrl jest zepsuty",                             // My keyboard has a broken control key
  "我的屏幕在闪烁"                                               // My screen is flashing
]

for (let issue in user_messages) {
    prompt = `Tell me what language this is:${issue}`
    let lang = await get_completion(prompt)
    console.log("Original message: ", lang ,':', issue)

    prompt = `
    Translate the following  text to English \
    and Korean'${issue}'`
    response = await get_completion(prompt)
    console.log(response, "\n")
}


/**
 * 
 * Tone Transformation
 * Writing can vary based on the intended audience. ChatGPT can produce different tones
 * 
 */

prompt = `
Translate the following from slang to a business letter: 
'Dude, This is Joe, check out this spec on this standing lamp.'
`
response = await get_completion(prompt)
console.log("P1 Tone Transformation::: \n",  prompt, '\n', response.choices[0].message)


/**
 * 
 * Format Conversion
 * ChatGPT can translate between formats. The prompt should describe the input and 
 * output formats.
 * 
 */

let data_json = { "resturant employees" :[ 
    {"name":"Shyam", "email":"shyamjaiswal@gmail.com"},
    {"name":"Bob", "email":"bob32@gmail.com"},
    {"name":"Jai", "email":"jai87@gmail.com"}
]}

prompt = `
Translate the following python dictionary from JSON to an HTML \
table with column headers and title: ${data_json}`
response = await get_completion(prompt)
console.log("P1 Format Conversion::: \n",  prompt, '\n', response.choices[0].message)

/**
 * 
 * Spellcheck/Grammar check.
 * examples of common grammar and spelling problems and the LLM's response.
 * To signal to the LLM that you want it to proofread your text, you instruct 
 * the model to 'proofread' or 'proofread and correct'.
 * 
 */

text = [ 
  "The girl with the black and white puppies have a ball.",  // The girl has a ball.
  "Yolanda has her notebook.", // ok
  "Its going to be a long day. Does the car need it’s oil changed?",  // Homonyms
  "Their goes my freedom. There going to bring they’re suitcases.",  // Homonyms
  "Your going to need you’re notebook.",  // Homonyms
  "That medicine effects my ability to sleep. Have you heard of the butterfly affect?", // Homonyms
  "This phrase is to cherck chatGPT for speling abilitty"  // spelling
]
for (let t in text){
    prompt = `Proofread and correct the following text
    and rewrite the corrected version. If you don't find
    and errors, just say "No errors found". Don't use 
    any punctuation around the text:
    ${t}`
    response = await get_completion(prompt)
    console.log("P1 Spellcheck::: \n",  prompt, '\n', response.choices[0].message)
}

text = `
Got this for my daughter for her birthday cuz she keeps taking \
mine from my room.  Yes, adults also like pandas too.  She takes \
it everywhere with her, and it's super soft and cute.  One of the \
ears is a bit lower than the other, and I don't think that was \
designed to be asymmetrical. It's a bit small for what I paid for it \
though. I think there might be other options that are bigger for \
the same price.  It arrived a day earlier than expected, so I got \
to play with it myself before I gave it to my daughter.`
prompt = `proofread and correct this review: """${text}"""`
response = await get_completion(prompt)
console.log("P2 Spellcheck::: \n",  prompt, '\n', response.choices[0].message)

prompt = `
proofread and correct this review. Make it more compelling. 
Ensure it follows APA style guide and targets an advanced reader. 
Output in markdown format.
Text: """${text}"""`
response = await get_completion(prompt)
console.log("P3 Spellcheck w/ MarkDown::: \n",  prompt, '\n', response.choices[0].message)
