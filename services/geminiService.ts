import { GoogleGenAI } from "@google/genai";
import { Supplier, Alert } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateSupplierSummary = async (supplier: Supplier, recentAlerts: Alert[]): Promise<string> => {
  if (!apiKey) return "AI Summary unavailable: API Key missing.";

  const prompt = `
    Analyze the following supplier performance data and provide a concise, natural language summary (max 100 words).
    Highlight key risks, recent trends, and overall status.
    
    Supplier: ${JSON.stringify(supplier)}
    Recent Alerts: ${JSON.stringify(recentAlerts)}
    
    Format as a professional procurement briefing.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No summary generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate summary due to an error.";
  }
};

export const recommendBestSupplier = async (suppliers: Supplier[]): Promise<string> => {
  if (!apiKey) return "AI Analysis unavailable: API Key missing.";

  // Filter to top 5 to keep context small
  const topSuppliers = suppliers.slice(0, 5);

  const prompt = `
    Act as a senior procurement analyst.
    Review the following list of top suppliers and recommend the "Best Overall Supplier".
    Consider 'overall_score' (higher is better) and 'risk_level' (lower is better).
    
    Suppliers: ${JSON.stringify(topSuppliers)}
    
    Provide the recommendation in this format:
    "**[Supplier Name]** is the top choice because [Reasoning]. Key strengths: [Strength 1], [Strength 2]."
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No recommendation generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to analyze suppliers.";
  }
};
