import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Supported locales
const locales = ['en', 'fr', 'es', 'de', 'it', 'pt', 'ja', 'ko', 'zh', 'ar'] as const;
type Locale = typeof locales[number];

// Simple in-memory cache
const cache = new Map<string, string>();

// Rate limiting (simple in-memory)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, sourceLanguage = 'auto', targetLanguage, apiKey } = body;

    // Basic validation
    if (!text || !targetLanguage) {
      return NextResponse.json({
        success: false,
        error: 'Text and targetLanguage are required',
        code: 400
      }, { status: 400 });
    }

    if (!locales.includes(targetLanguage as Locale)) {
      return NextResponse.json({
        success: false,
        error: `Unsupported target language: ${targetLanguage}`,
        code: 400
      }, { status: 400 });
    }

    // Simple rate limiting (60 requests per minute)
    const clientId = request.ip || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 60;

    const clientData = rateLimit.get(clientId);
    if (clientData) {
      if (now < clientData.resetTime) {
        if (clientData.count >= maxRequests) {
          return NextResponse.json({
            success: false,
            error: 'Rate limit exceeded. Please try again later.',
            code: 429
          }, { status: 429 });
        }
        clientData.count++;
      } else {
        rateLimit.set(clientId, { count: 1, resetTime: now + windowMs });
      }
    } else {
      rateLimit.set(clientId, { count: 1, resetTime: now + windowMs });
    }

    // Check cache
    const cacheKey = `${sourceLanguage}-${targetLanguage}-${text}`;
    const cachedTranslation = cache.get(cacheKey);
    
    if (cachedTranslation) {
      return NextResponse.json({
        success: true,
        translatedText: cachedTranslation,
        sourceLanguage: sourceLanguage === 'auto' ? 'auto' : sourceLanguage,
        targetLanguage,
        cached: true,
        timestamp: new Date().toISOString()
      });
    }

    // Translate with OpenAI
    const systemPrompt = `You are a professional translator. Translate the following text from ${sourceLanguage === 'auto' ? 'the detected language' : sourceLanguage} to ${targetLanguage}. Only return the translated text, nothing else.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text }
      ],
      max_tokens: 1000,
      temperature: 0.3,
    });

    const translatedText = completion.choices[0]?.message?.content?.trim();

    if (!translatedText) {
      return NextResponse.json({
        success: false,
        error: 'Translation failed',
        code: 500
      }, { status: 500 });
    }

    // Cache the translation
    cache.set(cacheKey, translatedText);

    return NextResponse.json({
      success: true,
      translatedText,
      sourceLanguage: sourceLanguage === 'auto' ? 'auto' : sourceLanguage,
      targetLanguage,
      cached: false,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Translation error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 500
    }, { status: 500 });
  }
}

