export const locales = ['en', 'zh', 'hi', 'es', 'fr', 'ar', 'bn', 'ru', 'pt', 'id', 'ja', 'de', 'ko', 'it', 'tr'] as const;
export const defaultLocale = 'en' as const;

export type Locale = typeof locales[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
  hi: 'हिन्दी',
  es: 'Español',
  fr: 'Français',
  ar: 'العربية',
  bn: 'বাংলা',
  ru: 'Русский',
  pt: 'Português',
  id: 'Bahasa Indonesia',
  ja: '日本語',
  de: 'Deutsch',
  ko: '한국어',
  it: 'Italiano',
  tr: 'Türkçe'
};

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  zh: '🇨🇳',
  hi: '🇮🇳',
  es: '🇪🇸',
  fr: '🇫🇷',
  ar: '🇸🇦',
  bn: '🇧🇩',
  ru: '🇷🇺',
  pt: '🇵🇹',
  id: '🇮🇩',
  ja: '🇯🇵',
  de: '🇩🇪',
  ko: '🇰🇷',
  it: '🇮🇹',
  tr: '🇹🇷'
};

export const rtlLocales: Locale[] = ['ar'];

export function isRTL(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

