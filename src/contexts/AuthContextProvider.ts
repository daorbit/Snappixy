import { createContext } from 'react';
import { type AuthContextType } from '../types/index.ts';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
