import nodemailer from 'nodemailer';
import { Turno, Doctor, Paciente, Usuario, Especialidad, Sede } from '../models/index.js';

const dbEmailPass = process.env.DB_EMAILPASS;

// Configuración del transporte de nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: 'utnsanatorio@gmail.com',
    pass: dbEmailPass,
  },
});

// Función genérica para enviar correo
export const sendEmail = async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    // En desarrollo, solo simular el envío si no hay configuración de email
    if (!dbEmailPass || dbEmailPass === 'dev_password') {
      console.log('📧 Email simulado (modo desarrollo):', { to, subject });
      return res.json({ 
        success: true, 
        message: 'Email simulado en modo desarrollo',
        messageId: 'dev-' + Date.now()
      });
    }

    const mailOptions = {
      from: 'Sanatorio UTN <utnsanatorio@gmail.com>',
      to: to,
      subject: subject,
      html: html,
    };

    let info = await transporter.sendMail(mailOptions);

    res.json({ 
      message: 'Correo enviado correctamente', 
      messageId: info.messageId 
    });
  } catch (error) {
    console.error('Error enviando email:', error);
    res.status(500).json({ 
      message: 'Error al enviar el correo', 
      error: error.message 
    });
  }
};

// Función específica para enviar confirmación de turno
export const sendTurnoConfirmation = async (req, res) => {
  try {
    const { idTurno } = req.body;

    // Obtener información completa del turno
    const turno = await Turno.findByPk(idTurno, {
      include: [{
        model: Doctor,
        as: 'doctor',
        include: [{
          model: Usuario,
          as: 'usuario'
        }]
      }, {
        model: Paciente,
        as: 'paciente',
        include: [{
          model: Usuario,
          as: 'usuario'
        }]
      }, {
        model: Especialidad,
        as: 'especialidad'
      }, {
        model: Sede,
        as: 'sede'
      }]
    });

    if (!turno || !turno.paciente || !turno.paciente.usuario.email) {
      return res.status(404).json({ 
        message: 'Turno no encontrado o paciente sin email' 
      });
    }

    const fechaFormatted = new Date(turno.fechaYHora).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const horaFormatted = new Date(turno.fechaYHora).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2c5aa0; color: white; padding: 20px; text-align: center;">
          <h1>Confirmación de Turno</h1>
          <h2>Sanatorio UTN</h2>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h3>Estimado/a ${turno.paciente.usuario.nombre} ${turno.paciente.usuario.apellido},</h3>
          
          <p>Su turno ha sido confirmado exitosamente. A continuación los detalles:</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #2c5aa0; margin-top: 0;">Detalles del Turno</h4>
            <p><strong>Fecha:</strong> ${fechaFormatted}</p>
            <p><strong>Hora:</strong> ${horaFormatted}</p>
            <p><strong>Doctor:</strong> Dr. ${turno.doctor.usuario.nombre} ${turno.doctor.usuario.apellido}</p>
            <p><strong>Especialidad:</strong> ${turno.especialidad.nombre}</p>
            <p><strong>Sede:</strong> ${turno.sede.nombre}</p>
            <p><strong>Dirección:</strong> ${turno.sede.direccion}</p>
          </div>
          
          <div style="background-color: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #2c5aa0; margin-top: 0;">Recordatorios Importantes</h4>
            <ul>
              <li>Llegue 15 minutos antes de su cita</li>
              <li>Traiga su documento de identidad</li>
              <li>Traiga su tarjeta de obra social (si corresponde)</li>
              <li>Si necesita cancelar, hágalo con al menos 24 horas de anticipación</li>
            </ul>
          </div>
          
          <p>Si tiene alguna consulta, no dude en contactarnos.</p>
          <p>¡Esperamos verle pronto!</p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 12px;">
              Este es un mensaje automático, por favor no responda a este correo.
            </p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: 'Sanatorio UTN <utnsanatorio@gmail.com>',
      to: turno.paciente.usuario.email,
      subject: `Confirmación de Turno - ${fechaFormatted} ${horaFormatted}`,
      html: htmlContent,
    };

    let info = await transporter.sendMail(mailOptions);

    res.json({ 
      message: 'Email de confirmación enviado correctamente',
      messageId: info.messageId 
    });
  } catch (error) {
    console.error('Error enviando confirmación de turno:', error);
    res.status(500).json({ 
      message: 'Error al enviar la confirmación', 
      error: error.message 
    });
  }
};

