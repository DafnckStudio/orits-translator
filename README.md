# Translate Open

Système de traduction automatique professionnel avec API hébergée, alimenté par l'IA OpenAI.

## 🚀 Fonctionnalités

- **Traduction en temps réel** : Traduction instantanée entre 10 langues supportées
- **API RESTful** : Interface API simple et documentée pour l'intégration
- **Cache intelligent** : Système de cache pour réduire les coûts et améliorer les performances
- **Rate limiting** : Protection contre l'abus avec limitation de taux
- **Interface multilingue** : Interface utilisateur disponible en plusieurs langues
- **Détection automatique** : Détection automatique de la langue source
- **Statistiques détaillées** : Suivi des utilisations et des coûts

## 🌍 Langues Supportées

- 🇺🇸 Anglais (en)
- 🇫🇷 Français (fr)
- 🇪🇸 Espagnol (es)
- 🇩🇪 Allemand (de)
- 🇮🇹 Italien (it)
- 🇵🇹 Portugais (pt)
- 🇯🇵 Japonais (ja)
- 🇰🇷 Coréen (ko)
- 🇨🇳 Chinois (zh)
- 🇸🇦 Arabe (ar)

## 🛠️ Stack Technique

- **Frontend** : Next.js 14 avec App Router
- **Internationalisation** : next-intl
- **Base de données** : PostgreSQL avec Drizzle ORM
- **IA** : OpenAI GPT-3.5-turbo / GPT-4
- **Déploiement** : Railway
- **Styling** : Tailwind CSS
- **UI Components** : Radix UI + shadcn/ui

## 📦 Installation

### Prérequis

- Node.js 18+
- PostgreSQL
- Clé API OpenAI

### Installation locale

```bash
# Cloner le repository
git clone <repository-url>
cd translate-open

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp env.example .env.local
# Éditer .env.local avec vos clés API

# Générer les migrations de base de données
npm run db:generate

# Appliquer les migrations
npm run db:setup

# Démarrer le serveur de développement
npm run dev
```

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production

# Base de données
npm run db:generate  # Générer les migrations
npm run db:migrate   # Appliquer les migrations
npm run db:setup     # Setup complet de la DB
npm run db:studio    # Interface Drizzle Studio

# Traduction
npm run translate    # Traduire les fichiers de locale
npm run validate-locales # Valider les fichiers de traduction
```

## 🌐 API

### Endpoint de Traduction

```http
POST /api/translate
Content-Type: application/json

{
  "text": "Hello, world!",
  "sourceLanguage": "en",
  "targetLanguage": "fr",
  "apiKey": "your-api-key"
}
```

### Réponse

```json
{
  "success": true,
  "translatedText": "Bonjour le monde !",
  "sourceLanguage": "en",
  "targetLanguage": "fr",
  "provider": "openai",
  "model": "gpt-3.5-turbo",
  "tokensUsed": 25,
  "cost": 0.0001,
  "cached": false
}
```

### Endpoints Disponibles

- `POST /api/translate` - Traduction de texte
- `GET /api/health` - Vérification de santé
- `GET /api/stats` - Statistiques d'utilisation

## 🗄️ Base de Données

### Tables Principales

- **users** - Utilisateurs et clés API
- **translations_cache** - Cache des traductions
- **api_usage** - Suivi de l'utilisation de l'API
- **rate_limits** - Gestion des limites de taux

## 🚀 Déploiement sur Railway

1. **Créer un projet Railway** :
   ```bash
   railway login
   railway init
   ```

2. **Ajouter PostgreSQL** :
   ```bash
   railway add --database postgres
   ```

3. **Configurer les variables d'environnement** :
   - `OPENAI_API_KEY` - Votre clé API OpenAI
   - `DATABASE_URL` - URL de connexion PostgreSQL (automatique)
   - `NEXTAUTH_SECRET` - Secret pour NextAuth
   - `NEXTAUTH_URL` - URL de votre application

4. **Déployer** :
   ```bash
   railway up
   ```

## 📊 Monitoring et Statistiques

L'API fournit des statistiques détaillées :

- Nombre total de traductions
- Coût total des traductions
- Tokens utilisés
- Langues les plus traduites
- Utilisation par heure
- Endpoints les plus utilisés

## 🔒 Sécurité

- **Rate limiting** : 60 requêtes par minute par clé API
- **Validation des entrées** : Validation stricte avec Zod
- **Cache sécurisé** : Hash SHA-256 pour l'identification des traductions
- **Logs d'audit** : Suivi complet des utilisations

## 🌍 Internationalisation

Le système supporte l'internationalisation complète :

- Interface utilisateur multilingue
- Détection automatique de la langue
- Support RTL pour l'arabe
- SEO multilingue avec hreflang

## 📈 Performance

- **Cache intelligent** : Évite les retraductions coûteuses
- **Optimisation des tokens** : Utilisation efficace des modèles OpenAI
- **Rate limiting** : Protection contre la surcharge
- **Monitoring** : Suivi des performances en temps réel

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :

- Créer une issue sur GitHub
- Consulter la documentation API
- Vérifier les logs de déploiement sur Railway

---

**Développé avec ❤️ par øRits**

