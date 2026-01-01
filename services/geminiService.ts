
import { GoogleGenAI } from "@google/genai";

// Remediation plan generation service
export const generateRemediationPlan = async (systemState: any) => {
  try {
    // Initializing inside the function to ensure the latest API key is used as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Act as a Principal System Engineer for a high-performance FinTech platform.
      Analyze the following system metrics and cognitive load data:
      ${JSON.stringify(systemState)}
      
      Provide a brief, high-impact remediation plan in markdown format. 
      Focus on reducing cognitive load and protecting financial rails.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating AI analysis. Please check system status manually.";
  }
};
