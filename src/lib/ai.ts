import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini API client
// The API key is automatically injected into the environment by AI Studio
export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generatePrompts(category: string, input: string, isProMode: boolean): Promise<string[]> {
  try {
    const promptText = `Generate 5 highly detailed, creative, and professional prompts for the category "${category}" based on the user's idea: "${input}". 
    ${isProMode ? 'PRO MODE IS ON: Make the prompts extremely long, advanced, comprehensive, and include specific parameters, negative prompts (if applicable), and structural formatting.' : 'Make them ready-to-use, optimized, and concise.'}
    
    Return ONLY a valid JSON array of 5 strings. Each string should be one complete prompt.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    const prompts: string[] = JSON.parse(response.text);
    return prompts;
  } catch (error) {
    console.error("Error generating prompts:", error);
    throw error;
  }
}

export async function improvePrompt(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Take the following prompt and rewrite it to be significantly better, more professional, more detailed, and highly optimized for AI models. 
      Return ONLY the improved prompt text, nothing else.
      
      Original Prompt: "${prompt}"`
    });

    return response.text?.trim() || prompt;
  } catch (error) {
    console.error("Error improving prompt:", error);
    throw error;
  }
}
