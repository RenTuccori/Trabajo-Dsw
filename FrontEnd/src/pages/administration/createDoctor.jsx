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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedObraSociales, setSelectedObraSociales] = useState(null);

  const [formData, setFormData] = useState({
    dni: '',
    birthDate: '',
    firstName: '',
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
        const foundUser = await getUserByDni(dni);
        if (foundUser && Object.keys(foundUser).length > 0) {
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
        setFormularioVisible(true);
      } catch (error) {
        if (error.response && error.response.status === 404) {
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
        const msg = error?.response?.data?.message || error?.message || 'Error al crear el doctor';
        window.notifyError(msg);
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

  const filteredDoctors = doctors.filter((doctor) => {
    const term = searchTerm.toLowerCase();
    const fullName = doctor.fullName.toLowerCase();
    return fullName.includes(term) || (doctor.nationalId && doctor.nationalId.toString().includes(term));
  });

  return (
    <div className="page-bg p-6 lg:p-10">
      <div className="max-w-3xl mx-auto animate-slide-up space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin')} className="btn-ghost text-sm">← Volver</button>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">Crear Doctor</h2>
        </div>
        <div className="glass-solid rounded-2xl p-6 lg:p-8 space-y-5">
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
              Buscar usuario
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
                    name="firstName"
                    value={formData.firstName}
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
                    Duración del turno (en minutos)
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
                  placeholder="Duración del turno (en minutos)"
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

        </div>

        <div className="glass-solid rounded-2xl p-6 lg:p-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h3 className="text-lg font-bold text-gray-900">
            Doctores creados
          </h3>
          <input 
            type="text" 
            placeholder="Buscar por nombre..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input md:w-1/2"
          />
        </div>
        <ul className="space-y-2">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <li
                key={doctor.doctorId}
                className="glass-list-item flex justify-between items-center gap-4"
              >
                <span>
                  <strong>{doctor.fullName}</strong>
                </span>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleDelete(doctor.doctorId)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-coral-50 text-coral-500 hover:bg-coral-100 transition-colors"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => handleUpdate(doctor.doctorId)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors"
                  >
                    Actualizar
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-600">
              No hay doctores creados aún.
            </p>
          )}
        </ul>
        </div>
      </div>
    </div>
  );
}
