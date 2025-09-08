import React from 'react';
import { UserDataGuard, CodeGuard, TranslationGuard } from './TranslationGuard';
import { useTranslations } from 'next-intl';

interface ProtectedFormProps {
  className?: string;
}

/**
 * Composant de formulaire montrant comment protéger les champs
 * contre la traduction automatique
 */
export const ProtectedForm: React.FC<ProtectedFormProps> = ({ className }) => {
  const t = useTranslations('common');

  return (
    <form className={`protected-form p-6 bg-white rounded-lg shadow-md ${className}`}>
      <h2 className="text-2xl font-bold mb-6">
        {t('form.title')} {/* Traduisible */}
      </h2>
      
      <div className="space-y-6">
        {/* Section Informations Personnelles */}
        <div className="section">
          <h3 className="text-lg font-semibold mb-4">
            {t('form.personalInfo')} {/* Traduisible */}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Prénom */}
            <div className="field">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.firstName')} {/* Traduisible */}
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="form-no-translate w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('form.firstNamePlaceholder')} /* Traduisible */
                translate="no" // Protection HTML native
              />
            </div>
            
            {/* Nom */}
            <div className="field">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.lastName')} {/* Traduisible */}
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="form-no-translate w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('form.lastNamePlaceholder')} /* Traduisible */
                translate="no" // Protection HTML native
              />
            </div>
            
            {/* Email */}
            <div className="field">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.email')} {/* Traduisible */}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-no-translate w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('form.emailPlaceholder')} /* Traduisible */
                translate="no" // Protection HTML native
              />
            </div>
            
            {/* Téléphone */}
            <div className="field">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.phone')} {/* Traduisible */}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-no-translate w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('form.phonePlaceholder')} /* Traduisible */
                translate="no" // Protection HTML native
              />
            </div>
          </div>
        </div>
        
        {/* Section Adresse */}
        <div className="section">
          <h3 className="text-lg font-semibold mb-4">
            {t('form.address')} {/* Traduisible */}
          </h3>
          
          <div className="space-y-4">
            {/* Adresse */}
            <div className="field">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.streetAddress')} {/* Traduisible */}
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                className="form-no-translate w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('form.streetAddressPlaceholder')} /* Traduisible */
                translate="no" // Protection HTML native
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Ville */}
              <div className="field">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.city')} {/* Traduisible */}
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="form-no-translate w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('form.cityPlaceholder')} /* Traduisible */
                  translate="no" // Protection HTML native
                />
              </div>
              
              {/* Code postal */}
              <div className="field">
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.postalCode')} {/* Traduisible */}
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  className="form-no-translate w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('form.postalCodePlaceholder')} /* Traduisible */
                  translate="no" // Protection HTML native
                />
              </div>
              
              {/* Pays */}
              <div className="field">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.country')} {/* Traduisible */}
                </label>
                <select
                  id="country"
                  name="country"
                  className="form-no-translate w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  translate="no" // Protection HTML native
                >
                  <option value="">{t('form.selectCountry')}</option>
                  <option value="FR">France</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section Informations Techniques */}
        <div className="section">
          <h3 className="text-lg font-semibold mb-4">
            {t('form.technicalInfo')} {/* Traduisible */}
          </h3>
          
          <div className="space-y-4">
            {/* ID utilisateur (lecture seule) */}
            <div className="field">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.userId')} {/* Traduisible */}
              </label>
              <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md">
                <CodeGuard codeType="id">
                  user_1234567890abcdef
                </CodeGuard>
              </div>
            </div>
            
            {/* Clé API (lecture seule) */}
            <div className="field">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.apiKey')} {/* Traduisible */}
              </label>
              <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md">
                <CodeGuard codeType="token">
                  sk-proj-1234567890abcdef...
                </CodeGuard>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section Préférences */}
        <div className="section">
          <h3 className="text-lg font-semibold mb-4">
            {t('form.preferences')} {/* Traduisible */}
          </h3>
          
          <div className="space-y-4">
            {/* Langue préférée */}
            <div className="field">
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.preferredLanguage')} {/* Traduisible */}
              </label>
              <select
                id="language"
                name="language"
                className="form-no-translate w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                translate="no" // Protection HTML native
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
            
            {/* Fuseau horaire */}
            <div className="field">
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.timezone')} {/* Traduisible */}
              </label>
              <select
                id="timezone"
                name="timezone"
                className="form-no-translate w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                translate="no" // Protection HTML native
              >
                <option value="UTC">UTC</option>
                <option value="Europe/Paris">Europe/Paris</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Boutons d'action */}
      <div className="actions mt-8 pt-6 border-t border-gray-200">
        <div className="flex space-x-4">
          <button
            type="submit"
            className="action-no-translate px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            translate="no" // Protection HTML native
          >
            {t('form.save')} {/* Traduisible */}
          </button>
          
          <button
            type="button"
            className="action-no-translate px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            translate="no" // Protection HTML native
          >
            {t('form.cancel')} {/* Traduisible */}
          </button>
          
          <button
            type="button"
            className="action-no-translate px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            translate="no" // Protection HTML native
          >
            {t('form.delete')} {/* Traduisible */}
          </button>
        </div>
      </div>
    </form>
  );
};
