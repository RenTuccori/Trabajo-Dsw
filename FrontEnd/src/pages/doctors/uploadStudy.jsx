import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/global/AuthProvider';
import { useNavigate } from 'react-router-dom';
import {
  uploadStudy,
  getStudiesByDoctor,
  downloadStudy as downloadStudyAPI,
} from '../../api/studies.api';
import { getPatients } from '../../api/patients.api';

function UploadStudy() {
  const { doctorId } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientId: '',
    performanceDate: '',
    description: '',
    file: null,
  });
  const [patients, setPatients] = useState([]);
  const [searchNationalId, setSearchNationalId] = useState('');
  const [patientFound, setPatientFound] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showStudies, setShowStudies] = useState(false);

  // Load patients on component mount
  useEffect(() => {
    const initializeData = async () => {
      setInitialLoading(true);
      await loadPatients();
      setInitialLoading(false);
    };
    initializeData();
  }, []);

  const loadStudies = useCallback(async () => {
    try {
      const response = await getStudiesByDoctor(doctorId);
      setStudies(response.data || []);
    } catch (error) {
      console.error('Error loading studies:', error);
      setStudies([]);
    }
  }, [doctorId]);

  // Load studies when doctorId changes
  useEffect(() => {
    if (doctorId) {
      loadStudies();
    }
  }, [doctorId, loadStudies]);

  const loadPatients = async () => {
    try {
      const response = await getPatients();
      setPatients(response.data || []);
    } catch (error) {
      console.error('Error loading patients:', error);
      window.notifyError('Error al cargar la lista de pacientes');
      setPatients([]);
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
    if (!searchNationalId.trim()) {
      setSearchError('Por favor ingrese un DNI válido.');
      setPatientFound(null);
      setFormData((prev) => ({ ...prev, patientId: '' }));
      return;
    }

    const found = patients.find(
      (p) => String(p.nationalId) === searchNationalId
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
      window.notifyError('Por favor busque y seleccione un paciente primero usando su DNI');
      return;
    }

    if (!formData.performanceDate) {
      window.notifyError('Por favor complete la fecha de realización');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('file', formData.file);
      data.append('patientId', formData.patientId);
      // Backend expects 'performanceDate' and 'description'
      data.append('performanceDate', formData.performanceDate);
      data.append('description', formData.description);

      await uploadStudy(data);

      window.notifySuccess('Estudio subido exitosamente');

      // Clear form
      setFormData({
        patientId: '',
        performanceDate: '',
        description: '',
        file: null,
      });
      setSearchNationalId('');
      setPatientFound(null);

      // Clear file input
      const fileInput = document.getElementById('file');
      if (fileInput) fileInput.value = '';

      // Reload studies
      loadStudies();
    } catch (error) {
      console.error('Error uploading study:', error);
      window.notifyError(error.message || 'Error al subir el estudio');
    } finally {
      setLoading(false);
    }
  };

  const downloadStudy = async (studyId, fileName) => {
    try {
      const response = await downloadStudyAPI(studyId);

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading study:', error);
      window.notifyError('Error al descargar el archivo');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (!doctorId) {
    return (
      <div className="min-h-[calc(100vh-88px)] bg-gradient-to-b from-blue-100 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">
            Debe iniciar sesión como médico
          </p>
        </div>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="min-h-[calc(100vh-88px)] bg-gradient-to-b from-blue-100 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-88px)] bg-gradient-to-b from-blue-100 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Gestión de Estudios Médicos
        </h1>

        {/* Navigation buttons */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => setShowStudies(false)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              !showStudies
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Subir Estudio
          </button>
          <button
            onClick={() => setShowStudies(true)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              showStudies
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Mis Estudios ({studies.length})
          </button>
        </div>

        {!showStudies ? (
          /* Upload study form */
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Subir Nuevo Estudio
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Patient selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar Paciente por DNI *
                  {!patientFound && (
                    <span className="text-red-500 font-normal ml-2 text-xs">
                      (Debe hacer clic en el botón "Buscar" para seleccionarlo antes de subir)
                    </span>
                  )}
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchNationalId}
                    onChange={(e) => setSearchNationalId(e.target.value)}
                    placeholder="Ingrese el DNI del paciente"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleSearchPatient}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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

              {/* Performance date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de realización *
                </label>
                <input
                  type="date"
                  name="performanceDate"
                  value={formData.performanceDate}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descripción del estudio (opcional)"
                />
              </div>

              {/* File */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Archivo del estudio *
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
                  Formatos permitidos: PDF, JPG, JPEG, PNG, DOC, DOCX (máx. 10MB)
                </p>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading || !patientFound}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  loading || !patientFound
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {loading ? 'Subiendo...' : 'Subir Estudio'}
              </button>

              {/* Back to menu button */}
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
          /* Studies list */
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Estudios Subidos
            </h2>

            {studies.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Aún no subiste ningún estudio
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
                        Fecha de realización
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Archivo
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Descripción
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Fecha de carga
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {studies.map((study) => (
                      <tr
                        key={study.id}
                        className="border-t border-gray-200"
                      >
                        <td className="px-4 py-2 text-sm">
                          {study.patientName}
                          <br />
                          <span className="text-gray-500">
                            DNI: {study.patientNationalId}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {formatDate(study.performanceDate)}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {study.fileName}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {study.description || 'Sin descripción'}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {formatDate(study.uploadDate)}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <button
                            onClick={() =>
                              downloadStudy(
                                study.id,
                                study.fileName
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



