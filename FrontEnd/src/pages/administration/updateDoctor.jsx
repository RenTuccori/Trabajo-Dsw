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

  const [selectedObraSociales, setSelectedObraSociales] = useState(null);
  const [hasChanges, setHasChanges] = useState(false); // Estado para rastrear cambios
  const [, setOriginalData] = useState({}); // Datos originales para comparar
  const navigate = useNavigate();
  const { doctorId } = useParams(); // Usa useParams para obtener el doctorId desde la URL

  const [selectedDoctorId, setSelectedDoctorId] = useState(doctorId || '');

  const [formData, setFormData] = useState({
    doctorId: '',
    dni: '',
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

    // Alerta de confirmación
    const result = await window.confirmDialog(
      'Guardar cambios',
      '¿Estás seguro que deseas guardar los cambios?'
    );

    if (result.isConfirmed) {
      try {
        console.log('Datos a enviar:', formData);

        // Verificar que el token existe
        const token = localStorage.getItem('token');
        if (!token) {
          window.notifyError(
            'Error de autenticación. Por favor, inicia sesión nuevamente.'
          );
          navigate('/login');
          return;
        }

        // Preparar datos para actualizar user (solo los campos que espera el backend)
        const usuarioData = {
          dni: formData.dni,
          nationalId: formData.dni ? Number(formData.dni) : undefined,
          name: formData.name,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          healthInsuranceId: formData.healthInsuranceId,
        };

        // Preparar datos para actualizar doctor
        const doctorData = {
          doctorId: formData.doctorId,
          appointmentDuration: formData.appointmentDuration,
          password: formData.password,
        };

        console.log('Datos user:', usuarioData);
        console.log('Datos doctor:', doctorData);

        const response = await updateUser(usuarioData);
        console.log('Respuesta de actualización user:', response);

        const responseDoctor = await updateDoctor(doctorData);
        console.log('Respuesta de actualización doctor:', responseDoctor);

        if (
          response &&
          response.data &&
          responseDoctor &&
          responseDoctor.data
        ) {
          console.log('Usuario y doctor actualizados con éxito');
          window.notifySuccess('Usuario actualizado con éxito');
          setHasChanges(false);
          navigate('/admin/createDoctor');
        } else {
          console.log('Error: respuesta incompleta', {
            response,
            responseDoctor,
          });
          window.notifyError('Error al actualizar el user o doctor');
        }
      } catch (error) {
        console.error('Error completo al actualizar:', error);
        if (error.response?.status === 403) {
          window.notifyError('No tienes permisos para realizar esta acción');
        } else if (error.response?.status === 401) {
          window.notifyError(
            'Sesión expirada. Por favor, inicia sesión nuevamente.'
          );
          navigate('/login');
        } else {
          window.notifyError(
            'Error al actualizar el user: ' +
              (error.message || 'Error desconocido')
          );
        }
      }
    }
  };

  useEffect(() => {
    getHealthInsurances();
    // Cargar lista de doctors para el selector
    getDoctors();
    // Si viene doctorId en la URL, cargar datos de ese doctor
    if (doctorId) getDoctorById(doctorId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId]);

  // Set formData after all dependencies are loaded
  useEffect(() => {
    // Autocomplete when doctor data is available
    if (healthInsurances.length > 0 && doctor && doctor.doctorId) {
      // Map backend fields to form fields
      const matchedObra = healthInsurances.find((os) => os.name === doctor.healthInsurance);
      const healthInsuranceId = matchedObra ? matchedObra.healthInsuranceId : '';

      setFormData((prevFormData) => ({
        ...prevFormData,
        doctorId: doctor.doctorId || doctorId,
        dni: doctor.nationalId || '',
        name: doctor.firstName || '',
        lastName: doctor.lastName || '',
        phone: doctor.phone || '',
        email: doctor.email || '',
        address: doctor.address || '',
        healthInsuranceId: healthInsuranceId,
        appointmentDuration: doctor.appointmentDuration || '',
        password: '',
      }));

      setSelectedObraSociales(
        healthInsuranceId
          ? { value: healthInsuranceId, label: matchedObra.name }
          : null
      );

      // Guardar datos originales
      setOriginalData({
        doctorId: doctor.doctorId || doctorId,
        dni: doctor.nationalId || '',
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
  const handleObraSocialChange = (selectedOption) => {
    setSelectedObraSociales(selectedOption);
    setFormData((prevFormData) => ({
      ...prevFormData,
      healthInsuranceId: selectedOption.value,
    }));
    setHasChanges(true); // Marca como cambiado al modificar la obra social
  };

  // Función para manejar el regreso a la lista de doctors
  const handleRegresar = async () => {
    if (hasChanges) {
      // Si hay cambios, muestra advertencia
      const result = await window.confirmDialog(
        'Cambios sin guardar',
        'Tienes cambios sin guardar. ¿Estás seguro de que quieres volver? Los cambios se perderán.'
      );

      if (result.isConfirmed) {
        navigate('/admin/createDoctor');
      }
    } else {
      // Si no hay cambios, navega de regreso directamente
      navigate('/admin/createDoctor');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <div>
          <p className="text-center text-gray-600 text-lg">Seleccione doctor</p>
          <Select
            options={doctors.map((d) => ({ value: String(d.doctorId), label: d.fullName }))}
            onChange={handleDoctorSelect}
            value={doctors.find((d) => String(d.doctorId) === String(selectedDoctorId)) ? { value: String(selectedDoctorId), label: doctors.find((d) => String(d.doctorId) === String(selectedDoctorId)).fullName } : null}
            className="react-select mb-4"
            placeholder="Elija un doctor..."
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
            <p className="text-center text-gray-600 text-lg">Obra social</p>
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
          <div>
            <p className="text-center text-gray-600 text-lg">
              Duración del appointment (minutos)
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
              required
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
          onClick={handleRegresar}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors mt-4"
        >
          Volver
        </button>
      </div>
    </div>
  );
}



