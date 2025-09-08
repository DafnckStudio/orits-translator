# Guide de Déploiement - Translate Open

Ce guide vous explique comment déployer le système de traduction Translate Open sur Railway.

## 🚀 Déploiement Rapide

### 1. Prérequis

- Compte Railway (gratuit)
- Clé API OpenAI
- Railway CLI installé

### 2. Installation de Railway CLI

```bash
npm install -g @railway/cli
```

### 3. Connexion à Railway

```bash
railway login
```

### 4. Initialisation du Projet

```bash
# Dans le dossier du projet
railway init
```

### 5. Ajout de PostgreSQL

```bash
railway add --database postgres
```

### 6. Configuration des Variables d'Environnement

```bash
# Exécuter le script de configuration
./scripts/setup-railway.sh
```

Ou manuellement :

```bash
# Clé API OpenAI (OBLIGATOIRE)
railway variables set OPENAI_API_KEY="sk-your-openai-key-here"

# Secret NextAuth (généré automatiquement)
railway variables set NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# URL de l'application (à remplacer par votre URL Railway)
railway variables set NEXTAUTH_URL="https://your-app.up.railway.app"

# Configuration par défaut
railway variables set DEFAULT_LOCALE="en"
railway variables set SUPPORTED_LOCALES="en,fr,es,de,it,pt,ja,ko,zh,ar"
railway variables set RATE_LIMIT_REQUESTS_PER_MINUTE="60"
railway variables set CACHE_TTL_HOURS="24"
```

### 7. Déploiement

```bash
# Build et déploiement
railway up
```

### 8. Configuration de la Base de Données

Après le premier déploiement, exécutez les migrations :

```bash
# Se connecter au service web (pas PostgreSQL)
railway service

# Exécuter les migrations
railway run npm run db:setup
```

## 🔧 Configuration Avancée

### Variables d'Environnement Disponibles

| Variable | Description | Défaut |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Clé API OpenAI (OBLIGATOIRE) | - |
| `DATABASE_URL` | URL PostgreSQL (automatique) | - |
| `NEXTAUTH_SECRET` | Secret pour NextAuth | - |
| `NEXTAUTH_URL` | URL de l'application | - |
| `DEFAULT_LOCALE` | Langue par défaut | `en` |
| `SUPPORTED_LOCALES` | Langues supportées | `en,fr,es,de,it,pt,ja,ko,zh,ar` |
| `RATE_LIMIT_REQUESTS_PER_MINUTE` | Limite de taux | `60` |
| `RATE_LIMIT_BURST` | Burst de taux | `10` |
| `CACHE_TTL_HOURS` | Durée de vie du cache | `24` |
| `MAX_CACHE_SIZE` | Taille max du cache | `10000` |

### Domaine Personnalisé

1. Dans le dashboard Railway, allez dans votre service web
2. Cliquez sur "Settings" → "Domains"
3. Ajoutez votre domaine personnalisé
4. Configurez les DNS selon les instructions Railway

### SSL/HTTPS

Railway fournit automatiquement un certificat SSL pour tous les domaines.

## 📊 Monitoring

### Logs

```bash
# Voir les logs en temps réel
railway logs

# Logs d'un service spécifique
railway logs --service web
```

### Métriques

- **CPU/Memory** : Dashboard Railway
- **Base de données** : Dashboard Railway → Service PostgreSQL
- **API Usage** : Endpoint `/api/stats` (avec clé API)

### Health Check

```bash
# Vérifier la santé de l'application
curl https://your-app.up.railway.app/api/health
```

## 🔄 Mises à Jour

### Déploiement d'une Nouvelle Version

```bash
# 1. Mettre à jour le code
git pull origin main

# 2. Déployer
railway up
```

### Migrations de Base de Données

```bash
# Générer de nouvelles migrations
npm run db:generate

# Appliquer les migrations
railway run npm run db:setup
```

## 🚨 Dépannage

### Problèmes Courants

#### 1. Build Failed

```bash
# Vérifier les logs de build
railway logs --service web

# Vérifier les variables d'environnement
railway variables
```

#### 2. Base de Données Non Connectée

```bash
# Vérifier la connexion DB
railway run npm run db:setup

# Vérifier les variables DB
railway variables | grep DATABASE
```

#### 3. API OpenAI Non Fonctionnelle

```bash
# Vérifier la clé API
railway variables | grep OPENAI

# Tester l'API
curl -X POST https://your-app.up.railway.app/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello","targetLanguage":"fr","apiKey":"test"}'
```

#### 4. Rate Limiting

- Vérifier les limites dans `/api/stats`
- Ajuster `RATE_LIMIT_REQUESTS_PER_MINUTE` si nécessaire

### Logs Utiles

```bash
# Logs d'erreur
railway logs --service web | grep ERROR

# Logs de traduction
railway logs --service web | grep "Translation"

# Logs de base de données
railway logs --service postgres
```

## 💰 Coûts

### Railway

- **Plan Hobby** : Gratuit (limité)
- **Plan Pro** : $5/mois (recommandé pour la production)

### OpenAI

- **GPT-3.5-turbo** : ~$0.002/1K tokens
- **GPT-4** : ~$0.03/1K tokens

### Estimation des Coûts

Pour 1000 traductions/mois :
- Railway Pro : $5
- OpenAI (GPT-3.5) : ~$2-5
- **Total** : ~$7-10/mois

## 🔒 Sécurité

### Bonnes Pratiques

1. **Clés API** : Ne jamais commiter les clés API
2. **Rate Limiting** : Configurer des limites appropriées
3. **Monitoring** : Surveiller les logs et métriques
4. **Backups** : Railway fait des backups automatiques
5. **Updates** : Maintenir les dépendances à jour

### Variables Sensibles

```bash
# Variables à ne jamais exposer
OPENAI_API_KEY
DATABASE_URL
NEXTAUTH_SECRET
```

## 📞 Support

### Ressources

- [Documentation Railway](https://docs.railway.app/)
- [Documentation OpenAI](https://platform.openai.com/docs)
- [Issues GitHub](https://github.com/your-repo/issues)

### Contact

- Email : support@orits.ai
- Discord : [øRits Community](https://discord.gg/zRHGHRaKY7)

---

**Développé avec ❤️ par øRits**

