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
3. **Aucune clé API requise** - L'API est ouverte et gratuite

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

**✅ API Ouverte :** Aucune clé API requise - L'API est gratuite et ouverte à tous.

### Headers Requis

```http
Content-Type: application/json
```

### ⚠️ Note Importante

L'API ne nécessite **aucune authentification**. Vous pouvez l'utiliser directement sans clé API.

## 🌍 Endpoint de Traduction

### POST /api/translate

Traduit du texte d'une langue vers une autre.

#### Requête

```http
POST https://orits-translator.up.railway.app/api/translate
Content-Type: application/json

{
  "text": "Hello, world!",
  "targetLanguage": "fr"
}
```

#### Paramètres

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `text` | string | ✅ | Texte à traduire (max 10,000 caractères) |
| `targetLanguage` | string | ✅ | Langue cible |

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

### ⚠️ **CRITIQUE : Protégez les Données Sensibles**

**IMPORTANT** : Avant d'intégrer l'API de traduction, vous DEVEZ protéger les données personnelles et les éléments sensibles pour éviter qu'ils soient traduits automatiquement.

### 🔧 **Méthodes de Protection**

#### **1. Protection par Attribut HTML**

```html
<!-- ✅ CORRECT - Ces éléments ne seront PAS traduits -->
<div translate="no">john.doe@example.com</div>
<span translate="no">John Doe</span>
<p translate="no">+1234567890</p>
<button translate="no">Login</button>
<input translate="no" type="email" value="user@example.com">

<!-- ❌ INCORRECT - Ces éléments SERONT traduits -->
<div>john.doe@example.com</div>
<span>John Doe</span>
<p>+1234567890</p>
<button>Login</button>
```

#### **2. Protection par Classes CSS**

```html
<!-- ✅ CORRECT - Classes CSS pour protection -->
<div class="notranslate">john.doe@example.com</div>
<span class="user-data">John Doe</span>
<p class="form-no-translate">+1234567890</p>
<button class="action-no-translate">Login</button>
<div class="brand-no-translate">øRits AI</div>
```

#### **3. Protection en React/JavaScript**

```jsx
// ✅ CORRECT - Composants protégés
function UserProfile({ user }) {
  return (
    <div className="user-profile">
      {/* ✅ PROTÉGÉ - Données personnelles */}
      <div translate="no" className="user-data">
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <p>{user.phone}</p>
      </div>
      
      {/* ✅ PROTÉGÉ - Boutons d'action */}
      <button translate="no" className="action-no-translate">
        Edit Profile
      </button>
      
      {/* ✅ PROTÉGÉ - Codes techniques */}
      <div translate="no" className="notranslate">
        <p>User ID: {user.id}</p>
        <p>API Key: {user.apiKey}</p>
      </div>
      
      {/* ✅ TRADUIT - Contenu descriptif */}
      <div>
        <p>Welcome to your profile page</p>
        <p>Here you can manage your account settings</p>
      </div>
    </div>
  );
}
```

### 🚨 **Éléments à NE JAMAIS Traduire**

#### **Données Personnelles :**
- ✅ **Emails** : `john.doe@example.com`
- ✅ **Noms** : `John Doe`, `Marie Dupont`
- ✅ **Téléphones** : `+1234567890`
- ✅ **Adresses** : `123 Rue de la Paix`

#### **Codes Techniques :**
- ✅ **IDs utilisateur** : `user_123456`
- ✅ **Tokens API** : `sk-proj-1234567890`
- ✅ **URLs** : `https://example.com`
- ✅ **Codes de référence** : `REF-2024-001`

#### **Éléments d'Interface :**
- ✅ **Boutons d'action** : `Login`, `Submit`, `Cancel`
- ✅ **Navigation** : `Home`, `Profile`, `Settings`
- ✅ **Métadonnées** : `Created`, `Updated`, `Status`

#### **Noms de Marque :**
- ✅ **Entreprises** : `øRits AI`, `Google`, `Microsoft`
- ✅ **Produits** : `iPhone`, `Windows`, `Chrome`

