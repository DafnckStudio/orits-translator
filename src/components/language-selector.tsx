'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { locales, localeNames, localeFlags, isRTL } from '@/i18n/config';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'select' | 'dropdown';
}

export function LanguageSelector({ className, variant = 'select' }: LanguageSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [isChanging, setIsChanging] = useState(false);

  const handleLanguageChange = async (newLocale: string) => {
    if (newLocale === currentLocale) return;
    
    setIsChanging(true);
    
    try {
      // Remove the current locale from the pathname
      const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';
      
      // Navigate to the new locale
      const newPath = `/${newLocale}${pathWithoutLocale}`;
      router.push(newPath);
      
      // Update document direction for RTL languages
      if (isRTL(newLocale as any)) {
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.dir = 'ltr';
      }
      
      // Update document language
      document.documentElement.lang = newLocale;
      
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsChanging(false);
    }
  };

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <Select
          value={currentLocale}
          onValueChange={handleLanguageChange}
          disabled={isChanging}
        >
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            {locales.map((locale) => (
              <SelectItem key={locale} value={locale}>
                <div className="flex items-center gap-2">
                  <span>{localeFlags[locale]}</span>
                  <span>{localeNames[locale]}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe className="h-4 w-4" />
      <Select
        value={currentLocale}
        onValueChange={handleLanguageChange}
        disabled={isChanging}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {locales.map((locale) => (
            <SelectItem key={locale} value={locale}>
              <div className="flex items-center gap-2">
                <span>{localeFlags[locale]}</span>
                <span>{localeNames[locale]}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// Compact version for mobile
export function CompactLanguageSelector({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === currentLocale) return;
    
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {locales.map((locale) => (
        <Button
          key={locale}
          variant={locale === currentLocale ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleLanguageChange(locale)}
          className="h-8 w-8 p-0"
          title={localeNames[locale]}
        >
          {localeFlags[locale]}
        </Button>
      ))}
    </div>
  );
}

