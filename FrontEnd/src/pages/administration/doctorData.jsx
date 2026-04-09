/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { useAdministration } from '../../context/administration/AdministrationProvider.jsx';

export function DoctorData() {
  const { healthInsurances, getHealthInsurances, createUser, createDoctor } =
    useAdministration();
  const [selectedInsurance, setSelectedInsurance] = useState(null);
  const [userCreated, setUserCreated] = useState(false);
  const navigate = useNavigate();
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

  const [doctorData, setDoctorData] = useState({
    appointmentDuration: '',
    password: '',
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

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    try {
      await createUser(formData);
      setUserCreated(true);
      window.notifySuccess(
        'Usuario creado exitosamente. Ahora complete los datos del médico.'
      );
    } catch (error) {
      window.notifyError('Error al crear el usuario');
      console.error('Error al crear el usuario:', error);
    }
  };

  const handleSubmitDoctor = async (e) => {
    e.preventDefault();
    try {
      const { nationalId } = formData;
      await createDoctor({ nationalId, ...doctorData });
      window.notifySuccess('¡Doctor creado exitosamente!');
      navigate('/admin');
    } catch (error) {
      window.notifyError('Error al crear el doctor');
      console.error('Error al crear el doctor:', error);
    }
  };

  useEffect(() => {
    getHealthInsurances();
  }, []);

  const handleInsuranceChange = (selectedOption) => {
    setSelectedInsurance(selectedOption);
    setFormData((prevFormData) => ({
      ...prevFormData,
      healthInsuranceId: selectedOption.value,
    }));
  };

  return (
    <div className="min-h-[calc(100vh-88px)] bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        {/* Formulario para crear user */}
        {!userCreated && (
          <form onSubmit={handleSubmitUser} className="space-y-4">
            <div>
              <p className="text-center text-gray-600 text-lg">DNI</p>
              <input
                type="text"
                name="nationalId"
                value={formData.nationalId}
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
              <p className="text-center text-gray-600 text-lg">Obra Social</p>
              <Select
                options={healthInsurances.map((insurance) => ({
                  value: insurance.healthInsuranceId,
                  label: insurance.name,
                }))}
                onChange={handleInsuranceChange}
                value={selectedInsurance}
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

        {/* Form to create doctor after creating the user */}
        {userCreated && (
          <form onSubmit={handleSubmitDoctor} className="space-y-4">
            <div>
              <p className="text-center text-gray-600 text-lg">
                Duración del turno (minutos)
              </p>
              <input
                type="text"
                name="appointmentDuration"
                value={doctorData.appointmentDuration}
                onChange={handleDoctorInputChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <p className="text-center text-gray-600 text-lg">Contraseña</p>
              <input
                type="password"
                name="password"
                value={doctorData.password}
                onChange={handleDoctorInputChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
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
      </div>
    </div>
  );
}



