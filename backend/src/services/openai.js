const { OpenAI } = require('openai');

const openai = new OpenAI(process.env.OPENAI_API_KEY);

class OpenAIService {
  static async generateContract(type, parameters) {
    const systemPrompt = `You are a legal expert specialized in drafting ${type} contracts. 
    Create a professional and legally sound contract based on the provided parameters.
    The contract should be comprehensive and include all necessary clauses and provisions.`;

    const userPrompt = `Generate a ${type} contract with the following parameters:
    ${JSON.stringify(parameters, null, 2)}
    
    Format the contract with proper sections, numbering, and legal terminology.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    return completion.choices[0].message.content;
  }

  static async performComplianceCheck(businessData, regulations) {
    const systemPrompt = `You are a legal compliance expert. 
    Analyze the provided business data against the specified regulations and requirements.
    Provide a detailed compliance report with specific findings and recommendations.`;

    const userPrompt = `Perform a comprehensive compliance check for the following business:
    ${JSON.stringify(businessData, null, 2)}
    
    Against these regulations:
    ${JSON.stringify(regulations, null, 2)}
    
    Format the response as a structured report with:
    1. Executive Summary
    2. Compliance Status for each regulation
    3. Detailed Findings
    4. Specific Recommendations
    5. Risk Assessment`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.5,
      max_tokens: 4000
    });

    return completion.choices[0].message.content;
  }

  static async analyzeLegalDocument(document) {
    const systemPrompt = `You are a legal document analysis expert.
    Review the provided document and extract key information, obligations, and potential risks.`;

    const userPrompt = `Analyze the following legal document:
    ${document}
    
    Provide a detailed analysis including:
    1. Document Type and Purpose
    2. Key Terms and Conditions
    3. Important Dates and Deadlines
    4. Obligations and Requirements
    5. Potential Risks or Concerns
    6. Recommended Actions`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 4000
    });

    return completion.choices[0].message.content;
  }

  static async generateLegalSummary(document) {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a legal document summarizer. Create clear, concise summaries of legal documents in plain language."
        },
        {
          role: "user",
          content: `Summarize the following legal document in clear, simple terms that a non-lawyer can understand:
          ${document}`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    return completion.choices[0].message.content;
  }
}

module.exports = OpenAIService;
