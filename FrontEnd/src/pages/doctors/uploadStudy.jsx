import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/global/AuthProvider';
import { useNavigate } from 'react-router-dom';
import {
  uploadStudy,
  getStudiesByDoctor,
  downloadStudy as downloadEstudioAPI,
} from '../../api/studies.api';
import { getPatients } from '../../api/patients.api';

function UploadStudy() {
  const { doctorId } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientId: '',
    fechaRealizacion: '',
    descripcion: '',
    file: null,
  });
  const [patients, setPacientes] = useState([]);
  const [searchDni, setSearchDni] = useState('');
  const [patientFound, setPatientFound] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [estudios, setEstudios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showEstudios, setShowEstudios] = useState(false);

  // Cargar patients al montar el componente
  useEffect(() => {
    const initializeData = async () => {
      setInitialLoading(true);
      await loadPacientes();
      setInitialLoading(false);
    };
    initializeData();
  }, []);

  const loadEstudios = useCallback(async () => {
    try {
      const response = await getStudiesByDoctor(doctorId);
      setEstudios(response.data || []);
    } catch (error) {
      console.error('Error al cargar estudios:', error);
      setEstudios([]); // Asegurar que estudios esté definido
    }
  }, [doctorId]);

  // Cargar estudios cuando cambie el doctorId
  useEffect(() => {
    if (doctorId) {
      loadEstudios();
    }
  }, [doctorId, loadEstudios]);

  const loadPacientes = async () => {
    try {
      const response = await getPatients();
      setPacientes(response.data || []);
    } catch (error) {
      console.error('Error al cargar patients:', error);
      window.notifyError('Error al cargar la lista de patients');
      setPacientes([]); // Asegurar que patients esté definido
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
  };

  const handleSearchPatient = () => {
    setSearchError('');
    if (!searchDni.trim()) {
      setSearchError('Por favor ingrese un DNI válido.');
      setPatientFound(null);
      setFormData((prev) => ({ ...prev, patientId: '' }));
      return;
    }

    const found = patients.find(
      (p) => String(p.nationalId) === searchDni || String(p.dni) === searchDni
    );

    if (found) {
      setPatientFound(found);
      setFormData((prev) => ({ ...prev, patientId: found.patientId }));
      setSearchError('');
    } else {
      setPatientFound(null);
      setFormData((prev) => ({ ...prev, patientId: '' }));
      setSearchError('No se encontró ningún paciente con ese DNI.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.file) {
      window.notifyError('Por favor seleccione un archivo');
      return;
    }

    if (!formData.patientId) {
      window.notifyError('Por favor busque y seleccione un paciente primero utilizando su DNI');
      return;
    }

    if (!formData.fechaRealizacion) {
      window.notifyError('Por favor complete la fecha de realización');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('file', formData.file);
      data.append('patientId', formData.patientId);
      // Backend expects 'performanceDate' and 'description'
      data.append('performanceDate', formData.fechaRealizacion);
      data.append('description', formData.descripcion);

      await uploadStudy(data);

      window.notifySuccess('Estudio subido exitosamente');

      // Limpiar formulario
      setFormData({
        patientId: '',
        fechaRealizacion: '',
        descripcion: '',
        file: null,
      });
      setSearchDni('');
      setPatientFound(null);

      // Limpiar input file
      const fileInput = document.getElementById('file');
      if (fileInput) fileInput.value = '';

      // Recargar estudios
      loadEstudios();
    } catch (error) {
      console.error('Error al subir estudio:', error);
      window.notifyError(error.message || 'Error al subir el estudio');
    } finally {
      setLoading(false);
    }
  };

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
      window.notifyError('Error al descargar el archivo');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (!doctorId) {
    return (
      <div className="page-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-bg p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="section-title text-center mb-8">
          Gestión de Estudios Médicos
        </h1>

        {/* Botones de navegación */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => setShowEstudios(false)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              !showEstudios
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Subir Estudio
          </button>
          <button
            onClick={() => setShowEstudios(true)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              showEstudios
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Mis Estudios ({estudios.length})
          </button>
        </div>

        {!showEstudios ? (
          /* Formulario para subir estudios */
          <div className="card p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selección de patient */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar Paciente por DNI *
                  {!patientFound && (
                    <span className="text-red-500 font-normal ml-2 text-xs">
                      (Debe presionar el botón "Buscar" para seleccionarlo antes de subir)
                    </span>
                  )}
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchDni}
                    onChange={(e) => setSearchDni(e.target.value)}
                    placeholder="Ingrese el DNI del paciente"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleSearchPatient}
                    className="btn-primary px-4 py-2"
                  >
                    Buscar
                  </button>
                </div>
                {searchError && (
                  <p className="text-red-500 text-sm mt-2">{searchError}</p>
                )}
                {patientFound && (
                  <div className="mt-3 p-3 bg-green-50 text-green-800 rounded-lg border border-green-200">
                    Paciente encontrado: <strong>{patientFound.name} {patientFound.lastName}</strong>
                  </div>
                )}
              </div>

              {/* Fecha de realización */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Realización *
                </label>
                <input
                  type="date"
                  name="fechaRealizacion"
                  value={formData.fechaRealizacion}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descripción del estudio (opcional)"
                />
              </div>

              {/* Archivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Archivo del Estudio *
                </label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Formatos permitidos: PDF, JPG, JPEG, PNG, DOC, DOCX (máx.
                  10MB)
                </p>
              </div>

              {/* Botón de envío */}
              <button
                type="submit"
                disabled={loading || !patientFound}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  loading || !patientFound
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white'
                }`}
              >
                {loading ? 'Subiendo...' : 'Subir Estudio'}
              </button>

              {/* Botón de volver al menú */}
              <button
                type="button"
                onClick={() => navigate('/doctor')}
                className="w-full py-2 px-4 rounded-lg font-medium transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Volver al Menú
              </button>
            </form>
          </div>
        ) : (
          /* Lista de estudios */
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Estudios Subidos
            </h2>

            {estudios.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No has subido ningún estudio aún
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Paciente
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
                    {estudios.map((estudio) => (
                      <tr
                        key={estudio.idEstudio}
                        className="border-t border-gray-200"
                      >
                        <td className="px-4 py-2 text-sm">
                          {estudio.nombrePaciente}
                          <br />
                          <span className="text-gray-500">
                            DNI: {estudio.dniPaciente}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {formatDate(estudio.fechaRealizacion)}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {estudio.nombreArchivo}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {estudio.descripcion || 'Sin descripción'}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {formatDate(estudio.fechaCarga)}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <button
                            onClick={() =>
                              downloadEstudio(
                                estudio.idEstudio,
                                estudio.nombreArchivo
                              )
                            }
                            className="text-blue-600 hover:text-blue-800 font-medium"
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
        )}
      </div>
    </div>
  );
}

export default UploadStudy;



