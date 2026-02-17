// src/components/SwalConfig.jsx
import Swal from 'sweetalert2';

// Configuration for confirming actions
export const confirmDialog = async (title, text) => {
  return await Swal.fire({
    title: title || 'Are you sure?',
    text: text || 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, confirm',
    cancelButtonText: 'Cancel',
  });
};

// Configuration for showing success alerts
export const successAlert = async (title, text) => {
  return await Swal.fire({
    icon: 'success',
    title: title || 'Success!',
    text: text || '',
    confirmButtonColor: '#3085d6',
  });
};

// Configuration for showing error alerts
export const errorAlert = async (title, text) => {
  return await Swal.fire({
    icon: 'error',
    title: title || 'Error',
    text: text || '',
    confirmButtonColor: '#d33',
  });
};
