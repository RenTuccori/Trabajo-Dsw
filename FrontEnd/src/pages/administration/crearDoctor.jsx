import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { useAdministracion } from '../../context/administracion/AdministracionProvider.jsx';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function CrearDoctor() {
  const navigate = useNavigate();
  const {
    doctores,
    CreaDoctor,
    ObtenerDoctores,
    ObtenerUsuarioDni,
    CrearUsuario,
    ObtenerOS,
    usuario,
    obrasSociales,
    borrarDoctor
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
    ObtenerDoctores();
    ObtenerOS();
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
        await ObtenerUsuarioDni(dni);
        if (usuario.length !== 0) {
          setUsuarioExistente(true);
          toast.success(
            'Usuario encontrado, continúe con los siguientes pasos.'
          );
        } else {
          setUsuarioExistente(false);
          toast.info(
            'Usuario no encontrado, complete los datos para crear uno nuevo.'
          );
        }
        setFormularioVisible(true); // Muestra el formulario después de la búsqueda
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Si es un error 404, significa que no existe el usuario, continuar como nuevo
          setUsuarioExistente(false);
          toast.info(
            'Usuario no encontrado, complete los datos para crear uno nuevo.'
          );
          setFormularioVisible(true);
        } else {
          toast.error('Error al buscar el usuario');
          console.error('Error al buscar usuario:', error);
        }
      }
    } else {
      toast.error('Ingrese un DNI válido');
    }
  };

  const handleCrearDoctor = async (e) => {
    e.preventDefault();
    if (duracionTurno.trim() !== '' && contra.trim() !== '') {
      try {
        if (!usuarioExistente) {
          await CrearUsuario({
            ...formData,
            dni, // Agregar el dni al nuevo usuario
          });
        }
        await CreaDoctor({ dni, duracionTurno, contra });
        toast.success('¡Doctor creado con éxito!');
        navigate('/admin');
      } catch (error) {
        toast.error('Error al crear el doctor');
        console.error('Error al crear doctor:', error);
      }
    } else {
      toast.error('Complete todos los campos');
    }
  };

  const handleDelete = async (idDoctor) => {
    try {
      await borrarDoctor(idDoctor);
      toast.success(`Doctor con ID ${idDoctor} borrado.`);
      // Actualiza la lista de doctores
      await ObtenerDoctores();
    } catch (error) {
      toast.error(`Error al borrar el doctor con ID ${idDoctor}`);
      console.error(`Error al borrar el doctor con ID ${idDoctor}:`, error);
    }
  };

  const handleUpdate = async (idDoctor) => {
    try {
      // Redirigir a un formulario de actualización de doctor con el ID del doctor
      navigate(`/admin/actualizarDoc/${idDoctor}`);
      // Después de actualizar, recargar la lista de doctores
      await ObtenerDoctores();
    } catch (error) {
      toast.error(`Error al actualizar el doctor con ID ${idDoctor}`);
      console.error(`Error al actualizar el doctor con ID ${idDoctor}:`, error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
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
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Buscar Usuario
            </button>
          </form>
        )}
        {formularioVisible && (
          <>
            {!usuarioExistente && (
              <form onSubmit={handleCrearDoctor} className="space-y-4">
                <div>
                  <p className="text-center text-gray-600 text-lg">Fecha de Nacimiento</p>
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
                  <p className="text-center text-gray-600 text-lg">Obra Social</p>
                  <Select
                    options={obrasSociales.map((obrasocial) => ({
                      value: obrasocial.idObraSocial,
                      label: obrasocial.nombre,
                    }))}
                    onChange={handleObraSocialChange}
                    value={selectedObraSociales}
                    className="react-select"
                  />
                </div>
                <div>
                  <p className="text-center text-gray-600 text-lg">Duración del turno (en minutos)</p>
                  <input
                    type="text"
                    value={duracionTurno}
                    onChange={(e) => setDuracionTurno(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <p className="text-center text-gray-600 text-lg">Contraseña</p>
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
                  Crear Doctor
                </button>
              </form>
            )}

            {usuarioExistente && (
              <form onSubmit={handleCrearDoctor} className="space-y-4">
                <input
                  type="text"
                  placeholder="Duración del turno (en minutos)"
                  value={duracionTurno}
                  onChange={(e) => setDuracionTurno(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
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
                  Crear Doctor
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

        <h3 className="text-lg font-medium text-gray-800 mt-6">Doctores Creados</h3>
        <ul className="space-y-2">
          {doctores.length > 0 ? (
            doctores.map((doctor) => (
              <li key={doctor.idDoctor} className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                <span>
                  <strong>{doctor.nombreyapellido}</strong>
                </span>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleDelete(doctor.idDoctor)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleUpdate(doctor.idDoctor)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Actualizar
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-600">No hay doctores creados aún.</p>
          )}
        </ul>
      </div>
    </div>
  );
}