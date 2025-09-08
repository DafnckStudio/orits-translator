import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from '@/db/connection';
import { translationsCache } from '@/db/schema';
import crypto from 'crypto';
import type { Locale } from '@/i18n/config';

export interface CacheEntry {
  id: string;
  sourceLanguage: string;
  targetLanguage: string;
  sourceText: string;
  translatedText: string;
  sourceHash: string;
  provider: string;
  model: string | null;
  tokensUsed: number | null;
  cost: number | null;
  createdAt: Date;
}

export function generateTextHash(text: string, sourceLanguage: string, targetLanguage: string): string {
  const content = `${text.toLowerCase().trim()}:${sourceLanguage}:${targetLanguage}`;
  return crypto.createHash('sha256').update(content).digest('hex');
}

export async function getCachedTranslation(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<CacheEntry | null> {
  const hash = generateTextHash(text, sourceLanguage, targetLanguage);
  
  const result = await db
    .select()
    .from(translationsCache)
    .where(
      and(
        eq(translationsCache.sourceHash, hash),
        eq(translationsCache.sourceLanguage, sourceLanguage),
        eq(translationsCache.targetLanguage, targetLanguage)
      )
    )
    .limit(1);

  return result[0] || null;
}

export async function cacheTranslation(
  sourceText: string,
  translatedText: string,
  sourceLanguage: string,
  targetLanguage: string,
  provider: string,
  model?: string,
  tokensUsed?: number,
  cost?: number
): Promise<void> {
  const hash = generateTextHash(sourceText, sourceLanguage, targetLanguage);
  
  await db.insert(translationsCache).values({
    sourceText,
    translatedText,
    sourceLanguage,
    targetLanguage,
    sourceHash: hash,
    provider,
    model,
    tokensUsed,
    cost,
  });
}

export async function getCacheStats(): Promise<{
  totalEntries: number;
  totalCost: number;
  totalTokens: number;
  topLanguages: Array<{ language: string; count: number }>;
  recentTranslations: Array<{ text: string; translatedText: string; createdAt: Date }>;
}> {
  const [totalResult, costResult, tokensResult, languageResult, recentResult] = await Promise.all([
    db.select({ count: translationsCache.id }).from(translationsCache),
    db.select({ total: translationsCache.cost }).from(translationsCache),
    db.select({ total: translationsCache.tokensUsed }).from(translationsCache),
    db
      .select({ 
        language: translationsCache.targetLanguage,
        count: sql<number>`count(*)`
      })
      .from(translationsCache)
      .groupBy(translationsCache.targetLanguage)
      .orderBy(desc(sql`count(*)`))
      .limit(10),
    db
      .select({
        text: translationsCache.sourceText,
        translatedText: translationsCache.translatedText,
        createdAt: translationsCache.createdAt,
      })
      .from(translationsCache)
      .orderBy(desc(translationsCache.createdAt))
      .limit(10),
  ]);

  return {
    totalEntries: totalResult.length,
    totalCost: costResult.reduce((sum, row) => sum + (row.total || 0), 0),
    totalTokens: tokensResult.reduce((sum, row) => sum + (row.total || 0), 0),
    topLanguages: languageResult.map(row => ({
      language: row.language,
      count: row.count,
    })),
    recentTranslations: recentResult,
  };
}

export async function clearOldCache(olderThanDays: number = 30): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
  
  const result = await db
    .delete(translationsCache)
    .where(eq(translationsCache.createdAt, cutoffDate));
  
  return result.length || 0;
}

export async function searchCache(
  query: string,
  limit: number = 10
): Promise<CacheEntry[]> {
  const result = await db
    .select()
    .from(translationsCache)
    .where(
      and(
        // Search in both source and translated text
        // Note: This is a simple LIKE search, for production you might want full-text search
        eq(translationsCache.sourceText, `%${query}%`),
        eq(translationsCache.translatedText, `%${query}%`)
      )
    )
    .orderBy(desc(translationsCache.createdAt))
    .limit(limit);

  return result;
}
