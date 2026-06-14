import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config({
  path: "../.env"
});


const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: [
        {
            role: 'user',
            parts: [{text: "What is my name?"}]
        },
        {
            role: 'model',
            parts: [{text: "I don't know your name yet! Since I don't have access to your personal information or past conversations, you'll have to tell me. What should I call you?"}]
        },
        {
            role: 'user',
            parts: [{text: "My name is Dhruv Sorout"}]
        },
        {
            role: 'model',
            parts: [{text: "Nice to meet you, Dhruv! How can I help you today"}]
        },
        {
            role: 'user',
            parts: [{text: "What is my name?"}]
        },
    ],
  });

  console.log(response.text);
}

main();