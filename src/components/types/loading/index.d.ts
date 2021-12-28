import { ReactNode } from 'react';

export interface LoadingProps {
  className?: string;
  size?: string | number;
  spinning?: boolean;
  children?: ReactNode;
}
