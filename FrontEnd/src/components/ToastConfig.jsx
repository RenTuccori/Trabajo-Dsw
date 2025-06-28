// src/components/ToastConfig.jsx
import { toast } from 'react-toastify';

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
