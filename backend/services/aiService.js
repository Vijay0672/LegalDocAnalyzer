const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in the environment");
}

// Choose a current strong model
const model = genAI.getGenerativeModel({
  model: "gemini-flash-latest", // Updated to available model
  temperature: 0.2     // adjust as needed
});

const analyzeContractText = async (text) => {
  try {
    // truncate to reasonable size if needed
    const contractSnippet = text.length > 30000 ? text.slice(0, 30000) : text;

    const prompt = `
You are a legal expert AI.
Analyze the contract text below and return ONLY structured JSON in this exact format:

{
  "summary": "Plain english summary of the contract",
  "clauses": [
    {
      "id": "clause_1",
      "text": "Exact text snippet from contract",
      "riskLevel": "high/medium/low",
      "riskReason": "Explanation of why this is risky"
    }
  ]
}

Contract Text:
${contractSnippet}
    `;

    // Generate the response
    const result = await model.generateContent(prompt);

    const rawText = result.response?.text() || "";
    const cleaned = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Attempt parse
    let json;
    try {
      json = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("Parsing failed, raw output:", cleaned);
      throw new Error("Unable to parse AI response as JSON");
    }

    return json;
  } catch (err) {
    console.error("AI analysis failed:", err);
    throw err;
  }
};

module.exports = { analyzeContractText };
