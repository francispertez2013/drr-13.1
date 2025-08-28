import { useContext } from 'react';
import { DatabaseContext } from '../contexts/DatabaseContext';

// This hook provides a clean way to access the context's value
export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};