// src/components/SwalConfig.jsx
import Swal from 'sweetalert2';

// Configuración para confirmar acciones
export const confirmDialog = async (title, text) => {
  return await Swal.fire({
    title: title || '¿Está seguro?',
    text: text || 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, confirmar',
    cancelButtonText: 'Cancelar',
  });
};

// Configuración para mostrar alertas de éxito
export const successAlert = async (title, text) => {
  return await Swal.fire({
    icon: 'success',
    title: title || '¡Éxito!',
    text: text || '',
    confirmButtonColor: '#3085d6',
  });
};

// Configuración para mostrar alertas de error
export const errorAlert = async (title, text) => {
  return await Swal.fire({
    icon: 'error',
    title: title || 'Error',
    text: text || '',
    confirmButtonColor: '#d33',
  });
};


