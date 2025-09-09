# 🚀 Guide d'Intégration React - API de Traduction

Guide complet pour intégrer l'API de traduction Translate Open dans votre application React.

## 🎯 **Problème Résolu**

**Symptôme :** "J'ai connecté l'API mais quand je choisis une langue, ça ne traduit pas le site"

**Cause :** L'API fonctionne, mais il manque l'intégration côté React pour :
- Détecter les changements de langue
- Appeler l'API de traduction
- Mettre à jour le contenu de la page

## 🔧 **Solution Complète React**

### **1. Composant Provider de Traduction**

Créez le fichier `src/components/TranslationProvider.jsx` :

```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Contexte de traduction
const TranslationContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

// Provider principal
export const TranslationProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationCache, setTranslationCache] = useState({});

  // Fonction de traduction avec cache
  const translateContent = async (text, targetLanguage) => {
    // Vérifier le cache d'abord
    const cacheKey = `${text}_${targetLanguage}`;
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }

    try {
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
        // Mettre en cache la traduction
        setTranslationCache(prev => ({
          ...prev,
          [cacheKey]: data.translatedText
        }));
        return data.translatedText;
      } else {
        console.error('Erreur de traduction:', data.error);
        return text;
      }
    } catch (error) {
      console.error('Erreur de connexion API:', error);
      return text;
    }
  };

  // Traduire un élément spécifique
  const translateElement = async (element, targetLanguage) => {
    const originalText = element.textContent.trim();
    if (originalText && originalText.length > 0) {
      const translatedText = await translateContent(originalText, targetLanguage);
      element.textContent = translatedText;
    }
  };

  // Traduire toute la page
  const translatePage = async (targetLanguage) => {
    if (isTranslating || targetLanguage === currentLanguage) return;
    
    setIsTranslating(true);
    
    try {
      // Sélectionner tous les éléments à traduire (pas ceux avec translate="no")
      const elementsToTranslate = document.querySelectorAll(
        'h1, h2, h3, h4, h5, h6, p, span, div:not([translate="no"]):not(.notranslate):not(.user-data):not(.action-no-translate)'
      );
      
      // Traduire par petits groupes pour éviter de surcharger l'API
      const batchSize = 5;
      for (let i = 0; i < elementsToTranslate.length; i += batchSize) {
        const batch = Array.from(elementsToTranslate).slice(i, i + batchSize);
        
        await Promise.all(
          batch.map(element => translateElement(element, targetLanguage))
        );
        
        // Petite pause entre les batches
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      setCurrentLanguage(targetLanguage);
      
    } catch (error) {
      console.error('Erreur lors de la traduction:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  // Valeurs du contexte
  const value = {
    currentLanguage,
    isTranslating,
    translatePage,
    translateContent
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};
```

### **2. Composant Sélecteur de Langue**

Créez le fichier `src/components/LanguageSelector.jsx` :

```jsx
import React from 'react';
import { useTranslation } from './TranslationProvider';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
];

export const LanguageSelector = () => {
  const { currentLanguage, translatePage, isTranslating } = useTranslation();

  return (
    <div className="language-selector">
      <div className="language-dropdown">
        <button 
          className="language-button"
          disabled={isTranslating}
        >
          {languages.find(lang => lang.code === currentLanguage)?.flag} 
          {languages.find(lang => lang.code === currentLanguage)?.name}
          {isTranslating && ' 🔄'}
        </button>
        
        <div className="language-options">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => translatePage(language.code)}
              className={`language-option ${currentLanguage === language.code ? 'active' : ''}`}
              disabled={isTranslating}
            >
              <span className="flag">{language.flag}</span>
              <span className="name">{language.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
```

### **3. Composant Indicateur de Traduction**

Créez le fichier `src/components/TranslationIndicator.jsx` :

```jsx
import React from 'react';
import { useTranslation } from './TranslationProvider';

export const TranslationIndicator = () => {
  const { isTranslating } = useTranslation();

  if (!isTranslating) return null;

  return (
    <div className="translation-indicator">
      <div className="indicator-content">
        <div className="spinner">🔄</div>
        <p>Traduction en cours...</p>
      </div>
    </div>
  );
};
```

### **4. Styles CSS**

Créez le fichier `src/styles/translation.css` :

```css
/* Sélecteur de langue */
.language-selector {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.language-dropdown {
  position: relative;
  display: inline-block;
}

.language-button {
  background: #fff;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.language-button:hover {
  border-color: #007bff;
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.15);
}

.language-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.language-options {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1001;
  margin-top: 4px;
}

.language-option {
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background-color 0.2s ease;
  font-size: 14px;
}

.language-option:hover {
  background-color: #f8f9fa;
}

.language-option.active {
  background-color: #e3f2fd;
  color: #1976d2;
  font-weight: 500;
}

.language-option:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.flag {
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.name {
  flex: 1;
}

/* Indicateur de traduction */
.translation-indicator {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.indicator-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.spinner {
  font-size: 32px;
  margin-bottom: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.indicator-content p {
  margin: 0;
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

/* Protection contre la traduction */
.notranslate,
.user-data,
.action-no-translate,
.brand-no-translate {
  translate: no !important;
}

/* Responsive */
@media (max-width: 768px) {
  .language-selector {
    top: 10px;
    right: 10px;
  }
  
  .language-button {
    padding: 8px 12px;
    font-size: 12px;
  }
  
  .language-options {
    min-width: 180px;
  }
}
```

