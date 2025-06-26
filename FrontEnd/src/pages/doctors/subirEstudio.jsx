import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/global/AuthProvider';
import { useNavigate } from 'react-router-dom';
import {
  uploadEstudio,
  getEstudiosByDoctor,
  downloadEstudio as downloadEstudioAPI,
} from '../../api/estudios.api';
import { getPacientes } from '../../api/pacientes.api';
import { notifySuccess, notifyError } from '../../components/ToastConfig';

function SubirEstudio() {
  const { idDoctor } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    idPaciente: '',
    fechaRealizacion: '',
    descripcion: '',
    archivo: null,
  });
  const [pacientes, setPacientes] = useState([]);
  const [estudios, setEstudios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showEstudios, setShowEstudios] = useState(false);

  // Cargar pacientes al montar el componente
  useEffect(() => {
    console.log('Cargando pacientes...');
    const initializeData = async () => {
      setInitialLoading(true);
      await loadPacientes();
      setInitialLoading(false);
    };
    initializeData();
  }, []);

  const loadEstudios = useCallback(async () => {
    try {
      console.log('Cargando estudios para doctor:', idDoctor);
      const response = await getEstudiosByDoctor(idDoctor);
      console.log('Respuesta de estudios:', response);
      setEstudios(response.data || []);
    } catch (error) {
      console.error('Error al cargar estudios:', error);
      setEstudios([]); // Asegurar que estudios esté definido
    }
  }, [idDoctor]);

  // Cargar estudios cuando cambie el idDoctor
  useEffect(() => {
    console.log('ID Doctor:', idDoctor);
    if (idDoctor) {
      loadEstudios();
    }
  }, [idDoctor, loadEstudios]);

  const loadPacientes = async () => {
    try {
      console.log('Llamando a getPacientes...');
      const response = await getPacientes();
      console.log('Respuesta de pacientes:', response);
      setPacientes(response.data || []);
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
      notifyError('Error al cargar la lista de pacientes');
      setPacientes([]); // Asegurar que pacientes esté definido
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
      archivo: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.archivo) {
      notifyError('Por favor seleccione un archivo');
      return;
    }

    if (!formData.idPaciente || !formData.fechaRealizacion) {
      notifyError('Por favor complete todos los campos obligatorios');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('archivo', formData.archivo);
      data.append('idPaciente', formData.idPaciente);
      data.append('fechaRealizacion', formData.fechaRealizacion);
      data.append('descripcion', formData.descripcion);

      await uploadEstudio(data);

      notifySuccess('Estudio subido exitosamente');

      // Limpiar formulario
      setFormData({
        idPaciente: '',
        fechaRealizacion: '',
        descripcion: '',
        archivo: null,
      });

      // Limpiar input file
      const fileInput = document.getElementById('archivo');
      if (fileInput) fileInput.value = '';

      // Recargar estudios
      loadEstudios();
    } catch (error) {
      console.error('Error al subir estudio:', error);
      notifyError(error.message || 'Error al subir el estudio');
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
      notifyError('Error al descargar el archivo');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (!idDoctor) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">
            Debe iniciar sesión como doctor
          </p>
        </div>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Gestión de Estudios Médicos
        </h1>

        {/* Botones de navegación */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => setShowEstudios(false)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              !showEstudios
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Subir Estudio
          </button>
          <button
            onClick={() => setShowEstudios(true)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              showEstudios
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Mis Estudios ({estudios.length})
          </button>
        </div>

        {!showEstudios ? (
          /* Formulario para subir estudios */
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Subir Nuevo Estudio
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selección de paciente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paciente *
                </label>
                <select
                  name="idPaciente"
                  value={formData.idPaciente}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccione un paciente</option>
                  {pacientes.map((paciente) => (
                    <option key={paciente.dni} value={paciente.idPaciente}>
                      {paciente.nombre} {paciente.apellido} - DNI:{' '}
                      {paciente.dni}
                    </option>
                  ))}
                </select>
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
                  id="archivo"
                  name="archivo"
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
                disabled={loading}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
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
          <div className="bg-white rounded-lg shadow-md p-6">
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

export default SubirEstudio;
