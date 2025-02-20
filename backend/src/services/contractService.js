const OpenAI = require('openai');
const db = require('../models');
const { Contract } = db;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class ContractService {
  async generateContract(type, parameters) {
    try {
      const prompt = this.buildContractPrompt(type, parameters);
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a legal expert specialized in drafting contracts. Generate a professional, legally sound contract based on the provided parameters."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
      });

      const contractContent = completion.choices[0].message.content;
      
      // Generate a summary using a separate API call
      const summary = await this.generateContractSummary(contractContent);

      return {
        content: contractContent,
        summary: summary
      };
    } catch (error) {
      console.error('Error generating contract:', error);
      throw new Error('Failed to generate contract');
    }
  }

  buildContractPrompt(type, parameters) {
    const prompts = {
      'service_agreement': `Create a comprehensive service agreement with the following details:
        - Service Provider: ${parameters.provider}
        - Client: ${parameters.client}
        - Services: ${parameters.services.join(', ')}
        - Payment Terms: ${parameters.paymentTerms}
        - Duration: ${parameters.duration}`,
      'nda': `Create a non-disclosure agreement with the following details:
        - Parties: ${parameters.parties.join(' and ')}
        - Purpose: ${parameters.purpose}
        - Duration: ${parameters.duration}
        - Jurisdiction: ${parameters.jurisdiction}`,
      'employment': `Create an employment contract with the following details:
        - Employer: ${parameters.employer}
        - Employee: ${parameters.employee}
        - Position: ${parameters.position}
        - Salary: ${parameters.salary}
        - Start Date: ${parameters.startDate}
        - Benefits: ${parameters.benefits.join(', ')}`,
    };

    if (!prompts[type]) {
      throw new Error('Unsupported contract type');
    }

    return prompts[type];
  }

  async generateContractSummary(contractContent) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "Generate a clear, concise summary of the key points in this contract."
          },
          {
            role: "user",
            content: contractContent
          }
        ],
        temperature: 0.5,
        max_tokens: 250
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error generating contract summary:', error);
      return 'Summary generation failed';
    }
  }

  async saveContract(userId, contractData) {
    try {
      const contract = await Contract.create({
        userId,
        title: contractData.title,
        content: contractData.content,
        type: contractData.type,
        status: 'draft',
        parties: contractData.parties,
        effectiveDate: contractData.effectiveDate,
        expirationDate: contractData.expirationDate,
        aiGeneratedSummary: contractData.summary,
        metadata: contractData.metadata
      });

      return contract;
    } catch (error) {
      console.error('Error saving contract:', error);
      throw new Error('Failed to save contract');
    }
  }

  async reviewContract(contractId) {
    try {
      const contract = await Contract.findByPk(contractId);
      if (!contract) {
        throw new Error('Contract not found');
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a legal expert. Review this contract for potential issues, risks, and areas of improvement."
          },
          {
            role: "user",
            content: contract.content
          }
        ],
        temperature: 0.7
      });

      return {
        contractId: contractId,
        review: completion.choices[0].message.content
      };
    } catch (error) {
      console.error('Error reviewing contract:', error);
      throw new Error('Failed to review contract');
    }
  }
}

module.exports = new ContractService();
