import React, { useContext } from 'react';
import { Locale, LocaleProviderProps } from '../types';
import { useDefaultLocale } from 'components/locale-provider/src/useDefaultLocale';
import { isRTL } from 'components/locale-provider/src/utils';

const I18nContext = React.createContext<Locale>(null);

export function LocaleProvider(props: LocaleProviderProps) {

  const { locale, children } = props;
  const defaultLocale = useDefaultLocale();

  const value: Locale = locale ? {
    locale,
    direction: isRTL(locale) ? 'rtl' : 'ltr'
  } : defaultLocale;

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

/**
 * Returns the current locale and layout direction.
 */
export function useLocale(): Locale {
  const defaultLocale = useDefaultLocale();
  const context = useContext(I18nContext);
  return context || defaultLocale;
}
