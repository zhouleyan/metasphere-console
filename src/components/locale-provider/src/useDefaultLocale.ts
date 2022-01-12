/**
 * Returns the current browser/system language, and updates when it changes.
 */
import { Locale } from 'components/locale-provider/types';
import { useEffect, useState } from 'react';
import { isRTL } from 'components/locale-provider/src/utils';

/**
 * Gets the locale setting of the browser.
 */
export function getDefaultLocale(): Locale {
  // @ts-ignore
  const locale = (typeof navigator !== 'undefined' && (navigator.language || navigator.userLanguage)) || 'zh-CN';
  return {
    locale,
    direction: isRTL(locale) ? 'rtl' : 'ltr'
  };
}

let currentLocale = getDefaultLocale();
const listeners = new Set<(locale: Locale) => void>();

function updateLocale() {
  currentLocale = getDefaultLocale();
  for (let listener of listeners) {
    listener(currentLocale);
  }
}

/**
 * Returns the current browser/system language, and updates when it changes.
 */
export function useDefaultLocale(): Locale {
  let [defaultLocale, setDefaultLocale] = useState(currentLocale);

  useEffect(() => {
    if (listeners.size === 0) {
      window.addEventListener('languagechange', updateLocale);
    }

    listeners.add(setDefaultLocale);

    return () => {
      listeners.delete(setDefaultLocale);
      if (listeners.size === 0) {
        window.removeEventListener('languagechange', updateLocale);
      }
    };
  }, []);

  return defaultLocale;
}
