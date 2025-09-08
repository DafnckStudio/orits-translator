#!/usr/bin/env node

/**
 * Script de vérification de la protection contre la traduction automatique
 * Usage: node scripts/check-translation-protection.js [directory]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const TARGET_DIR = process.argv[2] || './src';
const EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js'];
const EXCLUDE_DIRS = ['node_modules', '.next', '.git', 'dist', 'build'];

// Patterns à vérifier
const PATTERNS = {
  // Patterns d'éléments qui DOIVENT être protégés
  userData: {
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    phone: /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g,
    ssn: /\b\d{3}-?\d{2}-?\d{4}\b/g,
    creditCard: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
  },
  
  // Patterns d'éléments techniques qui DOIVENT être protégés
  technical: {
    apiKey: /sk-[a-zA-Z0-9]{20,}/g,
    token: /[a-zA-Z0-9]{32,}/g,
    uuid: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
    hash: /[a-f0-9]{32,}/gi,
  },
  
  // Patterns d'éléments qui NE DOIVENT PAS être protégés (traduisibles)
  translatable: {
    labels: /<label[^>]*>([^<]+)<\/label>/gi,
    buttons: /<button[^>]*>([^<]+)<\/button>/gi,
    headings: /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi,
  }
};

// Classes et attributs de protection
const PROTECTION_ATTRIBUTES = [
  'translate="no"',
  'translate="false"',
  'class="notranslate"',
  'class="translate-protected"',
  'class="user-data-protected"',
  'class="code-protected"',
  'class="brand-protected"',
  'class="never-translate"',
  'class="form-no-translate"',
  'class="action-no-translate"',
  'class="nav-no-translate"',
  'class="meta-no-translate"',
];

// Composants de protection
const PROTECTION_COMPONENTS = [
  'UserDataGuard',
  'BrandGuard',
  'CodeGuard',
  'TranslationGuard',
];

// Couleurs pour la console
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

// Statistiques
let stats = {
  filesScanned: 0,
  issuesFound: 0,
  protectedElements: 0,
  unprotectedElements: 0,
  recommendations: 0,
};

// Fonction pour scanner un fichier
function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const issues = [];
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      
      // Vérifier les données utilisateur non protégées
      Object.entries(PATTERNS.userData).forEach(([type, pattern]) => {
        const matches = line.match(pattern);
        if (matches) {
          matches.forEach(match => {
            if (!isProtected(line, match)) {
              issues.push({
                type: 'unprotected-user-data',
                severity: 'high',
                line: lineNumber,
                content: line.trim(),
                match: match,
                dataType: type,
                suggestion: `Protéger les données ${type} avec UserDataGuard ou translate="no"`
              });
            }
          });
        }
      });
      
      // Vérifier les éléments techniques non protégés
      Object.entries(PATTERNS.technical).forEach(([type, pattern]) => {
        const matches = line.match(pattern);
        if (matches) {
          matches.forEach(match => {
            if (!isProtected(line, match)) {
              issues.push({
                type: 'unprotected-technical',
                severity: 'medium',
                line: lineNumber,
                content: line.trim(),
                match: match,
                dataType: type,
                suggestion: `Protéger les données techniques ${type} avec CodeGuard ou translate="no"`
              });
            }
          });
        }
      });
      
      // Vérifier les éléments traduisibles mal protégés
      Object.entries(PATTERNS.translatable).forEach(([type, pattern]) => {
        const matches = line.match(pattern);
        if (matches) {
          matches.forEach(match => {
            if (isProtected(line, match)) {
              issues.push({
                type: 'over-protected-translatable',
                severity: 'low',
                line: lineNumber,
                content: line.trim(),
                match: match,
                dataType: type,
                suggestion: `Les éléments ${type} ne devraient pas être protégés contre la traduction`
              });
            }
          });
        }
      });
      
      // Vérifier les champs de formulaire non protégés
      if (line.includes('<input') || line.includes('<textarea') || line.includes('<select')) {
        if (!isProtected(line)) {
          issues.push({
            type: 'unprotected-form-field',
            severity: 'high',
            line: lineNumber,
            content: line.trim(),
            match: 'form field',
            dataType: 'form',
            suggestion: 'Ajouter translate="no" aux champs de formulaire'
          });
        }
      }
      
      // Vérifier les boutons non protégés
      if (line.includes('<button')) {
        if (!isProtected(line)) {
          issues.push({
            type: 'unprotected-button',
            severity: 'medium',
            line: lineNumber,
            content: line.trim(),
            match: 'button',
            dataType: 'button',
            suggestion: 'Ajouter translate="no" aux boutons d\'action'
          });
        }
      }
    });
    
    return issues;
  } catch (error) {
    console.error(`${colors.red}Erreur lors de la lecture du fichier ${filePath}: ${error.message}${colors.reset}`);
    return [];
  }
}

// Fonction pour vérifier si un élément est protégé
function isProtected(line, match = null) {
  const lowerLine = line.toLowerCase();
  
  // Vérifier les attributs de protection
  for (const attr of PROTECTION_ATTRIBUTES) {
    if (lowerLine.includes(attr.toLowerCase())) {
      return true;
    }
  }
  
  // Vérifier les attributs translate="no" dans les composants
  if (lowerLine.includes('translate="no"') || lowerLine.includes("translate='no'")) {
    return true;
  }
  
  // Vérifier les composants de protection
  for (const component of PROTECTION_COMPONENTS) {
    if (line.includes(component)) {
      return true;
    }
  }
  
  // Vérifier les classes CSS de protection
  const protectionClasses = [
    'notranslate',
    'translate-protected',
    'user-data-protected',
    'code-protected',
    'brand-protected',
    'never-translate',
    'form-no-translate',
    'action-no-translate',
    'nav-no-translate',
    'meta-no-translate',
  ];
  
  for (const className of protectionClasses) {
    if (lowerLine.includes(`class="${className}"`) || lowerLine.includes(`className="${className}"`)) {
      return true;
    }
  }
  
  // Vérifier les composants UI protégés (Input, Button, etc.)
  if (lowerLine.includes('<input') && lowerLine.includes('form-no-translate')) {
    return true;
  }
  
  if (lowerLine.includes('<button') && lowerLine.includes('action-no-translate')) {
    return true;
  }
  
  if (lowerLine.includes('<textarea') && lowerLine.includes('form-no-translate')) {
    return true;
  }
  
  if (lowerLine.includes('<select') && lowerLine.includes('form-no-translate')) {
    return true;
  }
  
  return false;
}

// Fonction pour scanner un répertoire
function scanDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(item)) {
        scanDirectory(fullPath);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(item);
      if (EXTENSIONS.includes(ext)) {
        stats.filesScanned++;
        const issues = scanFile(fullPath);
        
        if (issues.length > 0) {
          console.log(`\n${colors.yellow}📁 ${fullPath}${colors.reset}`);
          issues.forEach(issue => {
            const severityColor = issue.severity === 'high' ? colors.red : 
                                 issue.severity === 'medium' ? colors.yellow : colors.blue;
            
            console.log(`${severityColor}  ⚠️  Ligne ${issue.line}: ${issue.type}${colors.reset}`);
            console.log(`     ${colors.cyan}${issue.content}${colors.reset}`);
            console.log(`     ${colors.blue}💡 ${issue.suggestion}${colors.reset}`);
            
            if (issue.severity === 'high') {
              stats.unprotectedElements++;
            } else if (issue.severity === 'medium') {
              stats.unprotectedElements++;
            } else {
              stats.overProtectedElements = (stats.overProtectedElements || 0) + 1;
            }
            
            stats.issuesFound++;
          });
        }
      }
    }
  });
}

// Fonction pour générer un rapport
function generateReport() {
  console.log(`\n${colors.bold}${colors.blue}📊 RAPPORT DE VÉRIFICATION${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}`);
  
  console.log(`\n${colors.green}📁 Fichiers scannés: ${stats.filesScanned}${colors.reset}`);
  console.log(`${colors.red}⚠️  Problèmes trouvés: ${stats.issuesFound}${colors.reset}`);
  console.log(`${colors.yellow}🔒 Éléments non protégés: ${stats.unprotectedElements}${colors.reset}`);
  
  if (stats.overProtectedElements) {
    console.log(`${colors.blue}🔓 Éléments sur-protégés: ${stats.overProtectedElements}${colors.reset}`);
  }
  
  // Score de protection
  const protectionScore = stats.filesScanned > 0 ? 
    Math.round((1 - stats.unprotectedElements / Math.max(stats.filesScanned, 1)) * 100) : 100;
  
  const scoreColor = protectionScore >= 90 ? colors.green : 
                    protectionScore >= 70 ? colors.yellow : colors.red;
  
  console.log(`\n${scoreColor}🛡️  Score de protection: ${protectionScore}%${colors.reset}`);
  
  // Recommandations
  if (stats.unprotectedElements > 0) {
    console.log(`\n${colors.yellow}💡 RECOMMANDATIONS:${colors.reset}`);
    console.log(`${colors.yellow}1. Utilisez les composants UserDataGuard, CodeGuard, BrandGuard${colors.reset}`);
    console.log(`${colors.yellow}2. Ajoutez translate="no" aux champs de formulaire${colors.reset}`);
    console.log(`${colors.yellow}3. Protégez les boutons d'action avec action-no-translate${colors.reset}`);
    console.log(`${colors.yellow}4. Consultez TRANSLATION_PROTECTION_GUIDE.md pour plus de détails${colors.reset}`);
  }
  
  if (protectionScore >= 90) {
    console.log(`\n${colors.green}🎉 Excellent ! Votre application est bien protégée contre la traduction automatique.${colors.reset}`);
  } else if (protectionScore >= 70) {
    console.log(`\n${colors.yellow}⚠️  Bon travail, mais il reste quelques améliorations à apporter.${colors.reset}`);
  } else {
    console.log(`\n${colors.red}🚨 Attention ! Votre application nécessite une protection urgente contre la traduction automatique.${colors.reset}`);
  }
}

// Fonction principale
function main() {
  console.log(`${colors.bold}${colors.blue}🛡️  Vérification de la Protection contre la Traduction Automatique${colors.reset}`);
  console.log(`${colors.blue}════════════════════════════════════════════════════════════════════════════════${colors.reset}`);
  
  if (!fs.existsSync(TARGET_DIR)) {
    console.error(`${colors.red}❌ Le répertoire ${TARGET_DIR} n'existe pas.${colors.reset}`);
    process.exit(1);
  }
  
  console.log(`${colors.cyan}🔍 Scan du répertoire: ${TARGET_DIR}${colors.reset}`);
  console.log(`${colors.cyan}📋 Extensions supportées: ${EXTENSIONS.join(', ')}${colors.reset}`);
  
  scanDirectory(TARGET_DIR);
  generateReport();
  
  // Code de sortie basé sur le score
  const protectionScore = stats.filesScanned > 0 ? 
    Math.round((1 - stats.unprotectedElements / Math.max(stats.filesScanned, 1)) * 100) : 100;
  
  process.exit(protectionScore >= 70 ? 0 : 1);
}

// Gestion des erreurs
process.on('unhandledRejection', (error) => {
  console.error(`${colors.red}❌ Erreur non gérée: ${error.message}${colors.reset}`);
  process.exit(1);
});

// Exécution
if (require.main === module) {
  main();
}

module.exports = { scanFile, scanDirectory, generateReport };
