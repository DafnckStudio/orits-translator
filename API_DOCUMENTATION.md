# 📚 Documentation API - Translate Open

Guide complet pour utiliser l'API de traduction Translate Open.

## 🚀 Démarrage Rapide

### 1. Obtenir une Clé API

**🚀 API Déployée sur Railway :**
- **URL de l'API** : `https://orits-translator.up.railway.app`
- **Statut** : ✅ **DÉPLOYÉE ET FONCTIONNELLE**

**Pour utiliser l'API :**
1. L'API est disponible à l'adresse : `https://orits-translator.up.railway.app`
2. Testez l'API directement avec les endpoints ci-dessous
3. Aucune clé API requise pour la version de démonstration

### 2. Test de Connexion

```bash
curl -X GET https://orits-translator.up.railway.app/api/health
```

**Réponse attendue :**
```json
{
  "status": "healthy",
  "timestamp": "2025-09-08T14:09:58.360Z",
  "service": "translate-open",
  "version": "1.0.0"
}
```

**✅ Note :** L'API est déployée et fonctionnelle ! Vous pouvez commencer à l'utiliser immédiatement.

## 🔑 Authentification

**Version de démonstration :** Aucune clé API requise pour tester l'API.

### Headers Requis

```http
Content-Type: application/json
```

### Clé API

Incluez votre clé API dans le body de la requête :

```json
{
  "apiKey": "your-api-key-here"
}
```

## 🌍 Endpoint de Traduction

### POST /api/translate

Traduit du texte d'une langue vers une autre.

#### Requête

```http
POST https://orits-translator.up.railway.app/api/translate
Content-Type: application/json

{
  "text": "Hello, world!",
  "sourceLanguage": "en",
  "targetLanguage": "fr",
  "apiKey": "your-api-key-here"
}
```

#### Paramètres

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `text` | string | ✅ | Texte à traduire (max 10,000 caractères) |
| `sourceLanguage` | string | ❌ | Langue source (auto-détection si omis) |
| `targetLanguage` | string | ✅ | Langue cible |
| `apiKey` | string | ✅ | Votre clé API |

#### Langues Supportées

| Code | Langue | Drapeau |
|------|--------|---------|
| `en` | Anglais | 🇺🇸 |
| `fr` | Français | 🇫🇷 |
| `es` | Espagnol | 🇪🇸 |
| `de` | Allemand | 🇩🇪 |
| `it` | Italien | 🇮🇹 |
| `pt` | Portugais | 🇵🇹 |
| `ja` | Japonais | 🇯🇵 |
| `ko` | Coréen | 🇰🇷 |
| `zh` | Chinois | 🇨🇳 |
| `ar` | Arabe | 🇸🇦 |

#### Réponse Succès

```json
{
  "success": true,
  "translatedText": "Bonjour le monde !",
  "targetLanguage": "fr",
  "cached": false,
  "timestamp": "2025-09-08T14:10:10.274Z"
}
```

#### Réponse Erreur

```json
{
  "success": false,
  "error": "Rate limit exceeded. Maximum 60 requests per minute.",
  "targetLanguage": "fr"
}
```

## 📊 Endpoint de Statistiques

### GET /api/stats

Récupère les statistiques d'utilisation de votre clé API.

#### Requête

```http
GET /api/stats
X-API-Key: your-api-key-here
```

#### Réponse

```json
{
  "success": true,
  "data": {
    "cache": {
      "totalEntries": 1250,
      "totalCost": 15.50,
      "totalTokens": 125000,
      "topLanguages": [
        { "language": "fr", "count": 450 },
        { "language": "es", "count": 320 },
        { "language": "de", "count": 280 }
      ],
      "recentTranslations": [...]
    },
    "usage": {
      "last24Hours": {
        "totalRequests": 150,
        "totalTokens": 12500,
        "totalCost": 2.50,
        "averageResponseTime": 850
      },
      "topEndpoints": [...],
      "hourlyUsage": [...]
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

## 🛡️ Protection contre la Traduction Automatique

### ⚠️ **IMPORTANT : Protégez les Données Personnelles**

Avant d'utiliser l'API de traduction, assurez-vous de protéger les données personnelles et les éléments sensibles :

```javascript
// ✅ CORRECT - Données protégées
const protectedData = {
  userEmail: "john.doe@example.com", // PROTÉGÉ avec translate="no"
  userName: "John Doe", // PROTÉGÉ avec translate="no"
  userPhone: "+1234567890", // PROTÉGÉ avec translate="no"
  userId: "user_123456", // PROTÉGÉ avec translate="no"
  apiKey: "sk-proj-1234567890abcdef" // PROTÉGÉ avec translate="no"
};

