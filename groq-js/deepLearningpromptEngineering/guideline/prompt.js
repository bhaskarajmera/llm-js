/**
 * 
 * Practice two prompting principles and their related tactics in order to write effective prompts 
 * for large language models.
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
 * Prompting Principles
 * - **Principle 1: Write clear and specific instructions**
 * - **Principle 2: Give the model time to “think”**
 * 
 * Tactics
 * 
 * Tactic 1: Use delimiters to clearly indicate distinct parts of the input
 * - Delimiters can be anything like: ```, """, < >, `<tag> </tag>`, `:`
 * 
*/

text = "You should express what you want a model to do by providing instructions that are as clear and specific as you can possibly make them. This will guide the model towards the desired output, and reduce the chances of receiving irrelevant or incorrect responses. Don't confuse writing a clear prompt with writing a short prompt.  In many cases, longer prompts provide more clarity and context for the model, which can lead to more detailed and relevant outputs."
prompt = `Summarize the text delimited by <> into a single sentence.
<${text}>`

response = await get_completion(prompt)
console.log("P1 Tactic 1::: \n",  prompt, '\n', response.choices[0].message)

/**
 * 
 * Tactic 2: Ask for a structured output
 * JSON, HTML
 * 
*/


prompt = "Generate a list of three made-up book titles along with their authors and genres. Provide them in JSON format with the following keys: book_id, title, author, genre"
response = await get_completion(prompt)
console.log("P1 Tactic 2::: \n", prompt, '\n', response.choices[0].message)

/**
 * 
 * Tactic 3: Ask the model to check whether conditions are satisfied
 * 
*/

text = "Making a cup of tea is easy! First, you need to get some water boiling. While that's happening,  grab a cup and put a tea bag in it. Once the water is  hot enough, just pour it over the tea bag.  Let it sit for a bit so the tea can steep. After a  few minutes, take out the tea bag. If you  like, you can add some sugar or milk to taste.  And that's it! You've got yourself a delicious  cup of tea to enjoy."
prompt = `You will be provided with text delimited by <>. If it contains a sequence of instructions, re-write those instructions in the following format:

Step 1 - ...
Step 2 - …
…
Step N - …

If the text does not contain a sequence of instructions, 
then simply write "No steps provided."

<${text}>`

response = await get_completion(prompt)
console.log("P1 Tactic 3.1::: \n",  prompt, '\n', response.choices[0].message)

text = "The sun is shining brightly today, and the birds are singing. It's a beautiful day to go for a  walk in the park. The flowers are blooming, and the  trees are swaying gently in the breeze. People  are out and about, enjoying the lovely weather.  Some are having picnics, while others are playing  games or simply relaxing on the grass. It's a  perfect day to spend time outdoors and appreciate the  beauty of nature."
prompt = `You will be provided with text delimited by triple quotes. 
If it contains a sequence of instructions, 
re-write those instructions in the following format:

Step 1 - ...
Step 2 - …
…
Step N - …

If the text does not contain a sequence of instructions, 
then simply write "No steps provided."

<${text}>`
response = await get_completion(prompt)
console.log("P1 Tactic 3.2::: \n",  prompt, '\n', response.choices[0].message)

/** 
 * 
 * Tactic 4: "Few-shot" prompting
 * 
*/

prompt = `Your task is to answer in a consistent style.

<child>: Teach me about patience.

<grandparent>: The river that carves the deepest \ 
valley flows from a modest spring; the \ 
grandest symphony originates from a single note; \ 
the most intricate tapestry begins with a solitary thread.

<child>: Teach me about resilience.`
response = await get_completion(prompt)
console.log("P1 Tactic 4::: \n",  prompt, '\n', response.choices[0].message)

/**
 * 
 * Principle 2: Give the model time to “think”
 * Tactic 1: Specify the steps required to complete a task
 * 
 */

