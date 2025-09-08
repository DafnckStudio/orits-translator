'use client';

import { useState } from 'react';

export default function TestPage() {
  const [text, setText] = useState('Hello, world!');
  const [targetLanguage, setTargetLanguage] = useState('fr');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const translate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/translate-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          targetLanguage,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data.translatedText);
      } else {
        setResult(`Error: ${data.error}`);
      }
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          🚀 Translate Open API - Test Simple
        </h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texte à traduire
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Entrez le texte à traduire..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Langue cible
            </label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="de">Deutsch</option>
              <option value="it">Italiano</option>
              <option value="pt">Português</option>
              <option value="ja">日本語</option>
              <option value="ko">한국어</option>
              <option value="zh">中文</option>
              <option value="ar">العربية</option>
            </select>
          </div>

          <button
            onClick={translate}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Traduction en cours...' : 'Traduire'}
          </button>

          {result && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h3 className="font-medium text-gray-700 mb-2">Résultat :</h3>
              <p className="text-gray-900">{result}</p>
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-md">
          <h3 className="font-medium text-blue-800 mb-2">🔗 API Endpoints :</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li><strong>Health Check:</strong> <code>GET /api/health-simple</code></li>
            <li><strong>Translation:</strong> <code>POST /api/translate-simple</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