// ❌ INCORRECT - Données non protégées
const unprotectedData = {
  userEmail: "john.doe@example.com", // NON PROTÉGÉ - RISQUE !
  userName: "John Doe", // NON PROTÉGÉ - RISQUE !
  userPhone: "+1234567890", // NON PROTÉGÉ - RISQUE !
  userId: "user_123456", // NON PROTÉGÉ - RISQUE !
  apiKey: "sk-proj-1234567890abcdef" // NON PROTÉGÉ - RISQUE !
};
```

### 🚨 **Éléments à NE JAMAIS Traduire**

1. **Données personnelles** : Emails, noms, téléphones, adresses
2. **Codes techniques** : IDs, tokens, hashes, URLs
3. **Noms de marque** : Entreprises, produits spécifiques
4. **Éléments d'interface** : Boutons, navigation, métadonnées

### ✅ **Éléments à Traduire**

1. **Contenu dynamique** : Articles, descriptions, messages
2. **Labels d'interface** : Titres, descriptions, instructions
3. **Messages utilisateur** : Notifications, erreurs, confirmations

## 💻 Exemples d'Intégration

### JavaScript/Node.js

```javascript
const translateText = async (text, targetLanguage, apiKey) => {
  const response = await fetch('https://orits-translator.up.railway.app/api/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
      targetLanguage: targetLanguage,
      apiKey: apiKey
    })
  });

  const data = await response.json();
  
  if (data.success) {
    return data.translatedText;
  } else {
    throw new Error(data.error);
  }
};

// Utilisation
try {
  const translation = await translateText("Hello, world!", "fr", "your-api-key");
  console.log(translation); // "Bonjour le monde !"
} catch (error) {
  console.error("Erreur de traduction:", error.message);
}
```

### Python

```python
import requests
import json

def translate_text(text, target_language, api_key):
    url = "https://orits-translator.up.railway.app/api/translate"
    
    payload = {
        "text": text,
        "targetLanguage": target_language,
        "apiKey": api_key
    }
    
    response = requests.post(url, json=payload)
    data = response.json()
    
    if data["success"]:
        return data["translatedText"]
    else:
        raise Exception(data["error"])

# Utilisation
try:
    translation = translate_text("Hello, world!", "fr", "your-api-key")
    print(translation)  # "Bonjour le monde !"
except Exception as e:
    print(f"Erreur de traduction: {e}")
```

### PHP

```php
<?php
function translateText($text, $targetLanguage, $apiKey) {
    $url = "https://your-app.up.railway.app/api/translate";
    
    $data = [
        "text" => $text,
        "targetLanguage" => $targetLanguage,
        "apiKey" => $apiKey
    ];
    
    $options = [
        'http' => [
            'header' => "Content-type: application/json\r\n",
            'method' => 'POST',
            'content' => json_encode($data)
        ]
    ];
    
    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    $response = json_decode($result, true);
    
    if ($response["success"]) {
        return $response["translatedText"];
    } else {
        throw new Exception($response["error"]);
    }
}

// Utilisation
try {
    $translation = translateText("Hello, world!", "fr", "your-api-key");
    echo $translation; // "Bonjour le monde !"
} catch (Exception $e) {
    echo "Erreur de traduction: " . $e->getMessage();
}
?>
```

### cURL

```bash
# Traduction simple
curl -X POST https://your-app.up.railway.app/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, world!",
    "targetLanguage": "fr",
    "apiKey": "your-api-key"
  }'

# Traduction avec langue source spécifiée
curl -X POST https://your-app.up.railway.app/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Bonjour le monde !",
    "sourceLanguage": "fr",
    "targetLanguage": "en",
    "apiKey": "your-api-key"
  }'