text = `
In a charming village, siblings Jack and Jill set out on \ 
a quest to fetch water from a hilltop \ 
well. As they climbed, singing joyfully, misfortune \ 
struck—Jack tripped on a stone and tumbled \ 
down the hill, with Jill following suit. \ 
Though slightly battered, the pair returned home to \ 
comforting embraces. Despite the mishap, \ 
their adventurous spirits remained undimmed, and they \ 
continued exploring with delight.
`

prompt = `
Perform the following actions: 
1 - Summarize the following text delimited by <> \
with 1 sentence.
2 - Translate the summary into French.
3 - List each name in the French summary.
4 - Output a json object that contains the following \
keys: french_summary, num_names.

Separate your answers with line breaks.

Text:
<${text}>
`
response = await get_completion(prompt)
console.log("P2 Tactic 1.1::: \n",  prompt, '\n', response.choices[0].message)

prompt = `Your task is to perform the following actions: 
1 - Summarize the following text delimited by 
  <> with 1 sentence.
2 - Translate the summary into French.
3 - List each name in the French summary.
4 - Output a json object that contains the 
  following keys: french_summary, num_names.

Use the following format:
Text: <text to summarize>
Summary: <summary>
Translation: <summary translation>
Names: <list of names in summary>
Output JSON: <json with summary and num_names>

Text: <${text}>`
response = await get_completion(prompt)
console.log("P2 Tactic 1.2::: \n",  prompt, '\n', response.choices[0].message)

/**
 * 
 * Tactic 2: Instruct the model to work out its own solution before rushing to a conclusion
 * 
 */

prompt = `
Determine if the student's solution is correct or not.

Question:
I'm building a solar power installation and I need \
 help working out the financials. 
- Land costs $100 / square foot
- I can buy solar panels for $250 / square foot
- I negotiated a contract for maintenance that will cost \ 
me a flat $100k per year, and an additional $10 / square \
foot
What is the total cost for the first year of operations 
as a function of the number of square feet.

Student's Solution:
Let x be the size of the installation in square feet.
Costs:
1. Land cost: 100x
2. Solar panel cost: 250x
3. Maintenance cost: 100,000 + 100x
Total cost: 100x + 250x + 100,000 + 100x = 450x + 100,000`

response = await get_completion(prompt)
console.log("P2 Tactic 2.1::: \n",  prompt, '\n', response.choices[0].message)

/** 
 * 
 * Note that the student's solution is actually not correct.
 * We can fix this by instructing the model to work out its own solution first.
 * 
*/

prompt = `
Your task is to determine if the student's solution \
is correct or not.
To solve the problem do the following:
- First, work out your own solution to the problem including the final total. 
- Then compare your solution to the student's solution \ 
and evaluate if the student's solution is correct or not. 
Don't decide if the student's solution is correct until 
you have done the problem yourself.

Use the following format:
Question:

question here

Student's solution:

student's solution here

Actual solution:

steps to work out the solution and your solution here

Is the student's solution the same as actual solution \
just calculated:

yes or no

Student grade:

correct or incorrect


Question:

I'm building a solar power installation and I need help \
working out the financials. 
- Land costs $100 / square foot
- I can buy solar panels for $250 / square foot
- I negotiated a contract for maintenance that will cost \
me a flat $100k per year, and an additional $10 / square \
foot
What is the total cost for the first year of operations \
as a function of the number of square feet.
 
Student's solution:

Let x be the size of the installation in square feet.
Costs:
1. Land cost: 100x
2. Solar panel cost: 250x
3. Maintenance cost: 100,000 + 100x
Total cost: 100x + 250x + 100,000 + 100x = 450x + 100,000

Actual solution:`
response = await get_completion(prompt)
console.log("P2 Tactic 2.2::: \n",  prompt, '\n', response.choices[0].message)

/**
 * 
 * Model Limitations: Hallucinations
 * 
 */

prompt = `Tell me about AeroGlide UltraSlim Smart Toothbrush by Boie`
response = await get_completion(prompt)
console.log("Model Limitation Check:::: \n",  prompt, '\n', response.choices[0].message)
