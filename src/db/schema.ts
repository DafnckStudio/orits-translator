import { pgTable, text, timestamp, uuid, integer, boolean, index } from 'drizzle-orm/pg-core';
import { z } from 'zod';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  locale: text('locale').default('en').notNull(),
  apiKey: text('api_key').unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Translation cache table
export const translationsCache = pgTable('translations_cache', {
  id: uuid('id').primaryKey().defaultRandom(),
  sourceLanguage: text('source_language').notNull(),
  targetLanguage: text('target_language').notNull(),
  sourceText: text('source_text').notNull(),
  translatedText: text('translated_text').notNull(),
  sourceHash: text('source_hash').notNull(),
  provider: text('provider').default('openai').notNull(),
  model: text('model'),
  tokensUsed: integer('tokens_used'),
  cost: integer('cost'), // in cents
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  sourceHashIdx: index('source_hash_idx').on(table.sourceHash),
  languagePairIdx: index('language_pair_idx').on(table.sourceLanguage, table.targetLanguage),
  createdAtIdx: index('created_at_idx').on(table.createdAt),
}));

// API usage tracking
export const apiUsage = pgTable('api_usage', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  apiKey: text('api_key'),
  endpoint: text('endpoint').notNull(),
  method: text('method').notNull(),
  statusCode: integer('status_code').notNull(),
  responseTime: integer('response_time'), // in milliseconds
  tokensUsed: integer('tokens_used'),
  cost: integer('cost'), // in cents
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('user_id_idx').on(table.userId),
  apiKeyIdx: index('api_key_idx').on(table.apiKey),
  createdAtIdx: index('api_usage_created_at_idx').on(table.createdAt),
}));

// Rate limiting
export const rateLimits = pgTable('rate_limits', {
  id: uuid('id').primaryKey().defaultRandom(),
  identifier: text('identifier').notNull(), // API key or IP address
  endpoint: text('endpoint').notNull(),
  requests: integer('requests').default(0).notNull(),
  windowStart: timestamp('window_start').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  identifierIdx: index('rate_limit_identifier_idx').on(table.identifier),
  endpointIdx: index('rate_limit_endpoint_idx').on(table.endpoint),
}));

// Zod schemas for validation
export const insertUserSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email(),
  name: z.string().optional(),
  locale: z.string().default('en'),
  apiKey: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const selectUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nullable(),
  locale: z.string(),
  apiKey: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const insertTranslationCacheSchema = z.object({
  id: z.string().uuid().optional(),
  sourceLanguage: z.string(),
  targetLanguage: z.string(),
  sourceText: z.string(),
  translatedText: z.string(),
  sourceHash: z.string(),
  provider: z.string().default('openai'),
  model: z.string().optional(),
  tokensUsed: z.number().optional(),
  cost: z.number().optional(),
  createdAt: z.date().optional(),
});

export const selectTranslationCacheSchema = z.object({
  id: z.string().uuid(),
  sourceLanguage: z.string(),
  targetLanguage: z.string(),
  sourceText: z.string(),
  translatedText: z.string(),
  sourceHash: z.string(),
  provider: z.string(),
  model: z.string().nullable(),
  tokensUsed: z.number().nullable(),
  cost: z.number().nullable(),
  createdAt: z.date(),
});

export const insertApiUsageSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  apiKey: z.string().optional(),
  endpoint: z.string(),
  method: z.string(),
  statusCode: z.number(),
  responseTime: z.number().optional(),
  tokensUsed: z.number().optional(),
  cost: z.number().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  createdAt: z.date().optional(),
});

export const selectApiUsageSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().nullable(),
  apiKey: z.string().nullable(),
  endpoint: z.string(),
  method: z.string(),
  statusCode: z.number(),
  responseTime: z.number().nullable(),
  tokensUsed: z.number().nullable(),
  cost: z.number().nullable(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  createdAt: z.date(),
});

export const insertRateLimitSchema = z.object({
  id: z.string().uuid().optional(),
  identifier: z.string(),
  endpoint: z.string(),
  requests: z.number().default(0),
  windowStart: z.date(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const selectRateLimitSchema = z.object({
  id: z.string().uuid(),
  identifier: z.string(),
  endpoint: z.string(),
  requests: z.number(),
  windowStart: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// API request/response schemas
export const translateRequestSchema = z.object({
  text: z.string().min(1).max(10000),
  sourceLanguage: z.string().optional(),
  targetLanguage: z.string().min(1),
  apiKey: z.string().min(1),
});

export const translateResponseSchema = z.object({
  success: z.boolean(),
  translatedText: z.string().optional(),
  sourceLanguage: z.string().optional(),
  targetLanguage: z.string(),
  provider: z.string(),
  model: z.string().optional(),
  tokensUsed: z.number().optional(),
  cost: z.number().optional(),
  cached: z.boolean().default(false),
  error: z.string().optional(),
});

export type TranslateRequest = z.infer<typeof translateRequestSchema>;
export type TranslateResponse = z.infer<typeof translateResponseSchema>;
export type User = z.infer<typeof selectUserSchema>;
export type TranslationCache = z.infer<typeof selectTranslationCacheSchema>;
export type ApiUsage = z.infer<typeof selectApiUsageSchema>;
export type RateLimit = z.infer<typeof selectRateLimitSchema>;
