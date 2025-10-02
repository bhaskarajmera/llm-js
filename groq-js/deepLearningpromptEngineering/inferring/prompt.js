/**
 * 
 * Infer sentiment (Positive/Negtative) and topics 
 * from product reviews and news articles.
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
 * 
 */

text = `Needed a nice lamp for my bedroom, and this one had \
additional storage and not too high of a price point. \
Got it fast.  The string to our lamp broke during the \
transit and the company happily sent over a new one. \
Came within a few days as well. It was easy to put \
together.  I had a missing part, so I contacted their \
support and they very quickly got me the missing piece! \
Lumina seems to me to be a great company that cares \
about their customers and products!!`

/**
 * 
 * Sentiment (positive/negative)
 * 
 */

prompt = `What is the sentiment of the following product review, 
which is delimited with <>?

Review text: <${text}>`
response = await get_completion(prompt)
console.log('Sentiment 1: \n ', prompt, '\n', response.choices[0].message)

prompt = `What is the sentiment of the following product review, 
which is delimited with <>?

Give your answer as a single word, either "positive" \
or "negative".?

Review text: <${text}>`
response = await get_completion(prompt)
console.log('Sentiment 2: \n ', prompt, '\n', response.choices[0].message)

/**
 * 
 * Identify types of emotions
 * 
 */

prompt = `Identify a list of emotions that the writer of the \
following review is expressing. Include no more than \
five items in the list. Format your answer as a list of \
lower-case words separated by commas.

Review text: <${text}>`
response = await get_completion(prompt)
console.log('Emotions 2: \n ', prompt, '\n', response.choices[0].message)

/**
 * 
 * Identify anger
 * 
 */

prompt = `Is the writer of the following review expressing anger?\
The review is delimited with <>. \
Give your answer as either yes or no.

Review text: <${text}>`
response = await get_completion(prompt)
console.log('Identify Anger 2: \n ', prompt, '\n', response.choices[0].message)

/**
 * 
 * Extract product and company name from customer reviews
 * 
 */

prompt = `Identify the following items from the review text: 
- Item purchased by reviewer
- Company that made the item

The review is delimited with <>. \
Format your response as a JSON object with \
"Item" and "Brand" as the keys. 
If the information isn't present, use "unknown" \
as the value.
Make your response as short as possible.

Review text: <${text}>`
response = await get_completion(prompt)
console.log('Extract info 2: \n ', prompt, '\n', response.choices[0].message)

/**
 * 
 * Doing multiple tasks at once
 * 
 */

prompt = `Identify the following items from the review text: 
- Sentiment (positive or negative)
- Is the reviewer expressing anger? (true or false)
- Item purchased by reviewer
- Company that made the item

The review is delimited with <>. \
Format your response as a JSON object with \
"Sentiment", "Anger", "Item" and "Brand" as the keys.
If the information isn't present, use "unknown" \
as the value.
Make your response as short as possible.
Format the Anger value as a boolean.

Review text: <${text}>`
response = await get_completion(prompt)
console.log('Multiple Tasks: \n ', prompt, '\n', response.choices[0].message)

/**
 * 
 * Inferring topics
 * 
 */

text = `In a recent survey conducted by the government, 
public sector employees were asked to rate their level 
of satisfaction with the department they work at. 
The results revealed that NASA was the most popular 
department with a satisfaction rating of 95%.

One NASA employee, John Smith, commented on the findings, 
stating, "I'm not surprised that NASA came out on top. 
It's a great place to work with amazing people and 
incredible opportunities. I'm proud to be a part of 
such an innovative organization."

The results were also welcomed by NASA's management team, 
with Director Tom Johnson stating, "We are thrilled to 
hear that our employees are satisfied with their work at NASA. 
We have a talented and dedicated team who work tirelessly 
to achieve our goals, and it's fantastic to see that their 
hard work is paying off."

The survey also revealed that the 
Social Security Administration had the lowest satisfaction 
rating, with only 45% of employees indicating they were 
satisfied with their job. The government has pledged to 
address the concerns raised by employees in the survey and 
work towards improving job satisfaction across all departments.`

/**
 * 
 * Infer 5 topics
 * 
 */

prompt = `Determine five topics that are being discussed in the \
following text, which is delimited by <>.

Make each item one or two words long. 

Format your response as a list of items separated by commas.

Review text: <${text}>`
response = await get_completion(prompt)
console.log('5 topics: \n ', prompt, '\n', response.choices[0].message)


// let topic_list = [
//     "nasa", "local government", "engineering", 
//     "employee satisfaction", "federal government"
// ]

// /**
//  * 
//  * Make a news alert for certain topics
//  * 
//  */

// prompt = `Determine whether each item in the following list of \
// topics is a topic in the text below, which
// is delimited with triple backticks.

// Give your answer as follows:
// item from the list: 0 or 1

// List of topics: ${", ".join(topic_list)}

// Text Sample: <${text}>`
// response = await get_completion(prompt)
// console.log('News Alert : \n ', prompt, '\n', response.choices[0].message)
