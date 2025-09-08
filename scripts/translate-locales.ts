#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { translateText } from '../src/lib/openai';
import { locales, type Locale } from '../src/i18n/config';

interface TranslationConfig {
  sourceLocale: Locale;
  targetLocales: Locale[];
  sourceFile: string;
  targetDir: string;
  provider: 'openai';
  model: string;
  dryRun: boolean;
}

// Deep merge function to merge nested objects
function deepMerge(target: any, source: any): any {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
}

// Get all nested keys from an object
function getAllKeys(obj: any, prefix = ''): string[] {
  const keys: string[] = [];
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      keys.push(...getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

// Get value from nested object using dot notation
function getNestedValue(obj: any, key: string): any {
  return key.split('.').reduce((current, k) => current?.[k], obj);
}

// Set value in nested object using dot notation
function setNestedValue(obj: any, key: string, value: any): void {
  const keys = key.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((current, k) => {
    if (!current[k]) current[k] = {};
    return current[k];
  }, obj);
  target[lastKey] = value;
}

// Check if a key needs translation (empty or missing)
function needsTranslation(sourceValue: any, targetValue: any): boolean {
  if (targetValue === undefined || targetValue === null) return true;
  if (typeof targetValue === 'string' && targetValue.trim() === '') return true;
  if (typeof sourceValue === 'string' && typeof targetValue === 'string') {
    return sourceValue.trim() !== targetValue.trim();
  }
  return false;
}

async function translateKey(
  key: string,
  sourceText: string,
  sourceLocale: Locale,
  targetLocale: Locale,
  config: TranslationConfig
): Promise<string> {
  try {
    console.log(`  Translating: ${key} (${sourceLocale} → ${targetLocale})`);
    
    if (config.dryRun) {
      console.log(`    [DRY RUN] Would translate: "${sourceText}"`);
      return `[TRANSLATED] ${sourceText}`;
    }

    const result = await translateText({
      text: sourceText,
      sourceLanguage: sourceLocale,
      targetLanguage: targetLocale,
      model: config.model,
    });

    console.log(`    ✓ Translated: "${result.translatedText}"`);
    return result.translatedText;
  } catch (error) {
    console.error(`    ✗ Failed to translate ${key}:`, error);
    return sourceText; // Fallback to source text
  }
}

async function translateLocaleFile(
  sourceData: any,
  targetData: any,
  sourceLocale: Locale,
  targetLocale: Locale,
  config: TranslationConfig
): Promise<any> {
  const result = { ...targetData };
  const sourceKeys = getAllKeys(sourceData);
  let translatedCount = 0;
  let skippedCount = 0;

  console.log(`\n📝 Processing ${targetLocale}.json...`);

  for (const key of sourceKeys) {
    const sourceValue = getNestedValue(sourceData, key);
    const targetValue = getNestedValue(targetData, key);

    if (typeof sourceValue !== 'string') {
      skippedCount++;
      continue;
    }

    if (needsTranslation(sourceValue, targetValue)) {
      const translatedValue = await translateKey(
        key,
        sourceValue,
        sourceLocale,
        targetLocale,
        config
      );
      setNestedValue(result, key, translatedValue);
      translatedCount++;
    } else {
      skippedCount++;
    }
  }

  console.log(`  ✓ Translated: ${translatedCount} keys`);
  console.log(`  ⏭️  Skipped: ${skippedCount} keys`);

  return result;
}

async function main() {
  const args = process.argv.slice(2);
  
  // Parse command line arguments
  const config: TranslationConfig = {
    sourceLocale: 'en',
    targetLocales: locales.filter(l => l !== 'en'),
    sourceFile: path.join(__dirname, '../src/locales/en.json'),
    targetDir: path.join(__dirname, '../src/locales'),
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    dryRun: false,
  };

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--source':
        config.sourceLocale = args[++i] as Locale;
        break;
      case '--target':
        config.targetLocales = args[++i].split(',') as Locale[];
        break;
      case '--model':
        config.model = args[++i];
        break;
      case '--dry-run':
        config.dryRun = true;
        break;
      case '--help':
        console.log(`
Usage: tsx scripts/translate-locales.ts [options]

Options:
  --source <locale>     Source locale (default: en)
  --target <locales>    Target locales, comma-separated (default: all except en)
  --model <model>       OpenAI model to use (default: gpt-3.5-turbo)
  --dry-run            Show what would be translated without making changes
  --help               Show this help message

Examples:
  tsx scripts/translate-locales.ts
  tsx scripts/translate-locales.ts --target fr,es,de
  tsx scripts/translate-locales.ts --model gpt-4 --dry-run
        `);
        process.exit(0);
    }
  }

  console.log('🌍 Translation Script Starting...');
  console.log(`📖 Source: ${config.sourceLocale}`);
  console.log(`🎯 Targets: ${config.targetLocales.join(', ')}`);
  console.log(`🤖 Model: ${config.model}`);
  console.log(`🔍 Dry Run: ${config.dryRun}`);

  // Check if source file exists
  if (!fs.existsSync(config.sourceFile)) {
    console.error(`❌ Source file not found: ${config.sourceFile}`);
    process.exit(1);
  }

  // Load source data
  const sourceData = JSON.parse(fs.readFileSync(config.sourceFile, 'utf8'));
  console.log(`📄 Loaded source file with ${getAllKeys(sourceData).length} keys`);

  // Process each target locale
  for (const targetLocale of config.targetLocales) {
    const targetFile = path.join(config.targetDir, `${targetLocale}.json`);
    
    // Load existing target data or create empty object
    let targetData = {};
    if (fs.existsSync(targetFile)) {
      targetData = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
    }

    // Translate the file
    const translatedData = await translateLocaleFile(
      sourceData,
      targetData,
      config.sourceLocale,
      targetLocale,
      config
    );

    // Write the result
    if (!config.dryRun) {
      fs.writeFileSync(
        targetFile,
        JSON.stringify(translatedData, null, 2) + '\n',
        'utf8'
      );
      console.log(`💾 Saved: ${targetFile}`);
    } else {
      console.log(`🔍 [DRY RUN] Would save: ${targetFile}`);
    }
  }

  console.log('\n✅ Translation completed!');
}

// Run the script
main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});