### ✅ **Éléments à Traduire**

#### **Contenu Dynamique :**
- ✅ **Articles** : Contenu des blogs, actualités
- ✅ **Descriptions** : Descriptions de produits, services
- ✅ **Messages** : Messages d'erreur, notifications

#### **Labels d'Interface :**
- ✅ **Titres** : Titres de pages, sections
- ✅ **Instructions** : Textes d'aide, guides
- ✅ **Confirmations** : Messages de succès

### 🎨 **CSS de Protection**

```css
/* Classes de protection contre la traduction */
.notranslate {
  translate: no !important;
}

.user-data {
  translate: no !important;
}

.form-no-translate {
  translate: no !important;
}

.action-no-translate {
  translate: no !important;
}

.brand-no-translate {
  translate: no !important;
}

/* Protection automatique pour certains éléments */
input[type="email"],
input[type="tel"],
input[type="password"],
.api-key,
.user-id,
.token {
  translate: no !important;
}
```

### 🔍 **Script de Vérification**

```javascript
// Script pour vérifier la protection
function checkTranslationProtection() {
  const sensitiveSelectors = [
    'input[type="email"]',
    'input[type="tel"]', 
    '.user-data',
    '.api-key',
    '.user-id',
    'button',
    '.brand-name'
  ];
  
  let unprotectedCount = 0;
  
  sensitiveSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      const isProtected = element.hasAttribute('translate') && 
                         element.getAttribute('translate') === 'no';
      
      if (!isProtected) {
        console.warn('⚠️ Élément non protégé détecté:', element);
        unprotectedCount++;
      }
    });
  });
  
  if (unprotectedCount === 0) {
    console.log('✅ Tous les éléments sensibles sont protégés');
  } else {
    console.error(`❌ ${unprotectedCount} éléments sensibles non protégés`);
  }
}

// Exécuter la vérification
checkTranslationProtection();
```

### 📋 **Checklist de Protection**

**Avant de déployer votre site avec l'API de traduction :**

- [ ] **Emails** : Tous les emails ont `translate="no"`
- [ ] **Noms** : Tous les noms ont `translate="no"`
- [ ] **Téléphones** : Tous les téléphones ont `translate="no"`
- [ ] **IDs** : Tous les IDs ont `translate="no"`
- [ ] **Boutons** : Tous les boutons ont `translate="no"`
- [ ] **Navigation** : Tous les éléments de navigation ont `translate="no"`
- [ ] **Classes CSS** : Classes de protection ajoutées
- [ ] **Script de vérification** : Script de contrôle implémenté
- [ ] **Test de protection** : Vérification manuelle effectuée

### 🚀 **Exemple Complet d'Implémentation**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Mon Site Multilingue</title>
    <style>
        .notranslate { translate: no !important; }
        .user-data { translate: no !important; }
        .action-no-translate { translate: no !important; }
    </style>
</head>
<body>
    <!-- ✅ PROTÉGÉ - Données utilisateur -->
    <div class="user-profile">
        <h1 translate="no" class="user-data">John Doe</h1>
        <p translate="no" class="user-data">john.doe@example.com</p>
        <p translate="no" class="user-data">+1234567890</p>
        <p translate="no" class="notranslate">User ID: user_123456</p>
    </div>
    
    <!-- ✅ PROTÉGÉ - Boutons d'action -->
    <div class="actions">
        <button translate="no" class="action-no-translate">Login</button>
        <button translate="no" class="action-no-translate">Register</button>
        <button translate="no" class="action-no-translate">Settings</button>
    </div>
    
    <!-- ✅ TRADUIT - Contenu descriptif -->
    <div class="content">
        <h2>Welcome to our platform</h2>
        <p>This is a description that can be translated</p>
        <p>Here you can manage your account and preferences</p>
    </div>
    
    <script>
        // Script de vérification
        function checkProtection() {
            const sensitive = document.querySelectorAll('.user-data, .action-no-translate');
            let unprotected = 0;
            
            sensitive.forEach(el => {
                if (!el.hasAttribute('translate') || el.getAttribute('translate') !== 'no') {
                    unprotected++;
                }
            });
            
            console.log(unprotected === 0 ? '✅ Protection OK' : `❌ ${unprotected} éléments non protégés`);
        }
        
        checkProtection();
    </script>
