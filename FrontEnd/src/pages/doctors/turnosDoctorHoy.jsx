/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDoctores } from "../../context/doctores/DoctoresProvider.jsx";
import { useAuth } from "../../context/global/AuthProvider";
import "../../estilos/home.css";
import "../../estilos/sacarturno.css";
import "../../estilos/verTurnos.css";

export function TurnosDoctorHoy() {
  const { turnosHoy, TurnosHoy } = useDoctores();
  const { comprobarToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    comprobarToken("D");
    TurnosHoy();
  }, []);

  const formatFechaHora = (fechaYHora) => {
    const opciones = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };
    return new Date(fechaYHora).toLocaleString("es-ES", opciones);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-bold text-blue-800 text-center">
          Turnos de Hoy
        </h1>
        <div className="space-y-4">
          {turnosHoy.length > 0 ? (
            turnosHoy.map((turno, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 shadow-sm mb-4"
              >
                <p>
                  <strong>Sede:</strong> {turno.sede}
                </p>
                <p>
                  <strong>Especialidad:</strong> {turno.especialidad}
                </p>
                <p>
                  <strong>Fecha y Hora:</strong>{" "}
                  {formatFechaHora(turno.fechaYHora)}
                </p>
                <p>
                  <strong>Estado:</strong> {turno.estado}
                </p>
                <p>
                  <strong>DNI Paciente:</strong> {turno.dni}
                </p>
                <p>
                  <strong>Apellido y Nombre:</strong> {turno.nomyapel}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">
              No hay turnos para mostrar
            </p>
          )}
        </div>
        <button
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          onClick={() => navigate("/doctor")}
        >
          Volver
        </button>
      </div>
    </div>
  );
}
