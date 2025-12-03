import { GoogleGenAI } from "@google/genai";
import { User, Reward } from "../types";

const API_KEY = process.env.API_KEY || ''; // Ensure this is set in your environment

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getStrategicAdvice = async (
  user: User, 
  rewards: Reward[], 
  userQuery: string
): Promise<string> => {
  if (!API_KEY) {
    return "AI Advisor is currently unavailable (Missing API Key).";
  }

  const model = "gemini-2.5-flash";
  
  const systemInstruction = `
    You are the AI Strategic Planner for the Techno Center Loyalty Program.
    Your goal is to help employees (Mitra) calculate how to reach their desired rewards.
    
    RULES:
    1. 1 Sprint = 20 Tokens.
    2. Be encouraging but mathematically precise.
    3. Analyze the User's current balance and the Reward Catalog.
    4. If a user asks about a specific item, calculate the "Gap" (Price - Balance).
    5. Convert the Gap into number of Sprints needed (Gap / 20).
    6. Suggest the most efficient path.
    7. Keep responses concise and helpful.
    
    CURRENT USER CONTEXT:
    - Name: ${user.name}
    - Current Tokens: ${user.tokens}
    - Grade: ${user.grade}
    
    REWARD CATALOG:
    ${JSON.stringify(rewards.map(r => ({ name: r.name, cost: r.cost })))}
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "I couldn't generate a strategy at this moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I'm having trouble connecting to the strategy mainframe.";
  }
};