import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Importa useParams
import Select from 'react-select';
import { useAdministration } from '../../context/administration/AdministrationProvider';

export function UpdateDoctor() {
  const {
    getHealthInsurances,
    healthInsurances,
    doctor,
    getDoctorById,
    updateUser,
    updateDoctor,
  } = useAdministration();

  const { doctors, getDoctors } = useAdministration();

  const [selectedInsurance, setSelectedInsurance] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [, setOriginalData] = useState({});
  const navigate = useNavigate();
  const { doctorId } = useParams(); // Usa useParams para obtener el doctorId desde la URL

  const [selectedDoctorId, setSelectedDoctorId] = useState(doctorId || '');

  const [formData, setFormData] = useState({
    doctorId: '',
    nationalId: '',
    birthDate: '',
    name: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    healthInsuranceId: '',
    appointmentDuration: '',
    password: '',
  });

  const getInsuranceId = (insurance) =>
    insurance?.id ?? insurance?.healthInsuranceId;

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

    const result = await window.confirmDialog(
      'Guardar cambios',
      '¿Estás seguro de que deseas guardar los cambios?'
    );

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.notifyError(
            'Error de autenticación. Por favor inicie sesión nuevamente.'
          );
          navigate('/login');
          return;
        }

        const userData = {
          nationalId: formData.nationalId ? Number(formData.nationalId) : undefined,
          name: formData.name,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          healthInsuranceId: formData.healthInsuranceId,
          ...(formData.password?.trim()
            ? { password: formData.password.trim() }
            : {}),
        };

        const doctorData = {
          doctorId: formData.doctorId,
          appointmentDuration: formData.appointmentDuration,
        };

        const response = await updateUser(userData);

        const responseDoctor = await updateDoctor(doctorData);

        if (
          response &&
          response.data &&
          responseDoctor &&
          responseDoctor.data
        ) {
          window.notifySuccess('Usuario actualizado exitosamente');
          setHasChanges(false);
          navigate('/admin/createDoctor');
        } else {
          window.notifyError('Error al actualizar el usuario o doctor');
        }
      } catch (error) {
        console.error('Error updating:', error);
        if (error.response?.status === 403) {
          window.notifyError('No tiene permisos para realizar esta acción');
        } else if (error.response?.status === 401) {
          window.notifyError(
            'Sesión expirada. Por favor inicie sesión nuevamente.'
          );
          navigate('/login');
        } else {
          window.notifyError(
            'Error al actualizar el usuario: ' +
              (error.message || 'Error desconocido')
          );
        }
      }
    }
  };

  useEffect(() => {
    getHealthInsurances();
    getDoctors();
    if (doctorId) getDoctorById(doctorId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId]);

  // Set formData after all dependencies are loaded
  useEffect(() => {
    // Autocomplete when doctor data is available
    if (healthInsurances.length > 0 && doctor && doctor.doctorId) {
      // Prefer direct id from backend, fallback to name matching for older payloads
      const doctorInsuranceId = doctor.healthInsuranceId;
      const matchedInsurance = doctorInsuranceId
        ? healthInsurances.find(
            (os) => String(getInsuranceId(os)) === String(doctorInsuranceId)
          )
        : healthInsurances.find((os) => os.name === doctor.healthInsurance);
      const healthInsuranceId = matchedInsurance ? getInsuranceId(matchedInsurance) : '';

      setFormData((prevFormData) => ({
        ...prevFormData,
        doctorId: doctor.doctorId || doctorId,
        nationalId: doctor.nationalId || '',
        name: doctor.firstName || '',
        lastName: doctor.lastName || '',
        phone: doctor.phone || '',
        email: doctor.email || '',
        address: doctor.address || '',
        healthInsuranceId: healthInsuranceId,
        appointmentDuration: doctor.appointmentDuration || '',
        password: '',
      }));

      setSelectedInsurance(
        healthInsuranceId
          ? { value: healthInsuranceId, label: matchedInsurance.name }
          : null
      );

      setOriginalData({
        doctorId: doctor.doctorId || doctorId,
        nationalId: doctor.nationalId || '',
        name: doctor.firstName || '',
        lastName: doctor.lastName || '',
        phone: doctor.phone || '',
        email: doctor.email || '',
        address: doctor.address || '',
        healthInsuranceId: healthInsuranceId,
        appointmentDuration: doctor.appointmentDuration || '',
        password: '',
      });
    }
  }, [healthInsurances, doctor]);

  // Manejar selección desde el selector de doctors
  const handleDoctorSelect = async (selectedOption) => {
    if (!selectedOption) return;
    const id = selectedOption.value;
    setSelectedDoctorId(id);
    try {
      await getDoctorById(Number(id));
      setHasChanges(false);
    } catch (error) {
      window.notifyError('Error al cargar datos del doctor');
      console.error('Error al cargar doctor seleccionado:', error);
    }
  };
  const handleInsuranceChange = (selectedOption) => {
    setSelectedInsurance(selectedOption);
    setFormData((prevFormData) => ({
      ...prevFormData,
      healthInsuranceId: selectedOption?.value ?? '',
    }));
    setHasChanges(true);
  };

  const handleGoBack = async () => {
    if (hasChanges) {
      const result = await window.confirmDialog(
        'Cambios sin guardar',
          'Tiene cambios sin guardar. ¿Está seguro de que desea volver? Los cambios se perderán.'
      );

      if (result.isConfirmed) {
        navigate('/admin/createDoctor');
      }
    } else {
      navigate('/admin/createDoctor');
    }
  };

  return (
    <div className="min-h-[calc(100vh-88px)] bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <div>
          <p className="text-center text-gray-600 text-lg">Seleccionar médico</p>
          <Select
            options={doctors.map((d) => ({ value: String(d.doctorId), label: d.fullName }))}
            onChange={handleDoctorSelect}
            value={doctors.find((d) => String(d.doctorId) === String(selectedDoctorId)) ? { value: String(selectedDoctorId), label: doctors.find((d) => String(d.doctorId) === String(selectedDoctorId)).fullName } : null}
            className="react-select mb-4"
            placeholder="Elegir un médico..."
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          </div>{' '}
          <div>
            <p className="text-center text-gray-600 text-lg">Obra Social</p>
            <Select
              options={healthInsurances.map((insurance) => ({
                value: getInsuranceId(insurance),
                label: insurance.name,
              }))}
              onChange={handleInsuranceChange}
              value={selectedInsurance}
              className="react-select"
              placeholder="Seleccionar obra social..."
            />
          </div>
          <div>
            <p className="text-center text-gray-600 text-lg">
              Duración del turno (minutos)
            </p>
            <input
              type="number"
              name="appointmentDuration"
              value={formData.appointmentDuration}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <p className="text-center text-gray-600 text-lg">Contraseña</p>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Dejar en blanco para mantener la contraseña actual"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
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
          onClick={handleGoBack}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors mt-4"
        >
          Volver
        </button>
      </div>
    </div>
  );
}



