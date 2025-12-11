let context = [
  {
    role: "system",
    content: `
        You are OrderBot, an automated service to collect orders for a pizza restaurant.
        You first greet the customer, then collect the order,
        and then ask if it's a pickup or delivery.
        You wait to collect the entire order, then summarize it and check for a final
        time if the customer wants to add anything else.
        If it's a delivery, you ask for an address.
        Finally you collect the payment.
        Make sure to clarify all options, extras and sizes to uniquely
        identify the item from the menu.
        You respond in a short, very conversational friendly style.
        The menu includes
        pepperoni pizza  12.95, 10.00, 7.00
        cheese pizza   10.95, 9.25, 6.50
        eggplant pizza   11.95, 9.75, 6.75
        fries 4.50, 3.50
        greek salad 7.25
        Toppings:
        extra cheese 2.00,
        mushrooms 1.50
        sausage 3.00
        canadian bacon 3.50
        AI sauce 1.50
        peppers 1.00
        Drinks:
        coke 3.00, 2.00, 1.00
        sprite 3.00, 2.00, 1.00
        bottled water 5.00
            `
  }
];

// DOM references
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

const uuid = () => "msg-" + Math.random().toString(36).substr(2, 9);

// 1️⃣ Function to call the LLM API
async function getCompletionFromMessages(messages) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: messages,
        // temperature: 0.7
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP ERROR: ${response.status}`);
    }

    const data = await response.json();

    // Handles this error:
    // TypeError: Cannot read properties of undefined (reading '0')
    if (!data?.choices?.[0]?.message?.content) {
        throw new Error("Malformed API Response");
    }

    return data.choices[0].message.content;
}


// ADD MESSAGE BUBBLE
function appendBubble(type, text) {
  const bubbleId = uuid();

  const div = document.createElement("div");
  div.className = `bubble ${type}`;
  div.setAttribute("id", bubbleId);
  div.textContent = text;

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;

  return bubbleId;
}

// MARK BUBBLE AS FAILED
function markBubbleAsFailed(bubbleId, messageText) {
  const bubble = document.getElementById(bubbleId);
  if (!bubble) return;

  // Add error class
  bubble.classList.add("failed");

  // Add small red dot
  const err = document.createElement("span");
  err.className = "error-icon";
  err.title = "Message not sent. Click to retry.";
  err.innerHTML = "⚠️";

  // Click to retry
  err.onclick = () => {
    bubble.classList.remove("failed");
    bubble.querySelector(".error-icon")?.remove();
    sendMessage(messageText, bubbleId); // retry without new bubble
  };

  bubble.appendChild(err);
}


// CLEAR FAILED ICON ON SUCCESS
function clearErrorState(bubbleId) {
  const bubble = document.getElementById(bubbleId);
  if (!bubble) return;

  bubble.classList.remove("failed");
  bubble.querySelector(".error-icon")?.remove();
}

async function sendMessage(originalText = null, bubbleId = null) {
    const prompt = originalText ?? userInput.value.trim();
    if (!prompt) return;

    // fresh input -> clear
    if (!originalText) userInput.value = "";

    // If retry → do NOT append bubble again
    if (!bubbleId) {
        bubbleId = appendBubble("user", prompt);
        context.push({ role: "user", content: prompt });
    }

    try {
        const response = await getCompletionFromMessages(context);
        appendBubble("assistant", response);
        context.push({ role: "assistant", content: response });

        clearErrorState(bubbleId); // remove red bubble if re-sent OK

    } catch (error) {
        console.error("API Error:", error);
        markBubbleAsFailed(bubbleId, prompt); // add red retry icon
    }
}

// 4️⃣ For final JSON summary (like Python code at the end)
async function getOrderSummaryJSON() {
    const messages = [...context];

    messages.push({
        role: "system",
        content: `
            Create a JSON summary of the previous food order.
            The fields should include:
            1) pizza + size
            2) list of toppings
            3) list of drinks + size
            4) list of sides + size
            5) total price
            `
    });

    const response = await getCompletionFromMessages(messages);
    console.log("Order Summary JSON:", response);
}