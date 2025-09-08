import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Simple in-memory cache
const cache = new Map<string, string>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, targetLanguage } = body;

    // Basic validation
    if (!text || !targetLanguage) {
      return NextResponse.json({
        success: false,
        error: 'Text and targetLanguage are required',
        code: 400
      }, { status: 400 });
    }

    // Check cache first
    const cacheKey = `${targetLanguage}-${text}`;
    const cachedTranslation = cache.get(cacheKey);
    
    if (cachedTranslation) {
      return NextResponse.json({
        success: true,
        translatedText: cachedTranslation,
        targetLanguage,
        cached: true,
        timestamp: new Date().toISOString()
      });
    }

    // Simple translation mapping for demo
    const translations: Record<string, Record<string, string>> = {
      'fr': {
        'Hello, world!': 'Bonjour le monde !',
        'How are you?': 'Comment allez-vous ?',
        'Good morning': 'Bonjour',
        'Thank you': 'Merci',
        'Goodbye': 'Au revoir'
      },
      'es': {
        'Hello, world!': '¡Hola mundo!',
        'How are you?': '¿Cómo estás?',
        'Good morning': 'Buenos días',
        'Thank you': 'Gracias',
        'Goodbye': 'Adiós'
      },
      'de': {
        'Hello, world!': 'Hallo Welt!',
        'How are you?': 'Wie geht es dir?',
        'Good morning': 'Guten Morgen',
        'Thank you': 'Danke',
        'Goodbye': 'Auf Wiedersehen'
      }
    };

    let translatedText = text; // Default to original text

    if (translations[targetLanguage] && translations[targetLanguage][text]) {
      translatedText = translations[targetLanguage][text];
    } else {
      // For demo purposes, add a prefix to show it's "translated"
      translatedText = `[${targetLanguage.toUpperCase()}] ${text}`;
    }

    // Cache the translation
    cache.set(cacheKey, translatedText);

    return NextResponse.json({
      success: true,
      translatedText,
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