import axiosInstance from './axiosInstance';

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await axiosInstance.post(`/api/send-email`, {
      to, subject, html
    });
    return response.data;
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw error;
  }
};
