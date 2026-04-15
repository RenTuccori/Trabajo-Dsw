import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { useAdministration } from '../../context/administration/AdministrationProvider.jsx';

export function CreateDoctor() {
  const navigate = useNavigate();
  const {
    doctors,
    createDoctor,
    getDoctors,
    getUserByDni,
    createUser,
    getHealthInsurances,
    user,
    healthInsurances,
    deleteDoctor,
  } = useAdministration();

  const [dni, setDni] = useState('');
  const [appointmentDuration, setDuracionTurno] = useState('');
  const [password, setContra] = useState('');
  const [usuarioExistente, setUsuarioExistente] = useState(false);
  const [formularioVisible, setFormularioVisible] = useState(false);
  const [selectedObraSociales, setSelectedObraSociales] = useState(null);

  const [formData, setFormData] = useState({
    dni: '',
    birthDate: '',
    name: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    healthInsuranceId: '',
  });

  useEffect(() => {
    getDoctors();
    getHealthInsurances();
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
    setFormData({ ...formData, healthInsuranceId: selectedOption.value });
  };

  const handleBuscarDNI = async (e) => {
    e.preventDefault();
    if (dni.trim() !== '') {
      try {
        await getUserByDni(dni);
        if (user.length !== 0) {
          setUsuarioExistente(true);
          window.notifySuccess(
            'Usuario encontrado, continúe con los siguientes pasos.'
          );
        } else {
          setUsuarioExistente(false);
          window.notifyError(
            'Usuario no encontrado, complete los datos para crear uno nuevo.'
          );
        }
        setFormularioVisible(true); // Muestra el formulario después de la búsqueda
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Si es un error 404, significa que no existe el user, continuar como nuevo
          setUsuarioExistente(false);
          window.notifyError(
            'Usuario no encontrado, complete los datos para crear uno nuevo.'
          );
          setFormularioVisible(true);
        } else {
          window.notifyError('Error al buscar el user');
          console.error('Error al buscar user:', error);
        }
      }
    } else {
      window.notifyError('Ingrese un DNI válido');
    }
  };

  const handlecreateDoctor = async (e) => {
    e.preventDefault();
    if (appointmentDuration.trim() !== '') {
      if (!usuarioExistente && password.trim() === '') {
        window.notifyError('Complete todos los campos');
        return;
      }
      try {
        if (!usuarioExistente) {
          await createUser({
            ...formData,
            dni, // Agregar el dni al nuevo user
            password, // Password para el usuario
          });
        }
        await createDoctor({ dni, appointmentDuration });
        window.notifySuccess('¡Doctor creado con éxito!');
        navigate('/admin');
      } catch (error) {
        window.notifyError('Error al crear el doctor');
        console.error('Error al crear doctor:', error);
      }
    } else {
      window.notifyError('Complete todos los campos');
    }
  };

  const handleDelete = async (doctorId) => {
    try {
      await deleteDoctor(doctorId);
      window.notifySuccess(`Doctor con ID ${doctorId} borrado.`);
      // Actualiza la lista de doctors
      await getDoctors();
    } catch (error) {
      window.notifyError(`Error al borrar el doctor con ID ${doctorId}`);
      console.error(`Error al borrar el doctor con ID ${doctorId}:`, error);
    }
  };

  const handleUpdate = async (doctorId) => {
    try {
      // Redirigir a un formulario de actualización de doctor con el ID del doctor
      navigate(`/admin/updateDoctor/${doctorId}`);
      // Después de actualizar, recargar la lista de doctors
      await getDoctors();
    } catch (error) {
      window.notifyError(`Error al actualizar el doctor con ID ${doctorId}`);
      console.error(`Error al actualizar el doctor con ID ${doctorId}:`, error);
    }
  };

  return (
    <div className="page-bg flex items-center justify-center p-4">
      <div className="card p-8 space-y-5 animate-slide-up w-full max-w-md">
        {!formularioVisible && (
          <form onSubmit={handleBuscarDNI} className="space-y-4">
            <div>
              <p className="label text-center">
                Por favor, ingresa el DNI del doctor que quieres crear
              </p>
              <input
                type="text"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                className="input"
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
            >
              Buscar user
            </button>
          </form>
        )}
        {formularioVisible && (
          <>
            {!usuarioExistente && (
              <form onSubmit={handlecreateDoctor} className="space-y-4">
                <div>
                  <p className="label text-center">
                    Fecha de nacimiento
                  </p>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <p className="label text-center">Nombre</p>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <p className="label text-center">Apellido</p>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <p className="label text-center">Dirección</p>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <p className="label text-center">Teléfono</p>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <p className="label text-center">Email</p>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <p className="label text-center">
                    Obra social
                  </p>
                  <Select
                      options={healthInsurances.map((obrasocial) => ({
                        value: obrasocial.id,
                        label: obrasocial.name,
                      }))}
                    onChange={handleObraSocialChange}
                    value={selectedObraSociales}
                    className="react-select"
                  />
                </div>
                <div>
                  <p className="label text-center">
                    Duración del appointment (en minutos)
                  </p>
                  <input
                    type="text"
                    value={appointmentDuration}
                    onChange={(e) => setDuracionTurno(e.target.value)}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <p className="label text-center">
                    Contraseña
                  </p>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setContra(e.target.value)}
                    className="input"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Crear doctor
                </button>
              </form>
            )}

            {usuarioExistente && (
              <form onSubmit={handlecreateDoctor} className="space-y-4">
                <input
                  type="text"
                  placeholder="Duración del appointment (en minutos)"
                  value={appointmentDuration}
                  onChange={(e) => setDuracionTurno(e.target.value)}
                  className="input"
                  required
                />
                <button
                  type="submit"
                  className="btn-primary"
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
          className="btn-secondary mt-4"
        >
          Volver
        </button>

        <h3 className="text-lg font-medium text-gray-800 mt-6">
          Doctores creados
        </h3>
        <ul className="space-y-2">
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <li
                key={doctor.doctorId}
                className="list-item flex justify-between items-center"
              >
                <span>
                  <strong>{doctor.fullName}</strong>
                </span>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleDelete(doctor.doctorId)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => handleUpdate(doctor.doctorId)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Actualizar
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-600">
              No hay doctors creados aún.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}