// Función para enviar recordatorio de turno
export const sendTurnoReminder = async (req, res) => {
  try {
    const { idTurno } = req.body;

    const turno = await Turno.findByPk(idTurno, {
      include: [{
        model: Doctor,
        as: 'doctor',
        include: [{
          model: Usuario,
          as: 'usuario'
        }]
      }, {
        model: Paciente,
        as: 'paciente',
        include: [{
          model: Usuario,
          as: 'usuario'
        }]
      }, {
        model: Especialidad,
        as: 'especialidad'
      }, {
        model: Sede,
        as: 'sede'
      }]
    });

    if (!turno || !turno.paciente || !turno.paciente.usuario.email) {
      return res.status(404).json({ 
        message: 'Turno no encontrado o paciente sin email' 
      });
    }

    const fechaFormatted = new Date(turno.fechaYHora).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const horaFormatted = new Date(turno.fechaYHora).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #ff9800; color: white; padding: 20px; text-align: center;">
          <h1>Recordatorio de Turno</h1>
          <h2>Sanatorio UTN</h2>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h3>Estimado/a ${turno.paciente.usuario.nombre} ${turno.paciente.usuario.apellido},</h3>
          
          <p>Le recordamos que tiene un turno programado para mañana:</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #ff9800; margin-top: 0;">Detalles del Turno</h4>
            <p><strong>Fecha:</strong> ${fechaFormatted}</p>
            <p><strong>Hora:</strong> ${horaFormatted}</p>
            <p><strong>Doctor:</strong> Dr. ${turno.doctor.usuario.nombre} ${turno.doctor.usuario.apellido}</p>
            <p><strong>Especialidad:</strong> ${turno.especialidad.nombre}</p>
            <p><strong>Sede:</strong> ${turno.sede.nombre}</p>
            <p><strong>Dirección:</strong> ${turno.sede.direccion}</p>
          </div>
          
          <div style="background-color: #fff3e0; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #ff9800; margin-top: 0;">No olvide</h4>
            <ul>
              <li>Llegar 15 minutos antes</li>
              <li>Traer documento de identidad</li>
              <li>Traer tarjeta de obra social</li>
            </ul>
          </div>
          
          <p>¡Nos vemos mañana!</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: 'Sanatorio UTN <utnsanatorio@gmail.com>',
      to: turno.paciente.usuario.email,
      subject: `Recordatorio: Turno mañana ${fechaFormatted} ${horaFormatted}`,
      html: htmlContent,
    };

    let info = await transporter.sendMail(mailOptions);

    res.json({ 
      message: 'Recordatorio enviado correctamente',
      messageId: info.messageId 
    });
  } catch (error) {
    console.error('Error enviando recordatorio:', error);
    res.status(500).json({ 
      message: 'Error al enviar el recordatorio', 
      error: error.message 
    });
  }
};

// Función para enviar notificación de cancelación
export const sendTurnoCancelation = async (req, res) => {
  try {
    const { idTurno, motivo } = req.body;

    const turno = await Turno.findByPk(idTurno, {
      include: [{
        model: Paciente,
        as: 'paciente',
        include: [{
          model: Usuario,
          as: 'usuario'
        }]
      }, {
        model: Doctor,
        as: 'doctor',
        include: [{
          model: Usuario,
          as: 'usuario'
        }]
      }, {
        model: Especialidad,
        as: 'especialidad'
      }]
    });

    if (!turno || !turno.paciente || !turno.paciente.usuario.email) {
      return res.status(404).json({ 
        message: 'Turno no encontrado o paciente sin email' 
      });
    }

    const fechaFormatted = new Date(turno.fechaYHora).toLocaleDateString('es-ES');
    const horaFormatted = new Date(turno.fechaYHora).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f44336; color: white; padding: 20px; text-align: center;">
          <h1>Turno Cancelado</h1>
          <h2>Sanatorio UTN</h2>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h3>Estimado/a ${turno.paciente.usuario.nombre} ${turno.paciente.usuario.apellido},</h3>
          
          <p>Lamentamos informarle que su turno ha sido cancelado:</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #f44336; margin-top: 0;">Turno Cancelado</h4>
            <p><strong>Fecha:</strong> ${fechaFormatted}</p>
            <p><strong>Hora:</strong> ${horaFormatted}</p>
            <p><strong>Doctor:</strong> Dr. ${turno.doctor.usuario.nombre} ${turno.doctor.usuario.apellido}</p>
            <p><strong>Especialidad:</strong> ${turno.especialidad.nombre}</p>
            ${motivo ? `<p><strong>Motivo:</strong> ${motivo}</p>` : ''}
          </div>
          
          <p>Para reagendar su turno, puede contactarnos o usar nuestro sistema en línea.</p>
          <p>Disculpe las molestias ocasionadas.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: 'Sanatorio UTN <utnsanatorio@gmail.com>',
      to: turno.paciente.usuario.email,
      subject: `Turno Cancelado - ${fechaFormatted} ${horaFormatted}`,
      html: htmlContent,
    };

    let info = await transporter.sendMail(mailOptions);

    res.json({ 
      message: 'Notificación de cancelación enviada correctamente',
      messageId: info.messageId 
    });
  } catch (error) {
    console.error('Error enviando cancelación:', error);
    res.status(500).json({ 
      message: 'Error al enviar la notificación de cancelación', 
      error: error.message 
    });
  }
};
