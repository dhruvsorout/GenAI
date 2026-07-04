import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import readlineSync from "readline-sync";

dotenv.config({
  path: "../.env",
});

const ai = new GoogleGenAI({});

/* -------------------- TOOLS -------------------- */

async function cryptoCurrency({ coin }) {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${coin}`
  );

  return await response.json();
}

async function weatherInformation({ city }) {
  const response = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}&aqi=no`
  );

  return await response.json();
}

const toolFunctions = {
  cryptoCurrency,
  weatherInformation,
};

/* -------------------- TOOL DECLARATIONS -------------------- */

const tools = [
  {
    functionDeclarations: [
      {
        name: "cryptoCurrency",
        description:
          "Returns current cryptocurrency information like Bitcoin, Ethereum, Solana etc.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            coin: {
              type: Type.STRING,
              description: "Cryptocurrency name",
            },
          },
          required: ["coin"],
        },
      },

      {
        name: "weatherInformation",
        description: "Returns current weather of a city.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            city: {
              type: Type.STRING,
              description: "City name",
            },
          },
          required: ["city"],
        },
      },
    ],
  },
];

/* -------------------- CHAT HISTORY -------------------- */

const History = [];

/* -------------------- AGENT -------------------- */

async function runAgent() {
  while (true) {
    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: History,
      config: {
        tools,
      },
    });

    // Preserve the ENTIRE model response
    History.push(result.candidates[0].content);

    if (result.functionCalls?.length) {
      const functionCall = result.functionCalls[0];

      const tool = toolFunctions[functionCall.name];

      if (!tool) {
        console.log(`Unknown tool: ${functionCall.name}`);
        break;
      }

      const toolResult = await tool(functionCall.args);

      History.push({
        role: "user",
        parts: [
          {
            functionResponse: {
              name: functionCall.name,
              response: {
                result: toolResult,
              },
            },
          },
        ],
      });

      continue;
    }

    console.log(result.text);
    break;
  }
}

/* -------------------- CHAT LOOP -------------------- */

while (true) {
  const question = readlineSync.question("\nAsk me anything: ");

  if (question.toLowerCase() === "exit") {
    break;
  }

  History.push({
    role: "user",
    parts: [
      {
        text: question,
      },
    ],
  });

  await runAgent();
}