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
    getUserByNationalId,
    createUser,
    getHealthInsurances,
    user,
    healthInsurances,
    deleteDoctor,
  } = useAdministration();

  const [nationalId, setNationalId] = useState('');
  const [appointmentDuration, setAppointmentDuration] = useState('');
  const [password, setPassword] = useState('');
  const [existingUser, setExistingUser] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedHealthInsurance, setSelectedHealthInsurance] = useState(null);

  const [formData, setFormData] = useState({
    nationalId: '',
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

  const handleHealthInsuranceChange = (selectedOption) => {
    setSelectedHealthInsurance(selectedOption);
    setFormData({ ...formData, healthInsuranceId: selectedOption.value });
  };

  const handleSearchNationalId = async (e) => {
    e.preventDefault();
    if (nationalId.trim() !== '') {
      try {
        await getUserByNationalId(nationalId);
        if (user.length !== 0) {
          setExistingUser(true);
          window.notifySuccess(
            'Usuario encontrado, continúe con los siguientes pasos.'
          );
        } else {
          setExistingUser(false);
          window.notifyError(
            'Usuario no encontrado, complete los datos para crear uno nuevo.'
          );
        }
        setFormVisible(true); // Muestra el formulario después de la búsqueda
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Si es un error 404, significa que no existe el user, continuar como nuevo
          setExistingUser(false);
          window.notifyError(
            'Usuario no encontrado, complete los datos para crear uno nuevo.'
          );
          setFormVisible(true);
        } else {
          window.notifyError('Error al buscar el user');
          console.error('Error al buscar user:', error);
        }
      }
    } else {
      window.notifyError('Ingrese un DNI válido');
    }
  };

  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    if (appointmentDuration.trim() !== '') {
      if (!existingUser && password.trim() === '') {
        window.notifyError('Complete todos los campos');
        return;
      }
      try {
        if (!existingUser) {
          await createUser({
            ...formData,
            nationalId, // Agregar el nationalId al nuevo user
            password, // Password para el usuario
          });
        }
        await createDoctor({ nationalId, appointmentDuration });
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
    <div className="min-h-[calc(100vh-88px)] bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        {!formVisible && (
          <form onSubmit={handleSearchNationalId} className="space-y-4">
            <div>
              <p className="text-center text-gray-600 text-lg">
                Por favor, ingresa el DNI del doctor que quieres crear
              </p>
              <input
                type="text"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Buscar user
            </button>
          </form>
        )}
        {formVisible && (
          <>
            {!existingUser && (
              <form onSubmit={handleCreateDoctor} className="space-y-4">
                <div>
                  <p className="text-center text-gray-600 text-lg">
                    Fecha de nacimiento
                  </p>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <p className="text-center text-gray-600 text-lg">Nombre</p>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <p className="text-center text-gray-600 text-lg">Apellido</p>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <p className="text-center text-gray-600 text-lg">Dirección</p>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <p className="text-center text-gray-600 text-lg">Teléfono</p>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
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
                      options={healthInsurances.map((obrasocial) => ({
                        value: obrasocial.id,
                        label: obrasocial.name,
                      }))}
                    onChange={handleHealthInsuranceChange}
                    value={selectedHealthInsurance}
                    className="react-select"
                  />
                </div>
                <div>
                  <p className="text-center text-gray-600 text-lg">
                    Duración del appointment (en minutos)
                  </p>
                  <input
                    type="text"
                    value={appointmentDuration}
                    onChange={(e) => setAppointmentDuration(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <p className="text-center text-gray-600 text-lg">
                    Contraseña
                  </p>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

            {existingUser && (
              <form onSubmit={handleCreateDoctor} className="space-y-4">
                <input
                  type="text"
                  placeholder="Duración del appointment (en minutos)"
                  value={appointmentDuration}
                  onChange={(e) => setAppointmentDuration(e.target.value)}
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

        <h3 className="text-lg font-medium text-gray-800 mt-6">
          Doctores creados
        </h3>
        <ul className="space-y-2">
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <li
                key={doctor.doctorId}
                className="bg-gray-100 p-4 rounded-lg flex justify-between items-center"
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
