
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateDescription(keywords: string): Promise<string> {
  if (!keywords.trim()) {
    return "";
  }

  const prompt = `
    Based on the following keywords, write a compelling and professional event space description of about 50-70 words.
    The tone should be inviting and highlight the key features. Do not use markdown.

    Keywords: "${keywords}"

    Description:
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating description:", error);
    return "Error: Could not generate a description at this time.";
  }
}
   