</body>
</html>
```

### ⚠️ **Avertissements Importants**

1. **Sécurité** : Ne jamais traduire les mots de passe, tokens API, ou données sensibles
2. **Expérience utilisateur** : Les noms propres et marques doivent rester dans leur langue originale
3. **Fonctionnalité** : Les boutons d'action doivent garder leur fonction même traduits
4. **Performance** : Protéger les éléments réduit les appels API inutiles

## 🚀 Intégration avec Frameworks

### React/Next.js

```jsx
import React, { useState } from 'react';

function TranslationComponent() {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('fr');

  const translateText = async () => {
    try {
      const response = await fetch('https://orits-translator.up.railway.app/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLanguage })
      });
      
      const data = await response.json();
      if (data.success) {
        setTranslatedText(data.translatedText);
      }
    } catch (error) {
      console.error('Erreur de traduction:', error);
    }
  };

  return (
    <div>
      {/* ✅ PROTÉGÉ - Données utilisateur */}
      <div translate="no" className="user-data">
        <p>User: john.doe@example.com</p>
        <p>ID: user_123456</p>
      </div>
      
      {/* ✅ TRADUIT - Interface de traduction */}
      <div>
        <textarea 
          value={text} 
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to translate"
        />
        <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
          <option value="fr">Français</option>
          <option value="es">Espagnol</option>
          <option value="de">Allemand</option>
        </select>
        <button onClick={translateText}>Translate</button>
        {translatedText && <p>Translated: {translatedText}</p>}
      </div>
    </div>
  );
}
```

### Vue.js

```vue
<template>
  <div>
    <!-- ✅ PROTÉGÉ - Données utilisateur -->
    <div translate="no" class="user-data">
      <p>User: {{ user.email }}</p>
      <p>ID: {{ user.id }}</p>
    </div>
    
    <!-- ✅ TRADUIT - Interface de traduction -->
    <div>
      <textarea v-model="text" placeholder="Enter text to translate"></textarea>
      <select v-model="targetLanguage">
        <option value="fr">Français</option>
        <option value="es">Espagnol</option>
        <option value="de">Allemand</option>
      </select>
      <button @click="translateText">Translate</button>
      <p v-if="translatedText">Translated: {{ translatedText }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: '',
      translatedText: '',
      targetLanguage: 'fr',
      user: {
        email: 'john.doe@example.com',
        id: 'user_123456'
      }
    };
  },
  methods: {
    async translateText() {
      try {
        const response = await fetch('https://orits-translator.up.railway.app/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            text: this.text, 
            targetLanguage: this.targetLanguage 
          })
        });
        
        const data = await response.json();
        if (data.success) {
          this.translatedText = data.translatedText;
        }
      } catch (error) {
        console.error('Erreur de traduction:', error);
      }
    }
  }
};
</script>

<style>
.user-data {
  translate: no !important;
}
</style>
```

### Angular

```typescript
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-translation',
  template: `
    <div>
      <!-- ✅ PROTÉGÉ - Données utilisateur -->
      <div translate="no" class="user-data">
        <p>User: {{ user.email }}</p>
        <p>ID: {{ user.id }}</p>
      </div>
      
      <!-- ✅ TRADUIT - Interface de traduction -->
      <div>
        <textarea [(ngModel)]="text" placeholder="Enter text to translate"></textarea>
        <select [(ngModel)]="targetLanguage">
          <option value="fr">Français</option>
          <option value="es">Espagnol</option>
          <option value="de">Allemand</option>
        </select>
        <button (click)="translateText()">Translate</button>
        <p *ngIf="translatedText">Translated: {{ translatedText }}</p>
      </div>
    </div>
  `,
  styles: [`
    .user-data {
      translate: no !important;
    }
  `]
})
export class TranslationComponent {
  text = '';
  translatedText = '';
  targetLanguage = 'fr';
  user = {
    email: 'john.doe@example.com',
    id: 'user_123456'
  };

