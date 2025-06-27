import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { useAdministracion } from '../../context/administracion/AdministracionProvider.jsx';
import { notifySuccess, notifyError } from '../../components/ToastConfig';
import { confirmDialog } from '../../components/SwalConfig';

export function CrearDoctor() {
  const navigate = useNavigate();
  const {
    doctores,
    CreaDoctor,
    ObtenerDoctores,
    ObtenerUsuarioDni,
    CrearUsuario,
    ObtenerOS,
    obrasSociales,
    borrarDoctor,
  } = useAdministracion();

  const [dni, setDni] = useState('');
  const [duracionTurno, setDuracionTurno] = useState('');
  const [contra, setContra] = useState('');
  const [usuarioExistente, setUsuarioExistente] = useState(false);
  const [formularioVisible, setFormularioVisible] = useState(false);
  const [selectedObraSociales, setSelectedObraSociales] = useState(null);

  const [formData, setFormData] = useState({
    dni: '',
    fechaNacimiento: '',
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    direccion: '',
    idObraSocial: '',
  });

  useEffect(() => {
    console.log('🔄 Inicializando página de Crear Doctor');
    ObtenerDoctores()
      .then(() => console.log('✅ Doctores cargados correctamente'))
      .catch(err => console.error('❌ Error al cargar doctores:', err));
    
    ObtenerOS()
      .then(() => console.log('✅ Obras sociales cargadas correctamente'))
      .catch(err => console.error('❌ Error al cargar obras sociales:', err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleObraSocialChange = (selectedOption) => {
    setSelectedObraSociales(selectedOption);
    setFormData({ ...formData, idObraSocial: selectedOption.value });
  };

  const handleBuscarDNI = async (e) => {
    e.preventDefault();
    if (dni.trim() !== '') {
      try {
        console.log('🔍 Buscando usuario con DNI:', dni);
        const usuarioEncontrado = await ObtenerUsuarioDni(dni);
        
        if (usuarioEncontrado && usuarioEncontrado.dni) {
          console.log('✅ Usuario encontrado:', usuarioEncontrado);
          
          // Verificar si ya es doctor activo usando la información del backend
          if (usuarioEncontrado.yaEsDoctor) {
            notifyError(
              `El usuario con DNI ${dni} ya está registrado como doctor activo.`
            );
            return;
          }
          
          // Si es un doctor deshabilitado, mostrar mensaje informativo
          if (usuarioEncontrado.doctorDeshabilitado) {
            notifySuccess(
              `El usuario con DNI ${dni} fue doctor anteriormente. Se rehabilitará al crear nuevamente.`
            );
          }
          
          setUsuarioExistente(true);
          notifySuccess(
            'Usuario encontrado, continúe con los siguientes pasos.'
          );
        } else {
          console.log('❌ Usuario no encontrado');
          setUsuarioExistente(false);
          notifyError(
            'Usuario no encontrado, complete los datos para crear uno nuevo.'
          );
        }
        setFormularioVisible(true);
      } catch (error) {
        console.error('❌ Error al buscar usuario:', error);
        if (error.response && error.response.status === 404) {
          // Si es un error 404, significa que no existe el usuario, continuar como nuevo
          setUsuarioExistente(false);
          notifyError(
            'Usuario no encontrado, complete los datos para crear uno nuevo.'
          );
          setFormularioVisible(true);
        } else {
          notifyError('Error al buscar el usuario');
        }
      }
    } else {
      notifyError('Ingrese un DNI válido');
    }
  };

  const handleCrearDoctor = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!duracionTurno.trim() || !contra.trim()) {
      notifyError('Complete todos los campos');
      return;
    }
    
    const duracionNum = parseInt(duracionTurno);
    if (isNaN(duracionNum) || duracionNum < 15 || duracionNum > 180) {
      notifyError('La duración del turno debe ser un número entre 15 y 180 minutos');
      return;
    }
    
    if (contra.length < 6) {
      notifyError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      console.log('🏥 Creando doctor...');
      
      if (!usuarioExistente) {
        console.log('👤 Creando usuario primero...');
        await CrearUsuario({
          ...formData,
          dni, // Agregar el dni al nuevo usuario
        });
      }
      
      console.log('👨‍⚕️ Creando doctor con datos:', { dni, duracionTurno: duracionNum, contra });
      await CreaDoctor({ dni, duracionTurno: duracionNum, contra });
      
      notifySuccess('¡Doctor creado con éxito!');
      
      // Recargar la lista de doctores
      await ObtenerDoctores();
      
      // Resetear el formulario
      setFormularioVisible(false);
      setUsuarioExistente(false);
      setDni('');
      setDuracionTurno('');
      setContra('');
      setFormData({
        dni: '',
        fechaNacimiento: '',
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        direccion: '',
        idObraSocial: '',
      });
      setSelectedObraSociales(null);
      
    } catch (error) {
      notifyError('Error al crear el doctor');
      console.error('❌ Error al crear doctor:', error);
    }
  };

  const handleDelete = async (idDoctor) => {
    const result = await confirmDialog(
      '¿Estás seguro?',
      '¿Deseas eliminar este doctor? Esta acción no se puede deshacer.'
    );

    if (result.isConfirmed) {
      try {
        await borrarDoctor(idDoctor);
        notifySuccess(`Doctor eliminado exitosamente.`);
        // Actualiza la lista de doctores
        await ObtenerDoctores();
      } catch (error) {
        notifyError(`Error al eliminar el doctor`);
        console.error(`Error al borrar el doctor con ID ${idDoctor}:`, error);
      }
    }
  };

  const handleUpdate = async (idDoctor) => {
    try {
      // Redirigir a un formulario de actualización de doctor con el ID del doctor
      navigate(`/admin/actualizarDoc/${idDoctor}`);
      // Después de actualizar, recargar la lista de doctores
      await ObtenerDoctores();
    } catch (error) {
      notifyError(`Error al actualizar el doctor con ID ${idDoctor}`);
      console.error(`Error al actualizar el doctor con ID ${idDoctor}:`, error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Gestión de Doctores
        </h2>
        
        {!formularioVisible && (
          <form onSubmit={handleBuscarDNI} className="space-y-4">
            <div>
              <p className="text-center text-gray-600 text-lg">
                Por favor, ingresa el DNI del doctor que quieres crear
              </p>
              <input
                type="text"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Ej: 12345678"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Buscar usuario
            </button>
          </form>
        )}
        {formularioVisible && (
          <>
            {!usuarioExistente && (
              <form onSubmit={handleCrearDoctor} className="space-y-4">
                <div>
                  <p className="text-center text-gray-600 text-lg">
                    Fecha de nacimiento
                  </p>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <p className="text-center text-gray-600 text-lg">Nombre</p>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <p className="text-center text-gray-600 text-lg">Apellido</p>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <p className="text-center text-gray-600 text-lg">Dirección</p>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <p className="text-center text-gray-600 text-lg">Teléfono</p>
                  <input
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <p className="text-center text-gray-600 text-lg">Email</p>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <p className="text-center text-gray-600 text-lg">
                    Obra social
                  </p>
                  <Select
                    options={(obrasSociales || []).map((obrasocial) => ({
                      value: obrasocial.idObraSocial,
                      label: obrasocial.nombre,
                    }))}
                    onChange={handleObraSocialChange}
                    value={selectedObraSociales}
                    className="react-select"
                  />
                </div>
                <div>
                  <p className="text-center text-gray-600 text-lg">
                    Duración del turno (en minutos)
                  </p>
                  <input
                    type="number"
                    min="15"
                    max="180"
                    value={duracionTurno}
                    onChange={(e) => setDuracionTurno(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Ej: 30"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Entre 15 y 180 minutos</p>
                </div>
                <div>
                  <p className="text-center text-gray-600 text-lg">
                    Contraseña
                  </p>
                  <input
                    type="password"
                    value={contra}
                    onChange={(e) => setContra(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Crear doctor
                </button>
              </form>
            )}

            {usuarioExistente && (
              <form onSubmit={handleCrearDoctor} className="space-y-4">
                <input
                  type="number"
                  min="15"
                  max="180"
                  placeholder="Duración del turno (en minutos)"
                  value={duracionTurno}
                  onChange={(e) => setDuracionTurno(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
                <p className="text-xs text-gray-500 -mt-2">Entre 15 y 180 minutos</p>
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={contra}
                  onChange={(e) => setContra(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Crear doctor
                </button>
              </form>
            )}
          </>
        )}

        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors mt-4"
        >
          Volver
        </button>

        {formularioVisible && (
          <button
            type="button"
            onClick={() => {
              setFormularioVisible(false);
              setUsuarioExistente(false);
              setDni('');
              setDuracionTurno('');
              setContra('');
              setFormData({
                dni: '',
                fechaNacimiento: '',
                nombre: '',
                apellido: '',
                telefono: '',
                email: '',
                direccion: '',
                idObraSocial: '',
              });
              setSelectedObraSociales(null);
            }}
            className="w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition-colors mt-2"
          >
            Cancelar y crear otro doctor
          </button>
        )}

        <div className="flex justify-between items-center mt-6 mb-4">
          <h3 className="text-lg font-medium text-gray-800">
            Doctores creados
          </h3>
          <button
            onClick={() => {
              console.log('🔄 Recargando lista de doctores...');
              ObtenerDoctores();
            }}
            className="py-1 px-3 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Recargar lista
          </button>
        </div>
        {doctores === undefined || doctores === null ? (
          <p className="text-center text-yellow-600 bg-yellow-100 p-2 rounded">
            Cargando doctores...
          </p>
        ) : doctores.length > 0 ? (
          <ul className="space-y-2">
            {doctores.map((doctor) => (
              <li
                key={doctor.idDoctor}
                className="bg-gray-100 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start gap-2"
              >
                <div className="flex flex-col w-full sm:w-2/3">
                  <span className="font-semibold text-gray-800">{doctor.nombreyapellido || 'Sin nombre'}</span>
                  {doctor.dni && <span className="text-sm text-gray-600">DNI: {doctor.dni}</span>}
                  {doctor.email && <span className="text-sm text-gray-600">{doctor.email}</span>}
                </div>
                <div className="flex space-x-2 justify-end mt-2 sm:mt-0 w-full sm:w-1/3">
                  <button
                    onClick={() => handleUpdate(doctor.idDoctor)}
                    className="text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1 rounded-md transition-colors"
                  >
                    Actualizar
                  </button>
                  <button
                    onClick={() => handleDelete(doctor.idDoctor)}
                    className="text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1 rounded-md transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600 bg-gray-100 p-3 rounded">
            No hay doctores creados aún.
          </p>
        )}
        
      </div>
    </div>
  );
}
