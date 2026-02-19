const axios = require('axios');

class OpenRouterService {
    constructor() {
        this.apiKey = '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';
        this.apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
        this.model = 'minimax/minimax-m2.5';
    }

    /**
     * Analyze symptoms using OpenRouter AI
     * @param {string} symptoms - User's symptom description
     * @returns {Promise<Object>} - Structured AI analysis
     */
    async analyzeSymptoms(symptoms) {
        // Debug for Vercel logs (safe)
        console.log('AI Config Check:', {
            hasKey: !!this.apiKey,
            keyLength: this.apiKey ? this.apiKey.length : 0,
            model: this.model
        });

        if (!this.apiKey || this.apiKey === 'your_openrouter_api_key_here') {
            throw new Error('AI Service Error: OPENROUTER_API_KEY is not set on the server.');
        }

        try {
            const systemPrompt = `You are a medical assistant AI that helps users understand their symptoms. You must:
1. NEVER diagnose diseases
2. NEVER prescribe medications
3. ALWAYS include a medical disclaimer
4. Return ONLY valid JSON format
5. Detect emergency situations and set emergency_flag to true if symptoms indicate immediate medical attention needed

Analyze the symptoms and return a JSON object with this EXACT structure:
{
  "analysis_summary": "Brief overview of the reported symptoms",
  "possible_conditions": [
    {
      "condition": "General health concern name",
      "risk_level": "Low | Medium | High",
      "reason": "Why this might be relevant"
    }
  ],
  "recommended_specialist": "Type of healthcare professional to consult",
  "suggested_tests": ["List of common tests that might be relevant"],
  "emergency_flag": false,
  "disclaimer": "This result is for educational purposes only and is not a medical diagnosis. Always consult a qualified healthcare professional for medical advice."
}

Emergency symptoms include: severe chest pain, difficulty breathing, severe bleeding, loss of consciousness, severe head injury, stroke symptoms, severe allergic reactions, etc.`;

            const userPrompt = `Patient reports: ${symptoms}

Please analyze these symptoms and provide structured health insights in JSON format.`;

            const response = await axios.post(
                this.apiUrl,
                {
                    model: this.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt },
                    ],
                    temperature: 0.7,
                    max_tokens: 1000,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'https://genova-ai.app',
                        'X-Title': 'Genova AI Pre-Diagnostic Assistant',
                    },
                    timeout: 25000,
                }
            );

            console.log('OpenRouter Response Status:', response.status);
            if (!response.data || !response.data.choices || !response.data.choices[0]) {
                throw new Error('Invalid response from AI service');
            }

            let aiContent = response.data.choices[0].message.content;

            // Clean AI content if it contains markdown code blocks
            aiContent = aiContent.replace(/```json\n?/, '').replace(/```/, '').trim();

            // Parse JSON response
            let analysisResult;
            try {
                analysisResult = JSON.parse(aiContent);
            } catch (parseError) {
                console.error('JSON Parse Error. Content:', aiContent);
                throw new Error('AI returned invalid JSON format. Please try again.');
            }

            // Validate required fields
            const requiredFields = [
                'analysis_summary',
                'possible_conditions',
                'recommended_specialist',
                'suggested_tests',
                'emergency_flag',
                'disclaimer',
            ];

            const missingFields = requiredFields.filter(field => analysisResult[field] === undefined);

            if (missingFields.length > 0) {
                throw new Error(`AI response missing required fields: ${missingFields.join(', ')}`);
            }

            return analysisResult;
        } catch (error) {
            console.error('OpenRouter Service Error:', error.message);
            if (error.response) {
                console.error('API Error Response:', error.response.data);
                throw new Error(`AI Service Error: ${error.response.data.error?.message || 'Unknown error'}`);
            }
            throw error;
        }
    }

    async chat(message, history = []) {
        if (!this.isConfigured()) {
            throw new Error('AI Service is not configured. (Missing OpenRouter API Key)');
        }
        try {
            const systemPrompt = `You are Genova AI, a helpful and empathetic medical health assistant. 
            - Answer general health questions accurately.
            - Provide advice on lifestyle, nutrition, and wellness.
            - If asked about chronic or genetic diseases, provide detailed, understandable information.
            - ALWAYS state that you are an AI and not a substitute for a doctor.
            - Keep responses concise but informative.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                ...history,
                { role: 'user', content: message }
            ];

            const response = await axios.post(
                this.apiUrl,
                {
                    model: this.model,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 1000,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'https://genova-ai.app',
                        'X-Title': 'Genova AI Chat',
                    },
                    timeout: 30000,
                }
            );

            if (!response.data?.choices?.[0]) {
                throw new Error('Invalid response from AI service');
            }

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('OpenRouter Chat Error:', error.message);
            if (error.response) {
                console.error('OpenRouter Error Data:', error.response.data);
                throw new Error(`AI Service: ${error.response.data.error?.message || error.message}`);
            }
            throw error;
        }
    }

    /**
     * Validate API key configuration
     * @returns {boolean}
     */
    isConfigured() {
        return Boolean(this.apiKey && this.apiKey !== 'your_openrouter_api_key_here');
    }
}

module.exports = new OpenRouterService();
