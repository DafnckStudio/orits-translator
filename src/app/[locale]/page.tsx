import { TranslationInterface } from '@/components/translation-interface';
import { LanguageSelector } from '@/components/language-selector';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { BookOpen, Zap, Shield, Globe } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Translate Open</h1>
            </div>
            <LanguageSelector variant="dropdown" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <TranslationInterface />
      </main>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Translate Open?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional translation service powered by advanced AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Get translations in seconds with our optimized AI models and caching system.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">
                Your data is protected with enterprise-grade security and 99.9% uptime.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Integration</h3>
              <p className="text-gray-600">
                Simple API integration with comprehensive documentation and examples.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* API Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Integrate our translation service into your application with our simple API
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">API Example</h3>
              <pre className="text-sm overflow-x-auto">
                <code>{`curl -X POST https://your-domain.com/api/translate \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Hello, world!",
    "sourceLanguage": "en",
    "targetLanguage": "fr",
    "apiKey": "your-api-key"
  }'`}</code>
              </pre>
            </div>

            <div className="text-center mt-8">
              <Button size="lg" className="mr-4">
                View Documentation
              </Button>
              <Button variant="outline" size="lg">
                Get API Key
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe className="h-6 w-6" />
            <span className="text-xl font-bold">Translate Open</span>
          </div>
          <p className="text-gray-400">
            © 2024 øRits. All rights reserved. Professional translation service.
          </p>
        </div>
      </footer>
    </div>
  );
}