  constructor(private http: HttpClient) {}

  async translateText() {
    try {
      const response = await this.http.post('https://orits-translator.up.railway.app/api/translate', {
        text: this.text,
        targetLanguage: this.targetLanguage
      }).toPromise();
      
      if (response.success) {
        this.translatedText = response.translatedText;
      }
    } catch (error) {
      console.error('Erreur de traduction:', error);
    }
  }
}
```

## 💻 Exemples d'Intégration

### JavaScript/Node.js

```javascript
const translateText = async (text, targetLanguage) => {
  const response = await fetch('https://orits-translator.up.railway.app/api/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
      targetLanguage: targetLanguage
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
  const translation = await translateText("Hello, world!", "fr");
  console.log(translation); // "Bonjour le monde !"
} catch (error) {
  console.error("Erreur de traduction:", error.message);
}
```

### Python

```python
import requests
import json

def translate_text(text, target_language):
    url = "https://orits-translator.up.railway.app/api/translate"
    
    payload = {
        "text": text,
        "targetLanguage": target_language
    }
    
    response = requests.post(url, json=payload)
    data = response.json()
    
    if data["success"]:
        return data["translatedText"]
    else:
        raise Exception(data["error"])

# Utilisation
try:
    translation = translate_text("Hello, world!", "fr")
    print(translation)  # "Bonjour le monde !"
except Exception as e:
    print(f"Erreur de traduction: {e}")
```

### PHP

```php
<?php
function translateText($text, $targetLanguage) {
    $url = "https://orits-translator.up.railway.app/api/translate";
    
    $data = [
        "text" => $text,
        "targetLanguage" => $targetLanguage
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
    $translation = translateText("Hello, world!", "fr");
    echo $translation; // "Bonjour le monde !"
} catch (Exception $e) {
    echo "Erreur de traduction: " . $e->getMessage();
}
?>
```

### cURL

```bash
# Traduction simple
curl -X POST https://orits-translator.up.railway.app/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, world!",
    "targetLanguage": "fr"
  }'

# Traduction vers l'anglais
curl -X POST https://orits-translator.up.railway.app/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Bonjour le monde !",
    "targetLanguage": "en"
  }'

# Traduction vers l'espagnol
curl -X POST https://orits-translator.up.railway.app/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hola mundo!",
    "targetLanguage": "fr"
  }'
```

## 🔒 Gestion des Erreurs

### Codes d'Erreur

| Code | Description | Solution |
|------|-------------|----------|
| `400` | Requête invalide | Vérifier les paramètres |
| `429` | Rate limit dépassé | Attendre ou augmenter la limite |
| `500` | Erreur serveur | Réessayer plus tard |

### Gestion des Erreurs

```javascript
const handleTranslation = async (text, targetLanguage) => {
  try {
    const response = await fetch('https://orits-translator.up.railway.app/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLanguage })
    });

    const data = await response.json();

    switch (response.status) {
      case 200:
        return data.translatedText;
      case 400:
        throw new Error('Paramètres invalides');
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

- **Limite** : 60 requêtes par minute par IP
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

const translateLongText = async (text, targetLanguage) => {
  const chunks = splitText(text);
  const translations = await Promise.all(
    chunks.map(chunk => translateText(chunk, targetLanguage))
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
GET https://orits-translator.up.railway.app/api/stats
```

**Note :** L'endpoint stats nécessite une clé API pour l'accès aux données détaillées.

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

2. **"Invalid request"**
   - Solution : Vérifier que les paramètres text et targetLanguage sont fournis

3. **"Translation failed"**
   - Solution : Vérifier votre connexion internet et réessayer

### Contact

- **Email** : support@orits.ai
- **Discord** : [øRits Community](https://discord.gg/zRHGHRaKY7)
- **GitHub** : [Issues](https://github.com/your-repo/issues)

---

**Développé avec ❤️ par øRits**
