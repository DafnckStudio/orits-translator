import React from 'react';
import { cn } from '@/lib/utils';

interface TranslationGuardProps {
  children: React.ReactNode;
  className?: string;
  reason?: 'user-data' | 'technical' | 'brand' | 'code' | 'custom';
  customReason?: string;
}

/**
 * Composant pour protéger le contenu contre la traduction automatique
 * Utilise les attributs HTML standard et des classes CSS personnalisées
 */
export const TranslationGuard: React.FC<TranslationGuardProps> = ({
  children,
  className,
  reason = 'user-data',
  customReason
}) => {
  const getReasonText = () => {
    switch (reason) {
      case 'user-data':
        return 'Données personnelles utilisateur';
      case 'technical':
        return 'Données techniques';
      case 'brand':
        return 'Nom de marque';
      case 'code':
        return 'Code ou identifiant technique';
      case 'custom':
        return customReason || 'Contenu non traduisible';
      default:
        return 'Contenu protégé';
    }
  };

  return (
    <span
      className={cn(
        'notranslate', // Classe standard pour bloquer la traduction
        'translate-protected', // Classe personnalisée
        `translate-protected-${reason}`, // Classe spécifique au type
        className
      )}
      translate="no" // Attribut HTML standard
      data-translate-protection={reason}
      data-translate-reason={getReasonText()}
      title={`Contenu protégé contre la traduction: ${getReasonText()}`}
    >
      {children}
    </span>
  );
};

/**
 * Composant spécialisé pour les données utilisateur
 */
export const UserDataGuard: React.FC<{
  children: React.ReactNode;
  className?: string;
  dataType?: 'email' | 'name' | 'phone' | 'address' | 'id';
}> = ({ children, className, dataType = 'name' }) => {
  return (
    <TranslationGuard
      reason="user-data"
      customReason={`Données utilisateur (${dataType})`}
      className={cn('user-data-protected', `user-data-${dataType}`, className)}
    >
      {children}
    </TranslationGuard>
  );
};

/**
 * Composant spécialisé pour les noms de marque
 */
export const BrandGuard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <TranslationGuard
      reason="brand"
      className={cn('brand-protected', className)}
    >
      {children}
    </TranslationGuard>
  );
};

/**
 * Composant spécialisé pour les codes techniques
 */
export const CodeGuard: React.FC<{
  children: React.ReactNode;
  className?: string;
  codeType?: 'id' | 'token' | 'hash' | 'url' | 'email';
}> = ({ children, className, codeType = 'id' }) => {
  return (
    <TranslationGuard
      reason="code"
      customReason={`Code technique (${codeType})`}
      className={cn('code-protected', `code-${codeType}`, className)}
    >
      {children}
    </TranslationGuard>
  );
};

/**
 * Hook pour vérifier si un élément doit être protégé
 */
export const useTranslationProtection = () => {
  const protectUserData = (text: string, type: 'email' | 'name' | 'phone' | 'address' | 'id') => {
    return (
      <UserDataGuard dataType={type}>
        {text}
      </UserDataGuard>
    );
  };

  const protectBrand = (text: string) => {
    return (
      <BrandGuard>
        {text}
      </BrandGuard>
    );
  };

  const protectCode = (text: string, type: 'id' | 'token' | 'hash' | 'url' | 'email') => {
    return (
      <CodeGuard codeType={type}>
        {text}
      </CodeGuard>
    );
  };

  const protectCustom = (text: string, reason: string) => {
    return (
      <TranslationGuard reason="custom" customReason={reason}>
        {text}
      </TranslationGuard>
    );
  };

  return {
    protectUserData,
    protectBrand,
    protectCode,
    protectCustom,
  };
};

