import axios from 'axios';

const dbUrl = import.meta.env.VITE_DB_URL;

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await axios.post(`http://${dbUrl}/api/send-email`, {
      to, subject, html
    });
    return response.data;
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw error;
  }
};
