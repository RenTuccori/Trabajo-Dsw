import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
import Select from 'react-select';
import { useAdministracion } from '../../context/administracion/AdministracionProvider';

export function ActualizarDoctor() {
  const {
    fetchHealthInsurance,
    healthInsuranceList,
    doctor,
    fetchDoctorById,
    updateUserData,
    updateDoctorData,
  } = useAdministracion();

  const [selectedObraSociales, setSelectedObraSociales] = useState(null);
  const [hasChanges, setHasChanges] = useState(false); // State to track changes
  const [, setOriginalData] = useState({}); // Original data for comparison
  const navigate = useNavigate();
  const { idDoctor } = useParams(); // Use useParams to get idDoctor from the URL

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
    setHasChanges(true); // Mark as changed when modifying a field
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Confirmation alert
    const result = await window.confirmDialog(
      'Guardar cambios',
      '¿Estás seguro que deseas guardar los cambios?'
    );

    if (result.isConfirmed) {
      try {

        // Verify that the token exists
        const token = localStorage.getItem('token');
        if (!token) {
          window.notifyError(
            'Error de autenticación. Por favor, inicia sesión nuevamente.'
          );
          navigate('/login');
          return;
        }

        // Prepare data to update user (only fields expected by the backend)
        const usuarioData = {
          dni: formData.dni,
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono,
          email: formData.email,
          direccion: formData.direccion,
          idObraSocial: formData.idObraSocial,
        };

        // Prepare data to update doctor
        const doctorData = {
          idDoctor: formData.idDoctor,
          duracionTurno: formData.duracionTurno,
          contra: formData.contra,
        };

        const response = await updateUserData(usuarioData);

        const responseDoctor = await updateDoctorData(doctorData);

        if (
          response &&
          response.data &&
          responseDoctor &&
          responseDoctor.data
        ) {
          window.notifySuccess('Usuario actualizado con éxito');
          setHasChanges(false);
          navigate('/admin/crearDoc');
        } else {
          window.notifyError('Error al actualizar el usuario o doctor');
        }
      } catch (error) {
        if (error.response?.status === 403) {
          window.notifyError('No tienes permisos para realizar esta acción');
        } else if (error.response?.status === 401) {
          window.notifyError(
            'Sesión expirada. Por favor, inicia sesión nuevamente.'
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
    fetchHealthInsurance();
    fetchDoctorById(idDoctor); // Call the function with idDoctor obtained from the URL
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idDoctor]);

  // Set formData after all dependencies are loaded
  useEffect(() => {
    if (healthInsuranceList.length > 0 && doctor.dni) {
      // Ensure all necessary data is available before setting formData
      setFormData((prevFormData) => ({
        ...prevFormData,
        idDoctor: idDoctor,
        dni: doctor.dni,
        nombre: doctor.nombre,
        apellido: doctor.apellido,
        telefono: doctor.telefono,
        email: doctor.email,
        direccion: doctor.direccion,
        idObraSocial: doctor.idObraSocial,
        duracionTurno: doctor.duracionTurno,
        contra: doctor.contra,
      }));

      setSelectedObraSociales({
        value: doctor.idObraSocial,
        label:
          healthInsuranceList.find((os) => os.idObraSocial === doctor.idObraSocial)
            ?.nombre || 'No asignada',
      });

      // Save original data
      setOriginalData({
        idDoctor: idDoctor,
        dni: doctor.dni,
        nombre: doctor.nombre,
        apellido: doctor.apellido,
        telefono: doctor.telefono,
        email: doctor.email,
        direccion: doctor.direccion,
        idObraSocial: doctor.idObraSocial,
        duracionTurno: doctor.duracionTurno,
        contra: doctor.contra,
      });
    }
  }, [healthInsuranceList, doctor]);
  const handleObraSocialChange = (selectedOption) => {
    setSelectedObraSociales(selectedOption);
    setFormData((prevFormData) => ({
      ...prevFormData,
      idObraSocial: selectedOption.value,
    }));
    setHasChanges(true); // Mark as changed when modifying health insurance
  };

  // Function to handle going back to the doctor list
  const handleRegresar = async () => {
    if (hasChanges) {
      // If there are changes, show warning
      const result = await window.confirmDialog(
        'Cambios sin guardar',
        'Tienes cambios sin guardar. ¿Estás seguro de que quieres volver? Los cambios se perderán.'
      );

      if (result.isConfirmed) {
        navigate('/admin/crearDoc');
      }
    } else {
      // If no changes, navigate back directly
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
          </div>{' '}
          <div>
            <p className="text-center text-gray-600 text-lg">Obra social</p>
            <Select
              options={healthInsuranceList.map((obrasociales) => ({
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
              name="duracionTurno"
              value={formData.duracionTurno}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <p className="text-center text-gray-600 text-lg">Contraseña</p>
            <input
              type="password"
              name="contra"
              value={formData.contra}
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
