import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/global/AuthProvider';
import {
  getStudiesByPatient,
  downloadStudy as downloadEstudioAPI,
} from '../../api/studies.api';
import { getPatientbyNationalId } from '../../api/patients.api';
import { notifyError } from '../../components/ToastConfig';
import { Spinner } from '../../components/Spinner';

function ViewStudies() {
  const { dni } = useAuth();
  const navigate = useNavigate();
  const [estudios, setEstudios] = useState([]);
  const [pacienteData, setPacienteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

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
    if (downloadingId) return;
    setDownloadingId(idEstudio);
    try {
      const response = await downloadEstudioAPI(idEstudio);

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
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (!dni || loading) {
    return <Spinner text="Cargando estudios..." />;
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
            <div className="grid gap-4 md:grid-cols-2">
              {(estudios || []).map((estudio) => {
                const studyId = estudio.idEstudio ?? estudio.idStudy ?? estudio.id;
                const performanceDate = estudio.fechaRealizacion ?? estudio.performanceDate;
                const uploadDate = estudio.fechaCarga ?? estudio.uploadDate;
                const fileName = estudio.nombreArchivo ?? estudio.fileName;
                const description = estudio.descripcion ?? estudio.description;

                return (
                  <article
                    key={studyId}
                    className="glass-list-item flex h-full flex-col gap-4"
                  >
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-brand-700">
                        Dr. {estudio.doctorName || '-'}
                      </p>
                      <h3 className="mt-2 break-words text-base font-semibold text-gray-900">
                        {fileName || 'Archivo sin nombre'}
                      </h3>
                    </div>

                    <div className="grid gap-3 text-sm sm:grid-cols-2">
                      <div>
                        <p className="label mb-1">Fecha realizacion</p>
                        <p className="text-gray-700">{formatDate(performanceDate)}</p>
                      </div>
                      <div>
                        <p className="label mb-1">Fecha carga</p>
                        <p className="text-gray-700">{formatDate(uploadDate)}</p>
                      </div>
                    </div>

                    <div className="flex-1">
                      <p className="label mb-1">Descripcion</p>
                      <p className="break-words text-sm leading-6 text-gray-700">
                        {description || 'Sin descripcion'}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        downloadEstudio(
                          studyId,
                          fileName || 'estudio'
                        )
                      }
                      disabled={downloadingId === studyId}
                      className="btn-primary mt-auto text-sm disabled:opacity-50"
                    >
                      {downloadingId === studyId ? 'Descargando...' : 'Descargar'}
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/patient')}
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



