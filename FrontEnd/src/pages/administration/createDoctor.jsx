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

  const [nationalId, setNationalId] = useState('');
  const [appointmentDuration, setAppointmentDuration] = useState('');
  const [password, setPassword] = useState('');
  const [existingUser, setExistingUser] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState(null);

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

  const handleInsuranceChange = (selectedOption) => {
    setSelectedInsurance(selectedOption);
    setFormData({ ...formData, healthInsuranceId: selectedOption.value });
  };

  const handleSearchByNationalId = async (e) => {
    e.preventDefault();
    if (nationalId.trim() !== '') {
      try {
        await getUserByDni(nationalId);
        if (user.length !== 0) {
          setExistingUser(true);
          window.notifySuccess(
            'Usuario encontrado, proceda con los siguientes pasos.'
          );
        } else {
          setExistingUser(false);
          window.notifyError(
            'Usuario no encontrado, complete los datos para crear uno nuevo.'
          );
        }
        setFormVisible(true);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setExistingUser(false);
          window.notifyError(
            'Usuario no encontrado, complete los datos para crear uno nuevo.'
          );
          setFormVisible(true);
        } else {
          window.notifyError('Error al buscar usuario');
          console.error('Error al buscar usuario:', error);
        }
      }
    } else {
      window.notifyError('Por favor ingrese un DNI válido');
    }
  };

  const handlecreateDoctor = async (e) => {
    e.preventDefault();
    if (appointmentDuration.trim() !== '') {
      if (!existingUser && password.trim() === '') {
        window.notifyError('Por favor complete todos los campos');
        return;
      }
      try {
        if (!existingUser) {
          await createUser({
            ...formData,
            nationalId,
            password,
          });
        }
        await createDoctor({ nationalId, appointmentDuration });
        window.notifySuccess('¡Doctor creado exitosamente!');
        navigate('/admin');
      } catch (error) {
        window.notifyError('Error al crear el doctor');
        console.error('Error al crear el doctor:', error);
      }
    } else {
      window.notifyError('Por favor complete todos los campos');
    }
  };

  const handleDelete = async (doctorId) => {
    try {
      await deleteDoctor(doctorId);
      window.notifySuccess(`Doctor con ID ${doctorId} eliminado.`);
      await getDoctors();
    } catch (error) {
      window.notifyError(`Error al eliminar el doctor con ID ${doctorId}`);
      console.error(`Error al eliminar el doctor con ID ${doctorId}:`, error);
    }
  };

  const handleUpdate = async (doctorId) => {
    try {
      navigate(`/admin/updateDoctor/${doctorId}`);
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
          <form onSubmit={handleSearchByNationalId} className="space-y-4">
            <div>
              <p className="text-center text-gray-600 text-lg">
                Por favor ingrese el DNI del médico que desea crear
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
              Buscar usuario
            </button>
          </form>
        )}
        {formVisible && (
          <>
            {!existingUser && (
              <form onSubmit={handlecreateDoctor} className="space-y-4">
                <div>
                  <p className="text-center text-gray-600 text-lg">Fecha de nacimiento</p>
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
                    Obra Social
                  </p>
                  <Select
                      options={healthInsurances.map((insurance) => ({
                        value: insurance.id,
                        label: insurance.name,
                      }))}
                    onChange={handleInsuranceChange}
                    value={selectedInsurance}
                    className="react-select"
                  />
                </div>
                <div>
                  <p className="text-center text-gray-600 text-lg">
                    Duración del turno (minutos)
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
                  Crear médico
                </button>
              </form>
            )}

            {existingUser && (
              <form onSubmit={handlecreateDoctor} className="space-y-4">
                <input
                  type="text"
                  placeholder="Duración del turno (minutos)"
                  value={appointmentDuration}
                  onChange={(e) => setAppointmentDuration(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Crear médico
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
          Médicos existentes
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
            No hay médicos creados aún.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}
