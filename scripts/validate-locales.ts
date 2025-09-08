#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { locales } from '../src/i18n/config';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalKeys: number;
    missingKeys: Record<string, string[]>;
    extraKeys: Record<string, string[]>;
    emptyValues: Record<string, string[]>;
  };
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

function validateLocaleFile(filePath: string, referenceKeys: string[]): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    stats: {
      totalKeys: 0,
      missingKeys: {},
      extraKeys: {},
      emptyValues: {},
    },
  };

  if (!fs.existsSync(filePath)) {
    result.isValid = false;
    result.errors.push(`File does not exist: ${filePath}`);
    return result;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    const fileKeys = getAllKeys(data);
    const locale = path.basename(filePath, '.json');

    result.stats.totalKeys = fileKeys.length;

    // Check for missing keys
    const missingKeys = referenceKeys.filter(key => !fileKeys.includes(key));
    if (missingKeys.length > 0) {
      result.stats.missingKeys[locale] = missingKeys;
      result.errors.push(`${locale}: Missing ${missingKeys.length} keys: ${missingKeys.slice(0, 5).join(', ')}${missingKeys.length > 5 ? '...' : ''}`);
    }

    // Check for extra keys
    const extraKeys = fileKeys.filter(key => !referenceKeys.includes(key));
    if (extraKeys.length > 0) {
      result.stats.extraKeys[locale] = extraKeys;
      result.warnings.push(`${locale}: Extra ${extraKeys.length} keys: ${extraKeys.slice(0, 5).join(', ')}${extraKeys.length > 5 ? '...' : ''}`);
    }

    // Check for empty values
    const emptyValues = fileKeys.filter(key => {
      const value = getNestedValue(data, key);
      return value === '' || value === null || value === undefined;
    });
    if (emptyValues.length > 0) {
      result.stats.emptyValues[locale] = emptyValues;
      result.warnings.push(`${locale}: ${emptyValues.length} empty values: ${emptyValues.slice(0, 5).join(', ')}${emptyValues.length > 5 ? '...' : ''}`);
    }

    if (result.errors.length > 0) {
      result.isValid = false;
    }

  } catch (error) {
    result.isValid = false;
    result.errors.push(`Failed to parse ${filePath}: ${error}`);
  }

  return result;
}

function validateAllLocales(): ValidationResult {
  const localesDir = path.join(__dirname, '../src/locales');
  const referenceFile = path.join(localesDir, 'en.json');
  
  const overallResult: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    stats: {
      totalKeys: 0,
      missingKeys: {},
      extraKeys: {},
      emptyValues: {},
    },
  };

  // Load reference file (English)
  if (!fs.existsSync(referenceFile)) {
    overallResult.isValid = false;
    overallResult.errors.push('Reference file (en.json) not found');
    return overallResult;
  }

  const referenceData = JSON.parse(fs.readFileSync(referenceFile, 'utf8'));
  const referenceKeys = getAllKeys(referenceData);
  overallResult.stats.totalKeys = referenceKeys.length;

  console.log(`📖 Reference file: en.json (${referenceKeys.length} keys)`);

  // Validate each locale
  for (const locale of locales) {
    const filePath = path.join(localesDir, `${locale}.json`);
    const result = validateLocaleFile(filePath, referenceKeys);

    // Merge results
    overallResult.errors.push(...result.errors);
    overallResult.warnings.push(...result.warnings);
    Object.assign(overallResult.stats.missingKeys, result.stats.missingKeys);
    Object.assign(overallResult.stats.extraKeys, result.stats.extraKeys);
    Object.assign(overallResult.stats.emptyValues, result.stats.emptyValues);

    if (!result.isValid) {
      overallResult.isValid = false;
    }
  }

  return overallResult;
}

function printResults(result: ValidationResult) {
  console.log('\n📊 Validation Results:');
  console.log('='.repeat(50));

  if (result.isValid) {
    console.log('✅ All locale files are valid!');
  } else {
    console.log('❌ Validation failed!');
  }

  if (result.errors.length > 0) {
    console.log('\n🚨 Errors:');
    result.errors.forEach(error => console.log(`  • ${error}`));
  }

  if (result.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    result.warnings.forEach(warning => console.log(`  • ${warning}`));
  }

  console.log('\n📈 Statistics:');
  console.log(`  • Total keys in reference: ${result.stats.totalKeys}`);
  console.log(`  • Locales with missing keys: ${Object.keys(result.stats.missingKeys).length}`);
  console.log(`  • Locales with extra keys: ${Object.keys(result.stats.extraKeys).length}`);
  console.log(`  • Locales with empty values: ${Object.keys(result.stats.emptyValues).length}`);

  // Detailed breakdown
  if (Object.keys(result.stats.missingKeys).length > 0) {
    console.log('\n🔍 Missing Keys Details:');
    for (const [locale, keys] of Object.entries(result.stats.missingKeys)) {
      console.log(`  ${locale}: ${keys.length} missing`);
      if (keys.length <= 10) {
        keys.forEach(key => console.log(`    - ${key}`));
      } else {
        keys.slice(0, 5).forEach(key => console.log(`    - ${key}`));
        console.log(`    ... and ${keys.length - 5} more`);
      }
    }
  }
}

async function main() {
  console.log('🔍 Validating locale files...');
  
  const result = validateAllLocales();
  printResults(result);

  // Exit with appropriate code
  process.exit(result.isValid ? 0 : 1);
}

// Run the script
main().catch((error) => {
  console.error('❌ Validation script failed:', error);
  process.exit(1);
});