# Auto-détection de la langue
curl -X POST https://your-app.up.railway.app/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hola mundo!",
    "targetLanguage": "en",
    "apiKey": "your-api-key"
  }'
```

## 🔒 Gestion des Erreurs

### Codes d'Erreur

| Code | Description | Solution |
|------|-------------|----------|
| `400` | Requête invalide | Vérifier les paramètres |
| `401` | Clé API invalide | Vérifier votre clé API |
| `429` | Rate limit dépassé | Attendre ou augmenter la limite |
| `500` | Erreur serveur | Réessayer plus tard |

### Gestion des Erreurs

```javascript
const handleTranslation = async (text, targetLanguage, apiKey) => {
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLanguage, apiKey })
    });

    const data = await response.json();

    switch (response.status) {
      case 200:
        return data.translatedText;
      case 400:
        throw new Error('Paramètres invalides');
      case 401:
        throw new Error('Clé API invalide');
      case 429:
        throw new Error('Limite de taux dépassée');
      case 500:
        throw new Error('Erreur serveur');
      default:
        throw new Error(data.error || 'Erreur inconnue');
    }
  } catch (error) {
    console.error('Erreur de traduction:', error.message);
    throw error;
  }
};
```

## ⚡ Optimisations et Bonnes Pratiques

### 1. Cache Intelligent

Le système utilise un cache intelligent qui :
- Stocke les traductions par hash SHA-256
- Évite les retraductions coûteuses
- Partage le cache entre tous les utilisateurs
- Réduit les coûts OpenAI de 80-90%

### 2. Rate Limiting

- **Limite** : 60 requêtes par minute par clé API
- **Burst** : 10 requêtes simultanées
- **Pénalité** : Blocage temporaire si dépassement

### 3. Optimisation des Coûts

```javascript
// ✅ BON : Utiliser le cache
const text1 = "Hello, world!";
const text2 = "Hello, world!"; // Même texte = cache hit

// ❌ MAUVAIS : Textes similaires mais différents
const text3 = "Hello, world!";
const text4 = "Hello, world "; // Espace différent = cache miss
```

### 4. Gestion des Longs Textes

```javascript
// Diviser les longs textes
const splitText = (text, maxLength = 1000) => {
  return text.match(new RegExp(`.{1,${maxLength}}`, 'g')) || [text];
};

const translateLongText = async (text, targetLanguage, apiKey) => {
  const chunks = splitText(text);
  const translations = await Promise.all(
    chunks.map(chunk => translateText(chunk, targetLanguage, apiKey))
  );
  return translations.join(' ');
};
```

## 📈 Monitoring et Analytics

### Métriques Disponibles

- **Requêtes totales** : Nombre de traductions effectuées
- **Coût total** : Coût OpenAI cumulé
- **Tokens utilisés** : Consommation de tokens
- **Temps de réponse** : Performance moyenne
- **Taux de cache** : Pourcentage de hits cache
- **Langues populaires** : Statistiques par langue

### Dashboard de Monitoring

Accédez à vos statistiques via :
```http
GET /api/stats
X-API-Key: your-api-key
```

## 🔧 Configuration Avancée

### Variables d'Environnement

| Variable | Description | Défaut |
|----------|-------------|---------|
| `RATE_LIMIT_REQUESTS_PER_MINUTE` | Limite de taux | `60` |
| `CACHE_TTL_HOURS` | Durée de vie du cache | `24` |
| `MAX_CACHE_SIZE` | Taille max du cache | `10000` |

### Personnalisation

Pour modifier les limites, contactez l'administrateur ou modifiez les variables d'environnement Railway.

## 🆘 Support et Dépannage

### Problèmes Courants

1. **"Rate limit exceeded"**
   - Solution : Attendre 1 minute ou optimiser vos requêtes

2. **"Invalid API key"**
   - Solution : Vérifier votre clé API dans les paramètres

3. **"Translation failed"**
   - Solution : Vérifier votre connexion internet et réessayer

### Contact

- **Email** : support@orits.ai
- **Discord** : [øRits Community](https://discord.gg/zRHGHRaKY7)
- **GitHub** : [Issues](https://github.com/your-repo/issues)

---

**Développé avec ❤️ par øRits**
