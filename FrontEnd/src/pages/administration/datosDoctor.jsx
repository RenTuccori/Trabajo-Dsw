/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { useAdministracion } from '../../context/administracion/AdministracionProvider.jsx';

export function DatosDoctor() {
  const { obraSociales, ObtenerObraSociales, CrearUsuario, createDoctor } =
    useAdministracion();
  const [selectedObraSociales, setSelectedObraSociales] = useState(null);
  const [usuarioCreado, setUsuarioCreado] = useState(false); // Para manejar el flujo de creación de usuario y doctor
  const navigate = useNavigate();
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

  const [doctorData, setDoctorData] = useState({
    duracionTurno: '',
    contra: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleDoctorInputChange = (e) => {
    const { name, value } = e.target;
    setDoctorData((prevDoctorData) => ({
      ...prevDoctorData,
      [name]: value,
    }));
  };

  const handleSubmitUsuario = async (e) => {
    e.preventDefault();
    try {
      await CrearUsuario(formData); // Crea el usuario
      setUsuarioCreado(true); // Marca que el usuario ha sido creado
      window.notifySuccess(
        'Usuario creado con éxito. Ahora complete los datos del doctor.'
      );
    } catch (error) {
      window.notifyError('Error al crear el usuario');
      console.error('Error al crear usuario:', error);
    }
  };

  const handleSubmitDoctor = async (e) => {
    e.preventDefault();
    try {
      const { dni } = formData;
      await createDoctor({ dni, ...doctorData }); // Crea el doctor utilizando el DNI del usuario creado
      window.notifySuccess('¡Doctor creado con éxito!');
      navigate('/admin'); // Redirige después de crear el doctor
    } catch (error) {
      window.notifyError('Error al crear el doctor');
      console.error('Error al crear doctor:', error);
    }
  };

  useEffect(() => {
    ObtenerObraSociales();
  }, []);

  const handleObraSocialChange = (selectedOption) => {
    setSelectedObraSociales(selectedOption);
    setFormData((prevFormData) => ({
      ...prevFormData,
      idObraSocial: selectedOption.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        {/* Formulario para crear usuario */}
        {!usuarioCreado && (
          <form onSubmit={handleSubmitUsuario} className="space-y-4">
            <div>
              <p className="text-center text-gray-600 text-lg">DNI</p>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
              />
            </div>
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
              <p className="text-center text-gray-600 text-lg">Obra Social</p>
              <Select
                options={(obraSociales || []).map((obrasociales) => ({
                  value: obrasociales.idObraSocial,
                  label: obrasociales.nombre,
                }))}
                onChange={handleObraSocialChange}
                value={selectedObraSociales}
                className="react-select"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear usuario
            </button>
          </form>
        )}

        {/* Formulario para crear doctor después de crear el usuario */}
        {usuarioCreado && (
          <form onSubmit={handleSubmitDoctor} className="space-y-4">
            <div>
              <p className="text-center text-gray-600 text-lg">
                Duración del turno (minutos)
              </p>
              <input
                type="text"
                name="duracionTurno"
                value={doctorData.duracionTurno}
                onChange={handleDoctorInputChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <p className="text-center text-gray-600 text-lg">Contraseña</p>
              <input
                type="password"
                name="contra"
                value={doctorData.contra}
                onChange={handleDoctorInputChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
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
      </div>
    </div>
  );
}
