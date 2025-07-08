import { createContext } from 'react';
import type { BoardContextType } from './boardTypes';

export const BoardContext = createContext<BoardContextType | undefined>(undefined); 