Integrating different LLM models with JavaScript

Please add .env & update API keys for the particular to have the models integrated.
1. OpenAI
- export OPENAI_API_KEY=""
2. GROQ
- export GROQ_API_KEY=""
3. GEMINI (API keys will be same for both)
- export GEMINI_API_KEY=""
- export GOOGLE_API_KEY=""

Prompt Building Blocks (Credits to Groq)
Most high-quality prompts contain five elements: role, instructions, context, input, expected output.

Element: What it does
Role: Sets persona or expertise ("You are a data analyst…")
Instructions: Bullet-proof list of required actions
Context: Background knowledge or reference material
Input: The data or question to transform
Expected Output: Schema or miniature example to lock formatting