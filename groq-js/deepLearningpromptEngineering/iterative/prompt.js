/**
 * 
 * Iteratively analyze and refine your prompts to generate marketing copy from a product fact sheet.
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
 * Generate a marketing product description from a product fact sheet
 * 
 */

text = `OVERVIEW
- Part of a beautiful family of mid-century inspired office furniture, 
including filing cabinets, desks, bookcases, meeting tables, and more.
- Several options of shell color and base finishes.
- Available with plastic back and front upholstery (SWC-100) 
or full upholstery (SWC-110) in 10 fabric and 6 leather options.
- Base finish options are: stainless steel, matte black, 
gloss white, or chrome.
- Chair is available with or without armrests.
- Suitable for home or business settings.
- Qualified for contract use.

CONSTRUCTION
- 5-wheel plastic coated aluminum base.
- Pneumatic chair adjust for easy raise/lower action.

DIMENSIONS
- WIDTH 53 CM | 20.87”
- DEPTH 51 CM | 20.08”
- HEIGHT 80 CM | 31.50”
- SEAT HEIGHT 44 CM | 17.32”
- SEAT DEPTH 41 CM | 16.14”

OPTIONS
- Soft or hard-floor caster options.
- Two choices of seat foam densities: 
 medium (1.8 lb/ft3) or high (2.8 lb/ft3)
- Armless or 8 position PU armrests 

MATERIALS
SHELL BASE GLIDER
- Cast Aluminum with modified nylon PA6/PA66 coating.
- Shell thickness: 10 mm.
SEAT
- HD36 foam

COUNTRY OF ORIGIN
- Italy
`

prompt = `Your task is to help a marketing team create a 
description for a retail website of a product based 
on a technical fact sheet.

Write a product description based on the information 
provided in the technical specifications delimited by 
<>.

Technical specifications: <${text}>`
response = await get_completion(prompt)
console.log('Description: \n ', prompt, '\n', response.choices[0].message)

/**
 * 
 * Issue 1: The text is too long
 * Limit the number of words/sentences/characters.
 * 
 */

prompt = `Your task is to help a marketing team create a 
description for a retail website of a product based 
on a technical fact sheet.

Write a product description based on the information 
provided in the technical specifications delimited by 
<>.

Use at most 50 words.

Technical specifications: <${text}>`
response = await get_completion(prompt)
console.log('Issue 1 Description: \n ', prompt, '\n', response.choices[0].message)

/**
 * 
 * Issue 2. Text focuses on the wrong details
 * Ask it to focus on the aspects that are relevant to the intended audience.
 * 
 */

prompt = `Your task is to help a marketing team create a 
description for a retail website of a product based 
on a technical fact sheet.

Write a product description based on the information 
provided in the technical specifications delimited by 
<>.

The description is intended for furniture retailers, 
so should be technical in nature and focus on the 
materials the product is constructed from.

Use at most 50 words.

Technical specifications: <${text}>`
response = await get_completion(prompt)
console.log('Issue 2.1 Description: \n ', prompt, '\n', response.choices[0].message)

prompt = `Your task is to help a marketing team create a 
description for a retail website of a product based 
on a technical fact sheet.

Write a product description based on the information 
provided in the technical specifications delimited by 
<>.

The description is intended for furniture retailers, 
so should be technical in nature and focus on the 
materials the product is constructed from.

At the end of the description, include every 7-character 
Product ID in the technical specification.

Use at most 50 words.

Technical specifications: <${text}>`
response = await get_completion(prompt)
console.log('Issue 2.2 Description: \n ', prompt, '\n', response.choices[0].message)

/**
 * 
 * Issue 3. Description needs a table of dimensions
 * Ask it to extract information and organize it in a table.
 * 
 */

prompt = `Your task is to help a marketing team create a 
description for a retail website of a product based 
on a technical fact sheet.

Write a product description based on the information 
provided in the technical specifications delimited by 
<>.

The description is intended for furniture retailers, 
so should be technical in nature and focus on the 
materials the product is constructed from.

At the end of the description, include every 7-character 
Product ID in the technical specification.

After the description, include a table that gives the 
product's dimensions. The table should have two columns.
In the first column include the name of the dimension. 
In the second column include the measurements in inches only.

Give the table the title 'Product Dimensions'.

Format everything as HTML that can be used in a website. 
Place the description in a <div> element.

Technical specifications: <${text}>`
response = await get_completion(prompt)
console.log('Issue 3 Description: \n ', prompt, '\n', response.choices[0].message)
