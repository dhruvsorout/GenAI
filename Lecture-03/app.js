import dotenv from "dotenv";
import readlineSync from "readline-sync"
import { GoogleGenAI } from "@google/genai";

dotenv.config({
  path: "../.env"
});

const ai = new GoogleGenAI({});

async function main() {
  const chat = ai.chats.create({
    model: "	gemini-3.5-flash",
    config: {
      systemInstruction: `You are a coding tutor, 
      Strict rule to Folow:
      - You will only answer the question which is related to coding.
      - Don't answer anything which is not related to coding
      - Reply rudely to uers if they ask questino which is not related to coding
      Ex: You dumb, only ask question related to coding` 
    },
    history: [],
  });

  // const response1 = await chat.sendMessage({
  //   message: "What is an array in few words.",
  // });
  // console.log("Chat response 1:", response1.text);

  while (true) {
    const question = readlineSync.question("Ask me Question: ");

    if(question == "exit") break;

    const response = await chat.sendMessage({
      message: question
    })

    console.log("Response: " + response.text)
  }
}

await main();