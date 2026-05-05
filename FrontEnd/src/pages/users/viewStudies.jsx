import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/global/AuthProvider';
import {
  getStudiesByPatient,
  downloadStudy as downloadEstudioAPI,
} from '../../api/studies.api';
import { getPatientbyNationalId } from '../../api/patients.api';
import { notifyError } from '../../components/ToastConfig';

function ViewStudies() {
  const { dni } = useAuth();
  const [estudios, setEstudios] = useState([]);
  const [pacienteData, setPacienteData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar patient por DNI
  const loadPaciente = useCallback(async () => {
    try {
      const response = await getPatientbyNationalId({ nationalId: dni });
      if (!response || !response.data) {
        console.error('❌ FRONTEND - loadPaciente: Respuesta inválida del backend:', response);
        return null;
      }
      const patientData = response?.data || {};
      const userData = patientData.user || {};

      setPacienteData({
        ...patientData,
        firstName: patientData.firstName || userData.firstName || '',
        lastName: patientData.lastName || userData.lastName || '',
      });
      
      const patientId = patientData.id || patientData.idPatient || patientData.patientId;
      return patientId;
    } catch (error) {
      console.error('❌ FRONTEND - Error al cargar datos del patient:', error);
      notifyError('Error al cargar datos del patient');
      return null;
    }
  }, [dni]);

  // Cargar estudios del patient
  const loadEstudios = useCallback(async (patientId) => {
    try {
      const response = await getStudiesByPatient(patientId);
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
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (!dni) {
    return (
      <div className="page-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Cargando estudios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-bg p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
          Mis estudios médicos
        </h1>

        {pacienteData && (
          <div className="glass-solid rounded-2xl p-5 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Información del paciente
            </h2>
            <p className="text-gray-600">DNI: {dni}</p>
            <p className="text-gray-600">Nombre: {pacienteData.firstName}</p>
            <p className="text-gray-600">Apellido: {pacienteData.lastName}</p>
          </div>
        )}

        <div className="glass-solid rounded-2xl p-6">
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
                  <tr className="bg-brand-50/50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-brand-700">
                      Doctor
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-brand-700">
                      Fecha Realización
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-brand-700">
                      Archivo
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-brand-700">
                      Descripción
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-brand-700">
                      Fecha Carga
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-brand-700">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(estudios || []).map((estudio) => {
                    const studyId = estudio.idEstudio ?? estudio.idStudy ?? estudio.id;
                    const performanceDate = estudio.fechaRealizacion ?? estudio.performanceDate;
                    const uploadDate = estudio.fechaCarga ?? estudio.uploadDate;
                    const fileName = estudio.nombreArchivo ?? estudio.fileName;
                    const description = estudio.descripcion ?? estudio.description;

                    return (
                    <tr
                      key={studyId}
                      className="border-t border-gray-200"
                    >
                      <td className="px-4 py-2 text-sm">
                        Dr. {estudio.doctorName || '-'}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {formatDate(performanceDate)}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span className="text-brand-600 font-medium">
                          {fileName || 'Archivo sin nombre'}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {description || 'Sin descripción'}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {formatDate(uploadDate)}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <button
                          onClick={() =>
                            downloadEstudio(
                              studyId,
                              fileName || 'estudio'
                            )
                          }
                          className="btn-primary text-sm"
                        >
                          Descargar
                        </button>
                      </td>
                    </tr>
                  );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => window.history.back()}
            className="btn-ghost"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewStudies;



