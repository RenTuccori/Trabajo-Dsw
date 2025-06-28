import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePacientes } from '../../context/paciente/PacientesProvider.jsx';

export function ConfirmacionTurno() {
  const navigate = useNavigate();
  const {
    nombreEspecialidad,
    nombreDoctor,
    apellidoDoctor,
    nombreSede,
    direccionSede,
    fechaYHora,
    CrearTurno,
    ObtenerDoctorId,
    ObtenerEspecialidadId,
    ObtenerSedeId,
    mailUsuario,
    ObtenerUsuarioDni,
    MandarMail,
  } = usePacientes();

  const [turnoCreado, setTurnoCreado] = useState(false); // Estado para saber si el turno fue creado

  useEffect(() => {
    const confirmarTurno = async () => {
      try {
        // Asegurarse de que todas las funciones asincrónicas se completen antes de continuar
        await ObtenerUsuarioDni();
        
        console.log('🔍 Estado antes de obtener doctor, especialidad y sede:', {
          nombreDoctor,
          apellidoDoctor,
          nombreEspecialidad,
          nombreSede
        });
        
        await ObtenerDoctorId();
        await ObtenerEspecialidadId();
        await ObtenerSedeId();

        console.log('🔍 Estado después de obtener doctor, especialidad y sede:', {
          nombreDoctor,
          apellidoDoctor,
          nombreEspecialidad,
          nombreSede
        });

        // Crear turno
        await CrearTurno();
        setTurnoCreado(true);
      } catch (error) {
        console.error('Error al crear el turno:', error);
      }
    };

    confirmarTurno();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (turnoCreado && mailUsuario) {
      // Construir el cuerpo del correo como string HTML
      const cuerpo = `
            <div style="background-color: #f0f4f8; padding: 20px; border-radius: 10px; font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                <h1 style="color: #1c4e80; text-align: center;">¡Tu turno ha sido creado con éxito!</h1>
                <div style="background-color: #ffffff; padding: 20px; border-radius: 8px;">
                    <p><strong>Fecha y Hora:</strong> ${fechaYHora}</p>
                    <p><strong>Especialidad:</strong> ${nombreEspecialidad}</p>
                    <p><strong>Doctor:</strong> ${nombreDoctor} ${apellidoDoctor}</p>
                    <p><strong>Sede:</strong> ${nombreSede}, ${direccionSede}</p>
                </div>
                <footer style="text-align: center;">
                    <p>Nos vemos pronto, ¡gracias por confiar en nosotros!</p>
                    <p>Sanatorio UTN</p>
                </footer>
            </div>`;

      // Llamar a la función para mandar el correo
      MandarMail({
        to: mailUsuario, // Asegúrate de pasar el destinatario como tal
        subject: 'Turno Creado',
        html: cuerpo,
      });
    }
  }, [turnoCreado, mailUsuario]); // Este efecto se ejecuta solo cuando `mailUsuario` y `turnoCreado` están listos

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-bold text-blue-800 text-center">
          Turno creado
        </h1>
        <p className="text-gray-700">
          <strong>Fecha y Hora:</strong> {fechaYHora}
        </p>
        <p className="text-gray-700">
          <strong>Especialidad:</strong> {nombreEspecialidad}
        </p>
        <p className="text-gray-700">
          <strong>Doctor:</strong> {nombreDoctor} {apellidoDoctor}
        </p>
        <p className="text-gray-700">
          <strong>Sede:</strong> {nombreSede}, {direccionSede}
        </p>
        <p className="text-gray-700">
          <strong>Estado:</strong> Pendiente
        </p>

        {/* Aviso sobre el correo electrónico */}
        <p className="text-sm text-gray-600 text-center mt-4">
          Si no recibiste el correo de confirmación, por favor verifica tu
          dirección de correo en la sección de <strong>Datos Personales</strong>{' '}
          y asegúrate de que sea correcta.
        </p>
      </div>

      <button
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        onClick={() => navigate('/paciente')}
      >
        Volver
      </button>
    </div>
  );
}
