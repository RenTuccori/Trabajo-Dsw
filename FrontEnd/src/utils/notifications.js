// utils/notifications.js
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

// Configuración global de Toast
export const notifySuccess = (message) => {
  toast.success(message, {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: true,
    pauseOnHover: false,
    draggable: true,
    theme: 'colored',
  });
};

export const notifyError = (message) => {
  toast.error(message, {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: true,
    pauseOnHover: false,
    draggable: true,
    theme: 'colored',
  });
};

// Configuración global de SweetAlert2
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

export const successAlert = async (title, text) => {
  return await Swal.fire({
    icon: 'success',
    title: title || '¡Éxito!',
    text: text || '',
    confirmButtonColor: '#3085d6',
  });
};

export const errorAlert = async (title, text) => {
  return await Swal.fire({
    icon: 'error',
    title: title || 'Error',
    text: text || '',
    confirmButtonColor: '#d33',
  });
};

// Hacer disponibles globalmente
if (typeof window !== 'undefined') {
  window.notifySuccess = notifySuccess;
  window.notifyError = notifyError;
  window.confirmDialog = confirmDialog;
  window.successAlert = successAlert;
  window.errorAlert = errorAlert;
}


