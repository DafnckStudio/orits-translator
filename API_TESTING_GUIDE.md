# 🧪 Guide de Test de l'API Translate Open

## 🚀 **URL de l'API**
```
https://respectful-wonder-production.up.railway.app
```

## 🔍 **Tests de Base**

### **1. Test de Santé (Health Check)**

```bash
curl -X GET https://respectful-wonder-production.up.railway.app/api/health
```

**Réponse attendue :**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "database": "connected",
  "service": "translate-open",
  "version": "1.0.0"
}
```

### **2. Test de Traduction Simple**

```bash
curl -X POST https://respectful-wonder-production.up.railway.app/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, world!",
    "sourceLanguage": "en",
    "targetLanguage": "fr",
    "apiKey": "test-key"
  }'
```

**Réponse attendue :**
```json
{
  "success": true,
  "translatedText": "Bonjour le monde !",
  "sourceLanguage": "en",
  "targetLanguage": "fr",
  "cached": false,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### **3. Test de Statistiques**

```bash
curl -X GET https://respectful-wonder-production.up.railway.app/api/stats \
  -H "x-api-key: test-key"
```

**Réponse attendue :**
```json
{
  "success": true,
  "stats": {
    "totalTranslations": 0,
    "totalRequests": 0,
    "cacheHitRate": 0,
    "languages": []
  }
}
```

## 🧪 **Tests Avancés**

### **Test 1: Détection Automatique de Langue**

```bash
curl -X POST https://respectful-wonder-production.up.railway.app/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Bonjour, comment allez-vous ?",
    "sourceLanguage": "auto",
    "targetLanguage": "en",
    "apiKey": "test-key"
  }'
```

### **Test 2: Traduction Longue**

```bash
curl -X POST https://respectful-wonder-production.up.railway.app/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Ceci est un texte plus long pour tester la capacité de l'\''API à gérer des contenus volumineux. L'\''API devrait pouvoir traduire des paragraphes entiers sans problème.",
    "sourceLanguage": "fr",
    "targetLanguage": "en",
    "apiKey": "test-key"
  }'
```

### **Test 3: Langues Supportées**

```bash
# Test avec différentes langues
for lang in fr es de it pt ja ko zh ar; do
  echo "Testing $lang..."
  curl -X POST https://respectful-wonder-production.up.railway.app/api/translate \
    -H "Content-Type: application/json" \
    -d "{
      \"text\": \"Hello, world!\",
      \"sourceLanguage\": \"en\",
      \"targetLanguage\": \"$lang\",
      \"apiKey\": \"test-key\"
    }"
  echo ""
done
```

## 🛡️ **Tests de Protection des Données**

### **Test 1: Données Personnelles**

```bash
curl -X POST https://respectful-wonder-production.up.railway.app/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Mon email est john.doe@example.com et mon téléphone est +1234567890",
    "sourceLanguage": "fr",
    "targetLanguage": "en",
    "apiKey": "test-key"
  }'
```

**Vérification :** Les données personnelles ne doivent PAS être traduites.

### **Test 2: Codes Techniques**

```bash
curl -X POST https://respectful-wonder-production.up.railway.app/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "L'\''ID utilisateur est user_1234567890abcdef et le token est sk-proj-1234567890abcdef",
    "sourceLanguage": "fr",
    "targetLanguage": "en",
    "apiKey": "test-key"
  }'
```

**Vérification :** Les codes techniques ne doivent PAS être traduits.

## ⚡ **Tests de Performance**

### **Test 1: Cache**

```bash
# Premier appel (pas de cache)
curl -X POST https://respectful-wonder-production.up.railway.app/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Test de cache",
    "sourceLanguage": "en",
    "targetLanguage": "fr",
    "apiKey": "test-key"
  }'

# Deuxième appel (avec cache)
curl -X POST https://respectful-wonder-production.up.railway.app/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Test de cache",
    "sourceLanguage": "en",
    "targetLanguage": "fr",
    "apiKey": "test-key"
  }'
```

**Vérification :** Le deuxième appel doit être plus rapide et indiquer `"cached": true`.

### **Test 2: Rate Limiting**

```bash
# Test de rate limiting (60 requêtes/minute)
for i in {1..65}; do
  curl -X POST https://respectful-wonder-production.up.railway.app/api/translate \
    -H "Content-Type: application/json" \
    -d "{
      \"text\": \"Test $i\",
      \"sourceLanguage\": \"en\",
      \"targetLanguage\": \"fr\",
      \"apiKey\": \"test-key\"
    }"
  echo "Request $i completed"
done
```

**Vérification :** Les requêtes 61-65 doivent retourner une erreur de rate limiting.

## 🚨 **Tests d'Erreur**

### **Test 1: Clé API Invalide**

```bash
curl -X POST https://respectful-wonder-production.up.railway.app/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, world!",
    "sourceLanguage": "en",
    "targetLanguage": "fr",
    "apiKey": "invalid-key"
  }'
```

**Réponse attendue :**
```json
{
  "success": false,
  "error": "Invalid API key",
  "code": 401
}
```

### **Test 2: Langue Non Supportée**

```bash
curl -X POST https://respectful-wonder-production.up.railway.app/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, world!",
    "sourceLanguage": "en",
    "targetLanguage": "xx",
    "apiKey": "test-key"
  }'
```

**Réponse attendue :**
```json
{
  "success": false,
  "error": "Unsupported target language: xx",
  "code": 400
}
```

### **Test 3: Texte Vide**

```bash
curl -X POST https://respectful-wonder-production.up.railway.app/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "",
    "sourceLanguage": "en",
    "targetLanguage": "fr",
    "apiKey": "test-key"
  }'
```

**Réponse attendue :**
```json
{
  "success": false,
  "error": "Text is required",
  "code": 400
}
```

## 📊 **Script de Test Complet**

```bash
#!/bin/bash

API_URL="https://respectful-wonder-production.up.railway.app"
API_KEY="test-key"

echo "🧪 Test de l'API Translate Open"
echo "================================"

# Test 1: Health Check
echo "1. Test de santé..."
curl -s -X GET "$API_URL/api/health" | jq '.'

# Test 2: Traduction simple
echo -e "\n2. Test de traduction simple..."
curl -s -X POST "$API_URL/api/translate" \
  -H "Content-Type: application/json" \
  -d "{
    \"text\": \"Hello, world!\",
    \"sourceLanguage\": \"en\",
    \"targetLanguage\": \"fr\",
    \"apiKey\": \"$API_KEY\"
  }" | jq '.'

# Test 3: Détection automatique
echo -e "\n3. Test de détection automatique..."
curl -s -X POST "$API_URL/api/translate" \
  -H "Content-Type: application/json" \
  -d "{
    \"text\": \"Bonjour, comment allez-vous ?\",
    \"sourceLanguage\": \"auto\",
    \"targetLanguage\": \"en\",
    \"apiKey\": \"$API_KEY\"
  }" | jq '.'

# Test 4: Statistiques
echo -e "\n4. Test de statistiques..."
curl -s -X GET "$API_URL/api/stats" \
  -H "x-api-key: $API_KEY" | jq '.'

echo -e "\n✅ Tests terminés !"
```

## 🔧 **Outils de Test Recommandés**

### **1. Postman**
- Collection disponible dans `/docs/postman/`
- Tests automatisés inclus
- Variables d'environnement configurées

### **2. Insomnia**
- Workspace disponible dans `/docs/insomnia/`
- Tests de performance intégrés
- Documentation interactive

### **3. curl**
- Scripts de test dans `/scripts/test-api.sh`
- Tests de charge et de performance
- Intégration CI/CD

## 📈 **Métriques de Performance**

### **Temps de Réponse Attendus**
- **Health Check** : < 100ms
- **Traduction (cache)** : < 200ms
- **Traduction (nouvelle)** : < 2s
- **Statistiques** : < 500ms

### **Taux de Réussite**
- **Disponibilité** : > 99.9%
- **Succès des traductions** : > 99.5%
- **Cache hit rate** : > 80%

---

**🎯 Utilisez ce guide pour tester toutes les fonctionnalités de l'API Translate Open !**

**URL de l'API** : `https://respectful-wonder-production.up.railway.app`

**Développé avec ❤️ par øRits**

