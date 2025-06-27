import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePacientes } from "../../context/paciente/PacientesProvider.jsx";
import { confirmDialog } from "../../components/SwalConfig.jsx";
import { notifyError, notifySuccess } from "../../components/ToastConfig.jsx";
import { useAuth } from "../../context/global/AuthProvider.jsx";

export function TurnosPaciente() {
  const navigate = useNavigate();
  const {
    ObtenerTurnosPaciente,
    ConfirmarTurno,
    CancelarTurno,
    turnos,
    MandarMail,
    mailUsuario,
    ObtenerUsuarioDni,
  } = usePacientes();
  const {
    comprobarToken
  } = useAuth();
  useEffect(() => {
    comprobarToken("P");
    ObtenerUsuarioDni();
    ObtenerTurnosPaciente();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirmarTurno = async (turno) => {
    const result = await confirmDialog(
      "Confirmar Turno",
      "¿Estás seguro que deseas confirmar este turno?"
    );

    if (result.isConfirmed) {
      try {
        await ConfirmarTurno({ idTurno: turno.idTurno });
        notifySuccess("¡Turno confirmado con éxito!"); // Mensaje de éxito
        const cuerpo = `<div style="background-color: #f0f4f8; padding: 20px; border-radius: 10px; font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                    <h1 style="color: #1c4e80; text-align: center;">¡Tu turno ha sido confirmado con éxito!</h1>
                    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin-top: 20px;">
                        <p><strong>Sede:</strong> ${turno.Sede}</p>
                        <p><strong>Dirección:</strong> ${turno.Direccion}</p>
                        <p><strong>Especialidad:</strong> ${
                          turno.Especialidad
                        }</p>
                        <p><strong>Fecha y Hora:</strong> ${formatFechaHora(
                          turno.fecha_hora
                        )}</p>
                        <p><strong>Doctor:</strong> ${turno.Doctor}</p>
                        <p><strong>DNI Paciente:</strong> ${turno.dni}</p>
                    </div>
                    <footer style="text-align: center; margin-top: 20px;">
                        <p>Nos vemos pronto, ¡gracias por confiar en nosotros!</p>
                        <p>Sanatorio UTN</p>
                    </footer>
                    </div>
                    `;

        // Llamar a la función para mandar el correo
        MandarMail({
          to: mailUsuario, // Asegúrate de pasar el destinatario como tal
          subject: "Turno Confirmado",
          html: cuerpo,
        });
      } catch (error) {
        notifyError("Error al confirmar el turno"); // Mensaje de error
        console.error("Error al confirmar turno:", error);
      }
    }
  };

  const handleCancelarTurno = async (turno) => {
    const result = await confirmDialog(
      "Cancelar Turno",
      "¿Estás seguro que deseas cancelar este turno?"
    );

    if (result.isConfirmed) {
      try {
        await CancelarTurno({ idTurno: turno.idTurno });
        notifySuccess("¡Turno cancelado con éxito!"); // Mensaje de éxito
        const cuerpo = `<div style="background-color: #f0f4f8; padding: 20px; border-radius: 10px; font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                <h1 style="color: #1c4e80; text-align: center;">¡Tu turno ha sido cancelado con éxito!</h1>
                <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin-top: 20px;">
                    <p><strong>Sede:</strong> ${turno.Sede}</p>
                    <p><strong>Dirección:</strong> ${turno.Direccion}</p>
                    <p><strong>Especialidad:</strong> ${turno.Especialidad}</p>
                    <p><strong>Fecha y Hora:</strong> ${formatFechaHora(
                      turno.fecha_hora
                    )}</p>
                    <p><strong>Doctor:</strong> ${turno.Doctor}</p>
                    <p><strong>DNI Paciente:</strong> ${turno.dni}</p>
                </div>
                <footer style="text-align: center; margin-top: 20px;">
                    <p>Nos vemos pronto, ¡gracias por confiar en nosotros!</p>
                    <p>Sanatorio UTN</p>
                </footer>
                </div>
                `;

        // Llamar a la función para mandar el correo
        MandarMail({
          to: mailUsuario, // Asegúrate de pasar el destinatario como tal
          subject: "Turno Cancelado",
          html: cuerpo,
        });
      } catch (error) {
        notifyError("Error al cancelar el turno"); // Mensaje de error
        console.error("Error al cancelar turno:", error);
      }
    }
  };

  const formatFechaHora = (fechaHora) => {
    const date = new Date(fechaHora);
    const opcionesFecha = { year: "numeric", month: "long", day: "numeric" };
    const opcionesHora = { hour: "2-digit", minute: "2-digit" };

    const fecha = date.toLocaleDateString("es-ES", opcionesFecha);
    const hora = date.toLocaleTimeString("es-ES", opcionesHora);

    return `${fecha} a las ${hora}`; // Retorna la fecha y hora en un solo string
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <button
          onClick={() => navigate("/paciente")}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Volver
        </button>
        {turnos && turnos.length > 0 ? (
          turnos.map((turno, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 shadow-sm mb-4"
            >
              <p>
                <strong>Sede:</strong> {turno.Sede}
              </p>
              <p>
                <strong>Dirección:</strong> {turno.Direccion}
              </p>
              <p>
                <strong>Especialidad:</strong> {turno.Especialidad}
              </p>
              <p>
                <strong>Fecha y Hora:</strong>{" "}
                {formatFechaHora(turno.fecha_hora)}
              </p>
              <p>
                <strong>Doctor:</strong> {turno.Doctor}
              </p>
              <p>
                <strong>DNI Paciente:</strong> {turno.dni}
              </p>
              <p>
                <strong>Estado:</strong> {turno.estado}
              </p>
              <div className="flex space-x-2 mt-4">
                <button
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  onClick={() => handleConfirmarTurno(turno)}
                  disabled={
                    turno.estado === "Confirmado" ||
                    turno.estado === "Cancelado"
                  }
                >
                  Confirmar
                </button>
                <button
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  onClick={() => handleCancelarTurno(turno)}
                  disabled={
                    turno.estado === "Cancelado" ||
                    turno.estado === "Confirmado"
                  }
                >
                  Cancelar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">
            No hay turnos para mostrar
          </p>
        )}
      </div>
    </div>
  );
}
