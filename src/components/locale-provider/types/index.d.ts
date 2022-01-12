import { ReactNode } from 'react';
import { Direction } from 'components/types/shared';

export interface LocaleProviderProps {
  /** Contents that should have the locale applied. */
  children: ReactNode;

  /** The locale to apply to the children. */
  locale?: string;
}

export interface Locale {
  /** The [BCP47](https://www.ietf.org/rfc/bcp/bcp47.txt) language code for the locale. */
  locale: string;
  /** The writing direction for the locale. */
  direction: Direction;
}
