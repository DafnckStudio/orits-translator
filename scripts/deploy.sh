#!/bin/bash

# Script de déploiement pour Railway
echo "🚀 Déploiement de Translate Open sur Railway..."

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

# Build du projet
echo "🔨 Build du projet..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Échec du build. Arrêt du déploiement."
    exit 1
fi

# Déploiement
echo "📦 Déploiement sur Railway..."
railway up

if [ $? -eq 0 ]; then
    echo "✅ Déploiement réussi !"
    echo "🌐 Votre application est disponible sur Railway"
else
    echo "❌ Échec du déploiement"
    exit 1
fi

