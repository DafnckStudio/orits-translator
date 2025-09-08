#!/bin/bash

# Script pour configurer Railway avec les variables d'environnement
echo "🚀 Configuration de Railway pour Translate Open..."

# Vérifier que Railway CLI est installé
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI n'est pas installé. Installation..."
    npm install -g @railway/cli
fi

# Vérifier la connexion Railway
echo "🔐 Vérification de la connexion Railway..."
if ! railway whoami &> /dev/null; then
    echo "❌ Non connecté à Railway. Connexion..."
    railway login
fi

echo "📋 Configuration des variables d'environnement..."

# Variables d'environnement nécessaires
echo "🔑 Configuration de OPENAI_API_KEY..."
read -p "Entrez votre clé API OpenAI: " OPENAI_API_KEY
railway variables set OPENAI_API_KEY="$OPENAI_API_KEY"

echo "🔐 Configuration de NEXTAUTH_SECRET..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)
railway variables set NEXTAUTH_SECRET="$NEXTAUTH_SECRET"

echo "🌐 Configuration de NEXTAUTH_URL..."
read -p "Entrez l'URL de votre application Railway (ex: https://your-app.up.railway.app): " NEXTAUTH_URL
railway variables set NEXTAUTH_URL="$NEXTAUTH_URL"

echo "🎯 Configuration des paramètres de traduction..."
railway variables set DEFAULT_LOCALE="en"
railway variables set SUPPORTED_LOCALES="en,fr,es,de,it,pt,ja,ko,zh,ar"

echo "⚡ Configuration des limites de taux..."
railway variables set RATE_LIMIT_REQUESTS_PER_MINUTE="60"
railway variables set RATE_LIMIT_BURST="10"

echo "💾 Configuration du cache..."
railway variables set CACHE_TTL_HOURS="24"
railway variables set MAX_CACHE_SIZE="10000"

echo "✅ Configuration terminée !"
echo ""
echo "📊 Variables configurées :"
echo "  - OPENAI_API_KEY: ✅"
echo "  - NEXTAUTH_SECRET: ✅"
echo "  - NEXTAUTH_URL: ✅"
echo "  - DEFAULT_LOCALE: en"
echo "  - SUPPORTED_LOCALES: en,fr,es,de,it,pt,ja,ko,zh,ar"
echo "  - RATE_LIMIT_REQUESTS_PER_MINUTE: 60"
echo "  - RATE_LIMIT_BURST: 10"
echo "  - CACHE_TTL_HOURS: 24"
echo "  - MAX_CACHE_SIZE: 10000"
echo ""
echo "🚀 Vous pouvez maintenant déployer avec: railway up"

