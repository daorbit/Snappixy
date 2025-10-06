import { type AuthContextType } from '../types/index.ts';
import { useContext } from 'react';
import { AuthContext } from './AuthContextProvider.ts';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
