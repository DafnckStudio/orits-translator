import React from 'react';
import { UserDataGuard, BrandGuard, CodeGuard, TranslationGuard } from './TranslationGuard';
import { useTranslations } from 'next-intl';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  company?: string;
  apiKey?: string;
}

interface UserProfileProps {
  user: User;
  className?: string;
}

/**
 * Composant d'exemple montrant comment protéger les données utilisateur
 * contre la traduction automatique
 */
export const UserProfile: React.FC<UserProfileProps> = ({ user, className }) => {
  const t = useTranslations('common');

  return (
    <div className={`user-profile p-6 bg-white rounded-lg shadow-md ${className}`}>
      <h2 className="text-2xl font-bold mb-4">
        {t('userProfile.title')} {/* Traduisible */}
      </h2>
      
      <div className="space-y-4">
        {/* Informations personnelles - PROTÉGÉES */}
        <div className="personal-info">
          <h3 className="text-lg font-semibold mb-2">
            {t('userProfile.personalInfo')} {/* Traduisible */}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nom - PROTÉGÉ */}
            <div className="field">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('userProfile.firstName')} {/* Traduisible */}
              </label>
              <UserDataGuard dataType="name">
                {user.firstName}
              </UserDataGuard>
            </div>
            
            {/* Prénom - PROTÉGÉ */}
            <div className="field">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('userProfile.lastName')} {/* Traduisible */}
              </label>
              <UserDataGuard dataType="name">
                {user.lastName}
              </UserDataGuard>
            </div>
            
            {/* Email - PROTÉGÉ */}
            <div className="field">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('userProfile.email')} {/* Traduisible */}
              </label>
              <UserDataGuard dataType="email">
                {user.email}
              </UserDataGuard>
            </div>
            
            {/* Téléphone - PROTÉGÉ */}
            {user.phone && (
              <div className="field">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('userProfile.phone')} {/* Traduisible */}
                </label>
                <UserDataGuard dataType="phone">
                  {user.phone}
                </UserDataGuard>
              </div>
            )}
          </div>
        </div>
        
        {/* Adresse - PROTÉGÉE */}
        {user.address && (
          <div className="address-info">
            <h3 className="text-lg font-semibold mb-2">
              {t('userProfile.address')} {/* Traduisible */}
            </h3>
            <UserDataGuard dataType="address">
              {user.address}
            </UserDataGuard>
          </div>
        )}
        
        {/* Informations techniques - PROTÉGÉES */}
        <div className="technical-info">
          <h3 className="text-lg font-semibold mb-2">
            {t('userProfile.technicalInfo')} {/* Traduisible */}
          </h3>
          
          <div className="space-y-2">
            {/* ID utilisateur - PROTÉGÉ */}
            <div className="field">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('userProfile.userId')} {/* Traduisible */}
              </label>
              <CodeGuard codeType="id">
                {user.id}
              </CodeGuard>
            </div>
            
            {/* Clé API - PROTÉGÉE */}
            {user.apiKey && (
              <div className="field">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('userProfile.apiKey')} {/* Traduisible */}
                </label>
                <CodeGuard codeType="token">
                  {user.apiKey.substring(0, 8)}...
                </CodeGuard>
              </div>
            )}
          </div>
        </div>
        
        {/* Informations d'entreprise - MIXTE */}
        {user.company && (
          <div className="company-info">
            <h3 className="text-lg font-semibold mb-2">
              {t('userProfile.company')} {/* Traduisible */}
            </h3>
            {/* Le nom de l'entreprise peut être traduisible ou non selon le contexte */}
            <BrandGuard>
              {user.company}
            </BrandGuard>
          </div>
        )}
        
        {/* Métadonnées - PROTÉGÉES */}
        <div className="metadata">
          <h3 className="text-lg font-semibold mb-2">
            {t('userProfile.metadata')} {/* Traduisible */}
          </h3>
          
          <div className="text-sm text-gray-500 space-y-1">
            <div>
              <span className="font-medium">{t('userProfile.lastLogin')}: </span>
              <TranslationGuard reason="technical" customReason="Timestamp technique">
                {new Date().toLocaleString()}
              </TranslationGuard>
            </div>
            
            <div>
              <span className="font-medium">{t('userProfile.accountStatus')}: </span>
              <CodeGuard codeType="id">
                Active
              </CodeGuard>
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions - PROTÉGÉES */}
      <div className="actions mt-6 pt-4 border-t border-gray-200">
        <div className="flex space-x-4">
          <button className="action-no-translate px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            {t('userProfile.editProfile')} {/* Traduisible */}
          </button>
          
          <button className="action-no-translate px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            {t('userProfile.changePassword')} {/* Traduisible */}
          </button>
          
          <button className="action-no-translate px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            {t('userProfile.deleteAccount')} {/* Traduisible */}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Composant pour afficher une liste d'utilisateurs avec protection
 */
interface UserListProps {
  users: User[];
  className?: string;
}

export const UserList: React.FC<UserListProps> = ({ users, className }) => {
  const t = useTranslations('common');

  return (
    <div className={`user-list ${className}`}>
      <h2 className="text-2xl font-bold mb-4">
        {t('userList.title')} {/* Traduisible */}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user.id} className="user-card p-4 border rounded-lg">
            <div className="space-y-2">
              {/* Nom complet - PROTÉGÉ */}
              <h3 className="font-semibold">
                <UserDataGuard dataType="name">
                  {user.firstName} {user.lastName}
                </UserDataGuard>
              </h3>
              
              {/* Email - PROTÉGÉ */}
              <p className="text-sm text-gray-600">
                <UserDataGuard dataType="email">
                  {user.email}
                </UserDataGuard>
              </p>
              
              {/* ID - PROTÉGÉ */}
              <p className="text-xs text-gray-400">
                <span className="font-medium">{t('userList.id')}: </span>
                <CodeGuard codeType="id">
                  {user.id}
                </CodeGuard>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
