import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  notifySuccess,
  notifyError,
  confirmDialog,
  successAlert,
  errorAlert,
} from '../utils/notifications.js';

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock sweetalert2
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

describe('Notification Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Toast Notifications', () => {
    it('should call toast.success with correct message and config', () => {
      const message = 'Operación exitosa';

      notifySuccess(message);

      expect(toast.success).toHaveBeenCalledWith(message, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        pauseOnHover: false,
        draggable: true,
        theme: 'colored',
      });
    });

    it('should call toast.error with correct message and config', () => {
      const message = 'Error en la operación';

      notifyError(message);

      expect(toast.error).toHaveBeenCalledWith(message, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        pauseOnHover: false,
        draggable: true,
        theme: 'colored',
      });
    });
  });

  describe('SweetAlert2 Dialogs', () => {
    it('should call Swal.fire for confirm dialog with default values', async () => {
      Swal.fire.mockResolvedValue({ isConfirmed: true });

      await confirmDialog();

      expect(Swal.fire).toHaveBeenCalledWith({
        title: '¿Está seguro?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar',
      });
    });

    it('should call Swal.fire for confirm dialog with custom values', async () => {
      const customTitle = 'Eliminar usuario';
      const customText = '¿Está seguro de eliminar este usuario?';

      await confirmDialog(customTitle, customText);

      expect(Swal.fire).toHaveBeenCalledWith({
        title: customTitle,
        text: customText,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar',
      });
    });

    it('should call Swal.fire for success alert', async () => {
      const title = 'Usuario creado';
      const text = 'El usuario se creó correctamente';

      await successAlert(title, text);

      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'success',
        title: title,
        text: text,
        confirmButtonColor: '#3085d6',
      });
    });

    it('should call Swal.fire for error alert with default values', async () => {
      await errorAlert();

      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Error',
        text: '',
        confirmButtonColor: '#d33',
      });
    });
  });

  describe('Return Values', () => {
    it('should return the result from confirmDialog', async () => {
      const mockResult = { isConfirmed: true, value: true };
      Swal.fire.mockResolvedValue(mockResult);

      const result = await confirmDialog('Test', 'Test message');

      expect(result).toEqual(mockResult);
    });

    it('should return the result from successAlert', async () => {
      const mockResult = { isConfirmed: true };
      Swal.fire.mockResolvedValue(mockResult);

      const result = await successAlert('Success', 'It worked!');

      expect(result).toEqual(mockResult);
    });
  });
});
