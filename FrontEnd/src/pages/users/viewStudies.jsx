import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/global/AuthProvider';
import {
  getEstudiosByPaciente,
  downloadEstudio as downloadEstudioAPI,
} from '../../api/studies.api';
import { getPacienteDni } from '../../api/patients.api';
import { notifyError } from '../../components/ToastConfig';

function ViewStudies() {
  const { dni } = useAuth();
  const [estudios, setEstudios] = useState([]);
  const [pacienteData, setPacienteData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar patient por DNI
  const loadPaciente = useCallback(async () => {
    console.log('🔍 FRONTEND - loadPaciente: Cargando paciente con DNI:', dni);
    try {
      const response = await getPacienteDni({ dni });
      console.log('✅ FRONTEND - loadPaciente: Respuesta recibida:', response);
      console.log('📊 FRONTEND - loadPaciente: Datos del paciente:', response.data);
      setPacienteData(response.data);
      
      // Usar idPatient en lugar de patientId
      const patientId = response.data.idPatient;
      console.log('🆔 FRONTEND - loadPaciente: patientId obtenido:', patientId);
      return patientId;
    } catch (error) {
      console.error('❌ FRONTEND - Error al cargar datos del patient:', error);
      notifyError('Error al cargar datos del patient');
      return null;
    }
  }, [dni]);

  // Cargar estudios del patient
  const loadEstudios = useCallback(async (patientId) => {
    console.log('📚 FRONTEND - loadEstudios: Cargando estudios para patientId:', patientId);
    try {
      const response = await getEstudiosByPaciente(patientId);
      console.log('✅ FRONTEND - loadEstudios: Respuesta recibida:', response);
      console.log('📊 FRONTEND - loadEstudios: Estudios:', response.data);
      setEstudios(response.data || []);
    } catch (error) {
      console.error('❌ FRONTEND - Error al cargar estudios:', error);
      if (error.response?.status !== 404) {
        notifyError('Error al cargar estudios');
      }
      setEstudios([]);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const patientId = await loadPaciente();
      if (patientId) {
        await loadEstudios(patientId);
      }
      setLoading(false);
    };

    if (dni) {
      fetchData();
    }
  }, [dni, loadPaciente, loadEstudios]);

  const downloadEstudio = async (idEstudio, nombreArchivo) => {
    try {
      const response = await downloadEstudioAPI(idEstudio);

      // Crear enlace de descarga
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', nombreArchivo);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar estudio:', error);
      notifyError('Error al descargar el archivo');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (!dni) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">
            Debe iniciar sesión como patient
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Cargando estudios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Mis estudios médicos
        </h1>

        {pacienteData && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Información del paciente
            </h2>
            <p className="text-gray-600">DNI: {dni}</p>
            <p className="text-gray-600">Nombre: {pacienteData.firstName}</p>
            <p className="text-gray-600">Apellido: {pacienteData.lastName}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Historial de Estudios ({estudios.length})
          </h2>

          {estudios.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">
                No tiene estudios médicos registrados
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Los estudios que le realicen los doctors aparecerán aquí
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Doctor
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Fecha Realización
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Archivo
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Descripción
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Fecha Carga
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(estudios || []).map((estudio) => (
                    <tr
                      key={estudio.idStudy}
                      className="border-t border-gray-200"
                    >
                      <td className="px-4 py-2 text-sm">
                        Dr. {estudio.doctorName}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {formatDate(estudio.performanceDate)}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span className="text-blue-600 font-medium">
                          {estudio.fileName}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {estudio.description || 'Sin descripción'}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {formatDate(estudio.uploadDate)}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <button
                          onClick={() =>
                            downloadEstudio(
                              estudio.idStudy,
                              estudio.fileName
                            )
                          }
                          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm"
                        >
                          Descargar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewStudies;



