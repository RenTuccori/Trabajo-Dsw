import { useContext } from 'react';
import { PacientesContext } from './PacientesContext';
// eslint-disable-next-line react-refresh/only-export-components
export const usePacientes = () => {
  const context = useContext(PacientesContext);
  if (!context) {
    throw new Error('usePacientes must be used within an PacientesProvider');
  }
  return context;
};
