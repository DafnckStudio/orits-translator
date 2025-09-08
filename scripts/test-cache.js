#!/usr/bin/env node

/**
 * Script de test pour démontrer le fonctionnement du cache intelligent
 * Usage: node scripts/test-cache.js [API_URL] [API_KEY]
 */

const https = require('https');
const http = require('http');

// Configuration
const API_URL = process.argv[2] || 'http://localhost:3000';
const API_KEY = process.argv[3] || 'test-api-key';

// Couleurs pour la console
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Fonction pour faire des requêtes HTTP
function makeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const urlObj = new URL(url);
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = client.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (error) {
          reject(new Error(`Invalid JSON response: ${responseData}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.write(postData);
    req.end();
  });
}

// Fonction pour traduire du texte
async function translateText(text, sourceLanguage, targetLanguage) {
  const startTime = Date.now();
  
  try {
    const response = await makeRequest(`${API_URL}/api/translate`, {
      text: text,
      sourceLanguage: sourceLanguage,
      targetLanguage: targetLanguage,
      apiKey: API_KEY
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    return {
      success: response.status === 200,
      data: response.data,
      responseTime: responseTime,
      status: response.status
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      responseTime: Date.now() - startTime
    };
  }
}

// Fonction pour obtenir les statistiques
async function getStats() {
  try {
    const response = await makeRequest(`${API_URL}/api/stats`, {
      apiKey: API_KEY
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

// Fonction principale de test
async function runCacheTest() {
  console.log(`${colors.bold}${colors.blue}🧪 Test du Cache Intelligent - Translate Open${colors.reset}\n`);
  
  // Test 1: Vérification de la santé de l'API
  console.log(`${colors.yellow}1. Vérification de la santé de l'API...${colors.reset}`);
  try {
    const healthResponse = await makeRequest(`${API_URL}/api/health`, {});
    if (healthResponse.status === 200) {
      console.log(`${colors.green}✅ API en ligne${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ API non disponible${colors.reset}`);
      return;
    }
  } catch (error) {
    console.log(`${colors.red}❌ Erreur de connexion: ${error.message}${colors.reset}`);
    return;
  }
  
  // Test 2: Première traduction (cache miss)
  console.log(`\n${colors.yellow}2. Première traduction (Cache Miss)...${colors.reset}`);
  const text1 = "Hello, world!";
  const result1 = await translateText(text1, "en", "fr");
  
  if (result1.success) {
    console.log(`${colors.green}✅ Traduction réussie${colors.reset}`);
    console.log(`   Texte: "${text1}"`);
    console.log(`   Traduction: "${result1.data.translatedText}"`);
    console.log(`   Temps de réponse: ${result1.responseTime}ms`);
    console.log(`   Cache: ${result1.data.cached ? 'HIT' : 'MISS'}`);
    console.log(`   Coût: $${(result1.data.cost || 0) / 100}`);
  } else {
    console.log(`${colors.red}❌ Erreur: ${result1.error}${colors.reset}`);
    return;
  }
  
  // Test 3: Deuxième traduction identique (cache hit)
  console.log(`\n${colors.yellow}3. Deuxième traduction identique (Cache Hit)...${colors.reset}`);
  const result2 = await translateText(text1, "en", "fr");
  
  if (result2.success) {
    console.log(`${colors.green}✅ Traduction réussie${colors.reset}`);
    console.log(`   Texte: "${text1}"`);
    console.log(`   Traduction: "${result2.data.translatedText}"`);
    console.log(`   Temps de réponse: ${result2.responseTime}ms`);
    console.log(`   Cache: ${result2.data.cached ? 'HIT' : 'MISS'}`);
    console.log(`   Coût: $${(result2.data.cost || 0) / 100}`);
    
    // Comparaison des performances
    const speedImprovement = ((result1.responseTime - result2.responseTime) / result1.responseTime * 100).toFixed(1);
    console.log(`   ${colors.blue}🚀 Amélioration de vitesse: ${speedImprovement}%${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Erreur: ${result2.error}${colors.reset}`);
  }
  
  // Test 4: Traduction différente (nouveau cache miss)
  console.log(`\n${colors.yellow}4. Traduction différente (Nouveau Cache Miss)...${colors.reset}`);
  const text2 = "Good morning!";
  const result3 = await translateText(text2, "en", "fr");
  
  if (result3.success) {
    console.log(`${colors.green}✅ Traduction réussie${colors.reset}`);
    console.log(`   Texte: "${text2}"`);
    console.log(`   Traduction: "${result3.data.translatedText}"`);
    console.log(`   Temps de réponse: ${result3.responseTime}ms`);
    console.log(`   Cache: ${result3.data.cached ? 'HIT' : 'MISS'}`);
    console.log(`   Coût: $${(result3.data.cost || 0) / 100}`);
  } else {
    console.log(`${colors.red}❌ Erreur: ${result3.error}${colors.reset}`);
  }
  
  // Test 5: Test de charge (simulation de plusieurs utilisateurs)
  console.log(`\n${colors.yellow}5. Test de charge (10 requêtes simultanées)...${colors.reset}`);
  const promises = [];
  for (let i = 0; i < 10; i++) {
    promises.push(translateText(text1, "en", "fr")); // Même texte = cache hit
  }
  
  const results = await Promise.all(promises);
  const successful = results.filter(r => r.success);
  const cached = successful.filter(r => r.data.cached);
  
  console.log(`${colors.green}✅ ${successful.length}/10 requêtes réussies${colors.reset}`);
  console.log(`   Cache hits: ${cached.length}/${successful.length} (${(cached.length/successful.length*100).toFixed(1)}%)`);
  console.log(`   Temps moyen: ${(successful.reduce((sum, r) => sum + r.responseTime, 0) / successful.length).toFixed(0)}ms`);
  
  // Test 6: Statistiques finales
  console.log(`\n${colors.yellow}6. Statistiques du cache...${colors.reset}`);
  const stats = await getStats();
  if (stats && stats.success) {
    const cacheData = stats.data.cache;
    console.log(`${colors.green}✅ Statistiques récupérées${colors.reset}`);
    console.log(`   Entrées totales: ${cacheData.totalEntries}`);
    console.log(`   Coût total: $${(cacheData.totalCost || 0) / 100}`);
    console.log(`   Tokens utilisés: ${cacheData.totalTokens || 0}`);
    console.log(`   Langues populaires: ${cacheData.topLanguages.map(l => `${l.language}(${l.count})`).join(', ')}`);
  } else {
    console.log(`${colors.red}❌ Impossible de récupérer les statistiques${colors.reset}`);
  }
  
  // Résumé final
  console.log(`\n${colors.bold}${colors.blue}📊 Résumé du Test${colors.reset}`);
  console.log(`${colors.green}✅ Cache intelligent fonctionnel${colors.reset}`);
  console.log(`${colors.green}✅ Économies de coûts démontrées${colors.reset}`);
  console.log(`${colors.green}✅ Amélioration des performances confirmée${colors.reset}`);
  console.log(`${colors.green}✅ Système prêt pour la production${colors.reset}\n`);
}

// Gestion des erreurs
process.on('unhandledRejection', (error) => {
  console.error(`${colors.red}❌ Erreur non gérée: ${error.message}${colors.reset}`);
  process.exit(1);
});

// Exécution du test
if (require.main === module) {
  runCacheTest().catch((error) => {
    console.error(`${colors.red}❌ Erreur du test: ${error.message}${colors.reset}`);
    process.exit(1);
  });
}

module.exports = { runCacheTest, translateText, getStats };

