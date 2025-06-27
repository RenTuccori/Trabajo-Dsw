import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Importa useParams
import Select from 'react-select';
import { useAdministracion } from '../../context/administracion/AdministracionProvider';
import { useAuth } from '../../context/global/AuthProvider';
import { confirmDialog } from '../../components/SwalConfig';
import { notifySuccess, notifyError } from '../../components/ToastConfig';

export function ActualizarDoctor() {
  const {
    ObtenerOS,
    obrasSociales,
    doctor,
    ObtenerDoctorPorId,
    actualizarUsuario,
    actualizarDoctor,
  } = useAdministracion();

  const { comprobarToken } = useAuth();
  const [selectedObraSociales, setSelectedObraSociales] = useState(null);
  const [hasChanges, setHasChanges] = useState(false); // Estado para rastrear cambios
  const [, setOriginalData] = useState({}); // Datos originales para comparar
  const navigate = useNavigate();
  const { idDoctor } = useParams(); // Usa useParams para obtener el idDoctor desde la URL

  const [formData, setFormData] = useState({
    idDoctor: '',
    dni: '',
    fechaNacimiento: '',
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    direccion: '',
    idObraSocial: '',
    duracionTurno: '',
    contra: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setHasChanges(true); // Marca como cambiado al modificar un campo
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar duracionTurno
    const duracionNum = parseInt(formData.duracionTurno);
    if (isNaN(duracionNum) || duracionNum < 15 || duracionNum > 180) {
      notifyError('La duración del turno debe ser un número entre 15 y 180 minutos');
      return;
    }

    // Validar contraseña si se proporciona
    if (formData.contra && formData.contra.trim() !== '' && formData.contra.length < 6) {
      notifyError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Alerta de confirmación
    const result = await confirmDialog(
      'Guardar cambios',
      '¿Estás seguro que deseas guardar los cambios?'
    );

    if (result.isConfirmed) {
      try {
        console.log('Datos a enviar:', formData);

        // Verificar que el token existe
        const token = localStorage.getItem('token');
        if (!token) {
          notifyError(
            'Error de autenticación. Por favor, inicia sesión nuevamente.'
          );
          navigate('/login');
          return;
        }

        // Preparar datos para actualizar usuario (solo los campos que espera el backend)
        const usuarioData = {
          dni: formData.dni,
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono,
          email: formData.email,
          direccion: formData.direccion,
          idObraSocial: formData.idObraSocial,
        };

        // Preparar datos para actualizar doctor
        const doctorData = {
          idDoctor: formData.idDoctor,
          duracionTurno: parseInt(formData.duracionTurno),
        };

        // Solo incluir contraseña si se proporcionó una nueva
        if (formData.contra && formData.contra.trim() !== '') {
          doctorData.contra = formData.contra;
        }

        console.log('Datos usuario:', usuarioData);
        console.log('Datos doctor:', doctorData);

        const response = await actualizarUsuario(usuarioData);
        console.log('Respuesta de actualización usuario:', response);

        const responseDoctor = await actualizarDoctor(doctorData);
        console.log('Respuesta de actualización doctor:', responseDoctor);

        if (
          response &&
          response.data &&
          responseDoctor &&
          responseDoctor.data
        ) {
          console.log('Usuario y doctor actualizados con éxito');
          notifySuccess('Usuario actualizado con éxito');
          setHasChanges(false);
          navigate('/admin/crearDoc');
        } else {
          console.log('Error: respuesta incompleta', {
            response,
            responseDoctor,
          });
          notifyError('Error al actualizar el usuario o doctor');
        }
      } catch (error) {
        console.error('Error completo al actualizar:', error);
        if (error.response?.status === 403) {
          notifyError('No tienes permisos para realizar esta acción');
        } else if (error.response?.status === 401) {
          notifyError('Sesión expirada. Por favor, inicia sesión nuevamente.');
          navigate('/login');
        } else {
          notifyError(
            'Error al actualizar el usuario: ' +
              (error.message || 'Error desconocido')
          );
        }
      }
    }
  };

  useEffect(() => {
    comprobarToken('A'); // Comprueba el token
    ObtenerOS();
    if (idDoctor) {
      ObtenerDoctorPorId(idDoctor); // Llama a la función con el idDoctor obtenido de la URL
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idDoctor]);

  // Set formData after all dependencies are loaded
  useEffect(() => {
    if (obrasSociales.length > 0 && doctor && doctor.idDoctor) {
      console.log('🔍 Doctor data received:', doctor);
      
      // Extraer datos del usuario desde la estructura anidada
      const usuarioData = doctor.usuario || {};
      const obraSocialData = usuarioData.obraSocial || {};
      
      // Ensure all necessary data is available before setting formData
      const newFormData = {
        idDoctor: doctor.idDoctor || '',
        dni: doctor.dni || '',
        fechaNacimiento: usuarioData.fechaNacimiento || '',
        nombre: usuarioData.nombre || '',
        apellido: usuarioData.apellido || '',
        telefono: usuarioData.telefono || '',
        email: usuarioData.email || '',
        direccion: usuarioData.direccion || '',
        idObraSocial: usuarioData.idObraSocial || '',
        duracionTurno: doctor.duracionTurno || '',
        contra: '', // No mostrar contraseña actual por seguridad
      };
      
      console.log('📝 Setting form data:', newFormData);
      setFormData(newFormData);

      // Set selected obra social
      if (usuarioData.idObraSocial) {
        const obraSocialEncontrada = obrasSociales.find(
          (os) => os.idObraSocial === usuarioData.idObraSocial
        );
        setSelectedObraSociales({
          value: usuarioData.idObraSocial,
          label: obraSocialEncontrada?.nombre || obraSocialData.nombre || 'No asignada',
        });
      }

      // Guardar datos originales
      setOriginalData(newFormData);
      setHasChanges(false); // Reset changes flag when loading new data
    }
  }, [obrasSociales, doctor]);
  const handleObraSocialChange = (selectedOption) => {
    setSelectedObraSociales(selectedOption);
    setFormData((prevFormData) => ({
      ...prevFormData,
      idObraSocial: selectedOption.value,
    }));
    setHasChanges(true); // Marca como cambiado al modificar la obra social
  };

  // Función para manejar el regreso a la lista de doctores
  const handleRegresar = async () => {
    if (hasChanges) {
      // Si hay cambios, muestra advertencia
      const result = await confirmDialog(
        'Cambios sin guardar',
        'Tienes cambios sin guardar. ¿Estás seguro de que quieres volver? Los cambios se perderán.'
      );

      if (result.isConfirmed) {
        navigate('/admin/crearDoc');
      }
    } else {
      // Si no hay cambios, navega de regreso directamente
      navigate('/admin/crearDoc');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-center text-gray-600 text-lg">Nombre</p>
            <input
              type="text"
              name="nombre"
              value={formData.nombre || ''}
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
              value={formData.apellido || ''}
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
              value={formData.direccion || ''}
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
              value={formData.telefono || ''}
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
              value={formData.email || ''}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
          </div>{' '}
          <div>
            <p className="text-center text-gray-600 text-lg">Obra social</p>
            <Select
              options={obrasSociales.map((obrasociales) => ({
                value: obrasociales.idObraSocial,
                label: obrasociales.nombre,
              }))}
              onChange={handleObraSocialChange}
              value={selectedObraSociales}
              className="react-select"
            />
          </div>
          <div>
            <p className="text-center text-gray-600 text-lg">
              Duración del turno (minutos)
            </p>
            <input
              type="number"
              min="15"
              max="180"
              name="duracionTurno"
              value={formData.duracionTurno || ''}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
              placeholder="Ej: 30"
            />
            <p className="text-xs text-gray-500 mt-1">Entre 15 y 180 minutos</p>
          </div>
          <div>
            <p className="text-center text-gray-600 text-lg">
              Contraseña (dejar vacío para no cambiar)
            </p>
            <input
              type="password"
              name="contra"
              value={formData.contra || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
              placeholder="Nueva contraseña (opcional)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Mínimo 6 caracteres si desea cambiarla
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Guardar cambios
          </button>
        </form>

        <button
          type="button"
          onClick={handleRegresar}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors mt-4"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
