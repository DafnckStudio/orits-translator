'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LanguageSelector } from '@/components/language-selector';
import { locales, localeNames, localeFlags } from '@/i18n/config';
import { Copy, RotateCcw, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface TranslationResult {
  success: boolean;
  translatedText?: string;
  sourceLanguage?: string;
  targetLanguage: string;
  provider?: string;
  model?: string;
  tokensUsed?: number;
  cost?: number;
  cached?: boolean;
  error?: string;
}

export function TranslationInterface() {
  const t = useTranslations();
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('fr');
  const [apiKey, setApiKey] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTranslate = useCallback(async () => {
    if (!sourceText.trim() || !apiKey.trim()) return;

    setIsTranslating(true);
    setResult(null);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: sourceText,
          sourceLanguage: sourceLanguage === 'auto' ? undefined : sourceLanguage,
          targetLanguage,
          apiKey,
        }),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        setTranslatedText(data.translatedText || '');
      }
    } catch (error) {
      setResult({
        success: false,
        targetLanguage,
        error: 'Network error occurred',
      });
    } finally {
      setIsTranslating(false);
    }
  }, [sourceText, sourceLanguage, targetLanguage, apiKey]);

  const handleCopy = useCallback(async () => {
    if (!translatedText) return;

    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  }, [translatedText]);

  const handleSwap = useCallback(() => {
    if (sourceLanguage !== 'auto') {
      setSourceLanguage(targetLanguage);
    }
    setTargetLanguage(sourceLanguage === 'auto' ? 'en' : sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  }, [sourceLanguage, targetLanguage, sourceText, translatedText]);

  const handleClear = useCallback(() => {
    setSourceText('');
    setTranslatedText('');
    setResult(null);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{t('translation.title')}</h1>
        <p className="text-muted-foreground">{t('translation.description')}</p>
      </div>

      {/* API Key Input */}
      <div className="space-y-2">
        <label htmlFor="api-key" className="text-sm font-medium">
          {t('translation.apiKey')}
        </label>
        <Input
          id="api-key"
          type="password"
          placeholder="Enter your API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Language Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('translation.sourceLanguage')}</label>
          <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">
                <div className="flex items-center gap-2">
                  <span>🌐</span>
                  <span>{t('translation.autoDetect')}</span>
                </div>
              </SelectItem>
              {locales.map((locale) => (
                <SelectItem key={locale} value={locale}>
                  <div className="flex items-center gap-2">
                    <span>{localeFlags[locale]}</span>
                    <span>{localeNames[locale]}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={handleSwap}
            disabled={isTranslating}
            className="h-10 w-10"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t('translation.targetLanguage')}</label>
          <Select value={targetLanguage} onValueChange={setTargetLanguage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {locales.map((locale) => (
                <SelectItem key={locale} value={locale}>
                  <div className="flex items-center gap-2">
                    <span>{localeFlags[locale]}</span>
                    <span>{localeNames[locale]}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Translation Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Text */}
        <div className="space-y-2">
          <label htmlFor="source-text" className="text-sm font-medium">
            {t('translation.enterText')}
          </label>
          <Textarea
            id="source-text"
            placeholder="Enter text to translate..."
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            className="min-h-[200px] resize-none"
            maxLength={10000}
          />
          <div className="text-xs text-muted-foreground text-right">
            {sourceText.length}/10,000 characters
          </div>
        </div>

        {/* Translated Text */}
        <div className="space-y-2">
          <label htmlFor="translated-text" className="text-sm font-medium">
            {t('translation.translatedText')}
          </label>
          <div className="relative">
            <Textarea
              id="translated-text"
              placeholder="Translated text will appear here..."
              value={translatedText}
              readOnly
              className="min-h-[200px] resize-none pr-10"
            />
            {translatedText && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="absolute top-2 right-2 h-8 w-8"
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={handleTranslate}
          disabled={!sourceText.trim() || !apiKey.trim() || isTranslating}
          className="min-w-[120px]"
        >
          {isTranslating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Translating...
            </>
          ) : (
            t('translation.translate')
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={handleClear}
          disabled={isTranslating}
        >
          {t('translation.clear')}
        </Button>
      </div>

      {/* Result Status */}
      {result && (
        <div className={`p-4 rounded-lg border ${
          result.success 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {result.success ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <div className="flex-1">
              {result.success ? (
                <div className="space-y-1">
                  <p className="font-medium">Translation successful!</p>
                  {result.cached && (
                    <p className="text-sm opacity-75">Served from cache</p>
                  )}
                  {result.tokensUsed && (
                    <p className="text-sm opacity-75">
                      Tokens used: {result.tokensUsed} | Cost: ${(result.cost || 0) / 100}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <p className="font-medium">Translation failed</p>
                  <p className="text-sm">{result.error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Language Selector */}
      <div className="flex justify-center pt-4 border-t">
        <LanguageSelector variant="dropdown" />
      </div>
    </div>
  );
}

