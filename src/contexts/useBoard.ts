import { useContext } from 'react';
import { BoardContext } from './BoardContext';

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
}; 