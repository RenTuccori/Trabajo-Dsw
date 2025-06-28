import nodemailer from 'nodemailer';
const dbEmailPass = process.env.DB_EMAILPASS;
// Configuración del transporte de nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Cambia esto por tu servicio de correo (e.g., Gmail, SendGrid, etc.)
  port: 465, // Cambia según tu servicio (e.g., 587 para TLS, 465 para SSL)
  secure: true, // true para port 465, false para otros puertos
  auth: {
    user: 'utnsanatorio@gmail.com', // Tu correo
    pass: dbEmailPass, // Tu contraseña
  },
});

// Función para enviar correo
export const sendEmail = async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    const mailOptions = {
      from: 'Sanatorio UTN', // El correo desde el cual se envía
      to: to, // Correo destino
      subject: subject, // Asunto del correo
      html: html, // Texto del correo
    };

    // Enviar el correo
    let info = await transporter.sendMail(mailOptions);

    res.json({ message: 'Correo enviado correctamente', info });
  } catch (error) {
    res.status(500).json({ message: 'Error al enviar el correo', error: error.message });
  }
};
