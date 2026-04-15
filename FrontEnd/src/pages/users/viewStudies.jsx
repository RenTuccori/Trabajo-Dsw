import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/global/AuthProvider';
import {
  getStudiesByPatient,
  downloadStudy as downloadStudyAPI,
} from '../../api/studies.api';
import { getPatientbyNationalId } from '../../api/patients.api';
import { notifyError } from '../../components/ToastConfig';

function ViewStudies() {
  const { nationalId } = useAuth();
  const [studies, setStudies] = useState([]);
  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar patient por DNI
  const loadPatientInfo = useCallback(async () => {
    console.log('🔍 FRONTEND - loadPatientInfo: Cargando paciente con DNI:', nationalId);
    try {
      const response = await getPatientbyNationalId({ nationalId: dni });
      if (!response || !response.data) {
        console.error('❌ FRONTEND - loadPatientInfo: Respuesta inválida del backend:', response);
        return null;
      }
      console.log('✅ FRONTEND - loadPatientInfo: Respuesta recibida:', response);
      console.log('📊 FRONTEND - loadPatientInfo: Datos del paciente:', response.data);
      const patientData = response?.data || {};
      const userData = patientData.user || {};

      setPatientInfo({
        ...patientData,
        firstName: patientData.firstName || userData.firstName || '',
        lastName: patientData.lastName || userData.lastName || '',
      });
      
      const patientId = patientData.id || patientData.idPatient || patientData.patientId;
      console.log('🆔 FRONTEND - loadPatientInfo: patientId obtenido:', patientId);
      return patientId;
    } catch (error) {
      console.error('❌ FRONTEND - Error al cargar datos del patient:', error);
      notifyError('Error al cargar datos del patient');
      return null;
    }
  }, [dni]);

  // Cargar estudios del patient
  const loadStudies = useCallback(async (patientId) => {
    console.log('📚 FRONTEND - loadStudies: Cargando estudios para patientId:', patientId);
    try {
      const response = await getStudiesByPatient(patientId);
      console.log('✅ FRONTEND - loadStudies: Respuesta recibida:', response);
      console.log('📊 FRONTEND - loadStudies: Estudios:', response.data);
      setStudies(response.data || []);
    } catch (error) {
      console.error('❌ FRONTEND - Error al cargar estudios:', error);
      if (error.response?.status !== 404) {
        notifyError('Error al cargar estudios');
      }
      setStudies([]);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const patientId = await loadPatientInfo();
      if (patientId) {
        await loadStudies(patientId);
      }
      setLoading(false);
    };

    if (nationalId) {
      fetchData();
    }
  }, [nationalId, loadPatientInfo, loadStudies]);

  const downloadStudy = async (studyId, fileName) => {
    try {
      const response = await downloadStudyAPI(studyId);

      // Crear enlace de descarga
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
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

  if (!nationalId) {
    return (
      <div className="min-h-[calc(100vh-88px)] bg-gradient-to-b from-blue-100 to-white flex items-center justify-center">
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
      <div className="min-h-[calc(100vh-88px)] bg-gradient-to-b from-blue-100 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Cargando studies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-88px)] bg-gradient-to-b from-blue-100 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Mis estudios médicos
        </h1>

        {patientInfo && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Información del paciente
            </h2>
            <p className="text-gray-600">DNI: {nationalId}</p>
            <p className="text-gray-600">Nombre: {patientInfo.firstName}</p>
            <p className="text-gray-600">Apellido: {patientInfo.lastName}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Historial de Estudios ({studies.length})
          </h2>

          {studies.length === 0 ? (
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
                  {(studies || []).map((study) => {
                    const studyId = study.studyId ?? study.idStudy ?? study.id;
                    const performanceDate = study.performanceDate ?? study.performanceDate;
                    const uploadDate = study.uploadDate ?? study.uploadDate;
                    const fileName = study.fileName ?? study.fileName;
                    const description = study.description ?? study.description;

                    return (
                    <tr
                      key={studyId}
                      className="border-t border-gray-200"
                    >
                      <td className="px-4 py-2 text-sm">
                        Dr. {study.doctorName || '-'}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {formatDate(performanceDate)}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span className="text-blue-600 font-medium">
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
                            downloadStudy(
                              studyId,
                              fileName || 'estudio'
                            )
                          }
                          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm"
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