### **5. Intégration dans votre App**

Modifiez votre fichier `src/App.jsx` :

```jsx
import React from 'react';
import { TranslationProvider } from './components/TranslationProvider';
import { LanguageSelector } from './components/LanguageSelector';
import { TranslationIndicator } from './components/TranslationIndicator';
import './styles/translation.css';

function App() {
  return (
    <TranslationProvider>
      <div className="App">
        {/* Sélecteur de langue */}
        <LanguageSelector />
        
        {/* Indicateur de traduction */}
        <TranslationIndicator />
        
        {/* Contenu de votre application */}
        <main className="main-content">
          <header>
            <h1>Welcome to our platform</h1>
            <p>This content will be translated automatically when you change the language</p>
          </header>
          
          <section>
            <h2>About Us</h2>
            <p>We are a leading company in the technology sector, providing innovative solutions for businesses worldwide.</p>
            <p>Our mission is to help companies grow and succeed in the digital age.</p>
          </section>
          
          <section>
            <h2>Our Services</h2>
            <ul>
              <li>Web Development</li>
              <li>Mobile Applications</li>
              <li>Cloud Solutions</li>
              <li>Digital Marketing</li>
            </ul>
          </section>
          
          {/* ✅ PROTÉGÉ - Ne sera pas traduit */}
          <div translate="no" className="user-data">
            <h3>User Information</h3>
            <p>Email: john.doe@example.com</p>
            <p>User ID: user_123456</p>
            <p>Phone: +1234567890</p>
          </div>
          
          {/* ✅ PROTÉGÉ - Boutons d'action */}
          <div className="actions">
            <button translate="no" className="action-no-translate">
              Login
            </button>
            <button translate="no" className="action-no-translate">
              Register
            </button>
            <button translate="no" className="action-no-translate">
              Contact Us
            </button>
          </div>
        </main>
      </div>
    </TranslationProvider>
  );
}

export default App;
```

### **6. Hook Personnalisé pour la Traduction**

Créez le fichier `src/hooks/useTranslation.js` :

```jsx
import { useTranslation as useTranslationContext } from '../components/TranslationProvider';

export const useTranslation = () => {
  const { currentLanguage, isTranslating, translatePage, translateContent } = useTranslationContext();

  // Fonction pour traduire un texte spécifique
  const t = async (text, targetLanguage = currentLanguage) => {
    if (!text) return '';
    return await translateContent(text, targetLanguage);
  };

  // Fonction pour changer de langue
  const changeLanguage = (languageCode) => {
    translatePage(languageCode);
  };

  return {
    currentLanguage,
    isTranslating,
    t,
    changeLanguage,
    translatePage
  };
};
```

### **7. Composant de Traduction Conditionnelle**

Créez le fichier `src/components/TranslatableText.jsx` :

```jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';

export const TranslatableText = ({ 
  children, 
  className = '', 
  tag = 'span',
  ...props 
}) => {
  const [translatedText, setTranslatedText] = useState(children);
  const { currentLanguage, t } = useTranslation();

  useEffect(() => {
    const translateText = async () => {
      if (children && typeof children === 'string') {
        const translated = await t(children);
        setTranslatedText(translated);
      }
    };

    translateText();
  }, [children, currentLanguage, t]);

  const Tag = tag;
  return <Tag className={className} {...props}>{translatedText}</Tag>;
};
```

## 🚀 **Utilisation Avancée**

### **Traduction de Textes Spécifiques**

```jsx
import React from 'react';
import { useTranslation } from './hooks/useTranslation';

function MyComponent() {
  const { t, currentLanguage } = useTranslation();
  const [translatedTitle, setTranslatedTitle] = useState('');

  useEffect(() => {
    const translateTitle = async () => {
      const translated = await t('Welcome to our platform');
      setTranslatedTitle(translated);
    };
    translateTitle();
  }, [currentLanguage, t]);

  return (
    <div>
      <h1>{translatedTitle}</h1>
      <TranslatableText tag="p">
        This text will be automatically translated
      </TranslatableText>
    </div>
  );
}
```

### **Traduction avec État de Chargement**

```jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from './hooks/useTranslation';

function LoadingTranslation({ text, children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState(text);
  const { currentLanguage, t } = useTranslation();

  useEffect(() => {
    const translateText = async () => {
      setIsLoading(true);
      try {
        const translated = await t(text);
        setTranslatedText(translated);
      } finally {
        setIsLoading(false);
      }
    };

    if (text) {
      translateText();
    }
  }, [text, currentLanguage, t]);

  return (
    <div>
      {isLoading ? (
        <span>🔄</span>
      ) : (
        children || translatedText
      )}
    </div>
  );
}
```

## 🔧 **Configuration et Personnalisation**

### **Variables d'Environnement**

Créez le fichier `.env.local` :

```env
REACT_APP_TRANSLATION_API_URL=https://orits-translator.up.railway.app
REACT_APP_DEFAULT_LANGUAGE=en
REACT_APP_CACHE_TRANSLATIONS=true
REACT_APP_BATCH_SIZE=5
REACT_APP_BATCH_DELAY=200
```

### **Configuration Avancée**

```jsx
// src/config/translation.js
export const translationConfig = {
  apiUrl: process.env.REACT_APP_TRANSLATION_API_URL || 'https://orits-translator.up.railway.app',
  defaultLanguage: process.env.REACT_APP_DEFAULT_LANGUAGE || 'en',
  cacheTranslations: process.env.REACT_APP_CACHE_TRANSLATIONS === 'true',
  batchSize: parseInt(process.env.REACT_APP_BATCH_SIZE) || 5,
  batchDelay: parseInt(process.env.REACT_APP_BATCH_DELAY) || 200,
  retryAttempts: 3,
  retryDelay: 1000
};
```

## 🛡️ **Protection des Données**

### **Éléments à NE JAMAIS Traduire**

```jsx
// ✅ CORRECT - Données protégées
<div translate="no" className="user-data">
  <p>john.doe@example.com</p>
  <p>User ID: 123456</p>
  <p>API Key: sk-proj-1234567890</p>
</div>

// ✅ CORRECT - Boutons d'action protégés
<button translate="no" className="action-no-translate">
  Login
</button>

// ✅ CORRECT - Noms de marque protégés
<div translate="no" className="brand-no-translate">
  øRits AI
</div>
```

### **Classes CSS de Protection**

```css
/* Ajoutez à votre CSS */
.user-data,
.action-no-translate,
.brand-no-translate,
.notranslate {
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

## 🧪 **Tests et Débogage**

### **Test de l'API**

```jsx
// src/utils/testTranslation.js
export const testTranslationAPI = async () => {
  try {
    const response = await fetch('https://orits-translator.up.railway.app/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: "Hello, world!",
        targetLanguage: "fr"
      })
    });
    
    const data = await response.json();
    console.log('API Test Result:', data);
    
    if (data.success) {
      console.log('✅ API fonctionne:', data.translatedText);
      return true;
    } else {
      console.log('❌ Erreur API:', data.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Erreur de connexion:', error);
    return false;
  }
};

// Utilisation dans votre composant
useEffect(() => {
  testTranslationAPI();
}, []);
```

### **Débogage des Traductions**

```jsx
// Ajoutez ceci à votre TranslationProvider pour le débogage
const translateContent = async (text, targetLanguage) => {
  console.log(`🔄 Traduction: "${text}" → ${targetLanguage}`);
  
  // ... reste du code de traduction
  
  if (data.success) {
    console.log(`✅ Traduit: "${text}" → "${data.translatedText}"`);
  } else {
    console.log(`❌ Erreur: "${text}" → ${data.error}`);
  }
  
  return data.success ? data.translatedText : text;
};
```

## 📋 **Checklist d'Implémentation**

- [ ] **TranslationProvider** créé et configuré
- [ ] **LanguageSelector** implémenté
- [ ] **TranslationIndicator** ajouté
- [ ] **Styles CSS** importés
- [ ] **App.jsx** modifié pour utiliser le provider
- [ ] **Protection des données** implémentée
- [ ] **Test de l'API** effectué
- [ ] **Débogage** activé (optionnel)

## 🚀 **Déploiement**

1. **Testez localement** avec `npm start`
2. **Vérifiez la console** pour les erreurs
3. **Testez le changement de langue**
4. **Vérifiez la protection des données**
5. **Déployez** avec `npm run build`

## 🆘 **Dépannage**

### **Problèmes Courants**

1. **"API ne répond pas"**
   - Vérifiez votre connexion internet
   - Testez l'API directement dans la console

2. **"Traduction ne fonctionne pas"**
   - Vérifiez que le TranslationProvider entoure votre app
   - Vérifiez la console pour les erreurs

3. **"Éléments protégés traduits"**
   - Vérifiez que `translate="no"` est présent
   - Vérifiez les classes CSS de protection

### **Support**

- **Email** : support@orits.ai
- **Discord** : [øRits Community](https://discord.gg/zRHGHRaKY7)
- **GitHub** : [Issues](https://github.com/your-repo/issues)

---

**Développé avec ❤️ par øRits**
