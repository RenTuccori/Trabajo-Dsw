/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { useAdministration } from '../../context/administration/AdministrationProvider.jsx';

export function DoctorData() {
  const { healthInsurances, getHealthInsurances, createUser, createDoctor } =
    useAdministration();
  const [selectedObraSociales, setSelectedObraSociales] = useState(null);
  const [usuarioCreado, setUsuarioCreado] = useState(false); // Para manejar el flujo de creación de user y doctor
  const navigate = useNavigate();
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

  const handleSubmitUsuario = async (e) => {
    e.preventDefault();
    try {
      await createUser(formData); // Crea el user
      setUsuarioCreado(true); // Marca que el user ha sido creado
      window.notifySuccess(
        'Usuario creado con éxito. Ahora complete los datos del doctor.'
      );
    } catch (error) {
      window.notifyError('Error al crear el user');
      console.error('Error al crear user:', error);
    }
  };

  const handleSubmitDoctor = async (e) => {
    e.preventDefault();
    try {
      const { dni } = formData;
      await createDoctor({ dni, ...doctorData }); // Crea el doctor utilizando el DNI del user creado
      window.notifySuccess('¡Doctor creado con éxito!');
      navigate('/admin'); // Redirige después de crear el doctor
    } catch (error) {
      window.notifyError('Error al crear el doctor');
      console.error('Error al crear doctor:', error);
    }
  };

  useEffect(() => {
    getHealthInsurances();
  }, []);

  const handleObraSocialChange = (selectedOption) => {
    setSelectedObraSociales(selectedOption);
    setFormData((prevFormData) => ({
      ...prevFormData,
      healthInsuranceId: selectedOption.value,
    }));
  };

  return (
    <div className="page-bg flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-8 space-y-5 animate-slide-up">
        {/* Formulario para crear user */}
        {!usuarioCreado && (
          <form onSubmit={handleSubmitUsuario} className="space-y-4">
            <div>
              <p className="label text-center">DNI</p>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleInputChange}
                required
                className="input"
              />
            </div>
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
              <p className="label text-center">Obra Social</p>
              <Select
                options={healthInsurances.map((obrasociales) => ({
                  value: obrasociales.healthInsuranceId,
                  label: obrasociales.name,
                }))}
                onChange={handleObraSocialChange}
                value={selectedObraSociales}
                className="react-select"
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
            >
              Crear user
            </button>
          </form>
        )}

        {/* Formulario para crear doctor después de crear el user */}
        {usuarioCreado && (
          <form onSubmit={handleSubmitDoctor} className="space-y-4">
            <div>
              <p className="label text-center">
                Duración del appointment (minutos)
              </p>
              <input
                type="text"
                name="appointmentDuration"
                value={doctorData.appointmentDuration}
                onChange={handleDoctorInputChange}
                required
                className="input"
              />
            </div>
            <div>
              <p className="label text-center">Contraseña</p>
              <input
                type="password"
                name="password"
                value={doctorData.password}
                onChange={handleDoctorInputChange}
                required
                className="input"
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
      </div>
    </div>
  );
}



