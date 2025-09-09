import OpenAI from 'openai';
import { locales, type Locale } from '@/i18n/config';

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }
  
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export interface TranslationOptions {
  text: string;
  sourceLanguage?: Locale | 'auto';
  targetLanguage: Locale;
  model?: string;
}

export interface TranslationResult {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  provider: string;
  model: string;
  tokensUsed: number;
  cost: number; // in cents
}

const MODEL_COSTS = {
  'gpt-4': 0.03, // $0.03 per 1K tokens
  'gpt-4-turbo': 0.01,
  'gpt-3.5-turbo': 0.002,
} as const;

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  zh: 'Chinese (Simplified)',
  hi: 'Hindi',
  es: 'Spanish',
  fr: 'French',
  ar: 'Arabic',
  bn: 'Bengali',
  ru: 'Russian',
  pt: 'Portuguese',
  id: 'Indonesian',
  ja: 'Japanese',
  de: 'German',
  ko: 'Korean',
  it: 'Italian',
  tr: 'Turkish',
};

export async function translateText({
  text,
  sourceLanguage = 'auto',
  targetLanguage,
  model = 'gpt-3.5-turbo',
}: TranslationOptions): Promise<TranslationResult> {
  try {
    const openai = getOpenAI();
    const sourceLangName = sourceLanguage === 'auto' 
      ? 'auto-detect' 
      : LANGUAGE_NAMES[sourceLanguage] || sourceLanguage;
    
    const targetLangName = LANGUAGE_NAMES[targetLanguage] || targetLanguage;

    const systemPrompt = `You are a professional translator. Translate the following text from ${sourceLangName} to ${targetLangName}. 
    
    Rules:
    - Maintain the original tone and style
    - Preserve any formatting (markdown, HTML, etc.)
    - If the text contains code or technical terms, keep them in their original language
    - Return only the translated text, no explanations
    - If the text is already in the target language, return it unchanged`;

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
      temperature: 0.3,
      max_tokens: Math.min(4000, text.length * 2), // Estimate tokens needed
    });

    const translatedText = completion.choices[0]?.message?.content || '';
    const tokensUsed = completion.usage?.total_tokens || 0;
    
    // Calculate cost (input tokens are cheaper than output tokens)
    const inputTokens = completion.usage?.prompt_tokens || 0;
    const outputTokens = completion.usage?.completion_tokens || 0;
    const costPer1K = MODEL_COSTS[model as keyof typeof MODEL_COSTS] || MODEL_COSTS['gpt-3.5-turbo'];
    
    // Rough cost calculation (input tokens are ~1/3 the cost of output tokens)
    const cost = Math.round(
      ((inputTokens * costPer1K * 0.33) + (outputTokens * costPer1K)) / 1000 * 100
    ); // Convert to cents

    return {
      translatedText,
      sourceLanguage: sourceLanguage === 'auto' ? 'auto' : sourceLanguage,
      targetLanguage,
      provider: 'openai',
      model,
      tokensUsed,
      cost,
    };
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error(`Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function detectLanguage(text: string): Promise<Locale | 'auto'> {
  try {
    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a language detection expert. Identify the language of the following text and return only the ISO 639-1 language code (e.g., 'en', 'fr', 'es', etc.). If you're unsure, return 'auto'.`,
        },
        { role: 'user', content: text },
      ],
      temperature: 0.1,
      max_tokens: 10,
    });

    const detectedLanguage = completion.choices[0]?.message?.content?.trim().toLowerCase() || 'auto';
    
    // Validate that it's a supported language
    if (locales.includes(detectedLanguage as Locale)) {
      return detectedLanguage as Locale;
    }
    
    return 'auto';
  } catch (error) {
    console.error('Language detection error:', error);
    return 'auto';
  }
}

export function calculateCost(text: string, model: string = 'gpt-3.5-turbo'): number {
  // Rough estimation: 1 token ≈ 4 characters for English
  const estimatedTokens = Math.ceil(text.length / 4);
  const costPer1K = MODEL_COSTS[model as keyof typeof MODEL_COSTS] || MODEL_COSTS['gpt-3.5-turbo'];
  
  return Math.round((estimatedTokens * costPer1K) / 1000 * 100); // Convert to cents
}
