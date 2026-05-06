import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import {
  getUserByNationalId,
  createUser as createUserApi,
  deleteUser as deleteUserApi
} from '../../api/users.api.js';
import { getPatients, createPatient } from '../../api/patients.api.js';
import { getInsurance } from '../../api/insurance.api.js';
import { confirmDialog } from '../../components/SwalConfig.jsx';

export function CreateUser() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [healthInsurances, setHealthInsurances] = useState([]);
  const [selectedObraSociales, setSelectedObraSociales] = useState(null);
  const [usuarioExistente, setUsuarioExistente] = useState(false);
  const [formularioVisible, setFormularioVisible] = useState(false);
  const [dniABuscar, setDniABuscar] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    dni: '',
    birthDate: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    healthInsuranceId: '',
    password: '',
  });

  const fetchPatients = async () => {
    try {
      const res = await getPatients();
      setPatients(res.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchInsurances = async () => {
    try {
      const res = await getInsurance();
      setHealthInsurances(res.data);
    } catch (error) {
      console.error('Error fetching insurances:', error);
    }
  };

  useEffect(() => {
    fetchPatients();
    fetchInsurances();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleBuscarDNI = async (e) => {
    e.preventDefault();
    if (dniABuscar.trim() !== '') {
      try {
        const foundUserRes = await getUserByNationalId({ dni: dniABuscar });
        const foundUser = foundUserRes.data;
        if (foundUser && Object.keys(foundUser).length > 0) {
          setUsuarioExistente(true);
          window.notifyError('El paciente ya existe en el sistema.');
          setFormularioVisible(false);
        }
      } catch (error) {
        setUsuarioExistente(false);
        window.notifySuccess('Usuario no encontrado, complete los datos para crearlo.');
        setFormularioVisible(true);
      }
    } else {
      window.notifyError('Ingrese un DNI válido');
    }
  };

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    try {
      if (!usuarioExistente) {
        if (!formData.password || !formData.firstName || !formData.lastName) {
          window.notifyError('Complete todos los campos para crear al usuario');
          return;
        }
        // Creamos al usuario base (que ya pasa a ser paciente)
        await createUserApi({ ...formData, dni: dniABuscar, nationalId: dniABuscar });
      }
      
      window.notifySuccess('¡Paciente creado con éxito!');
      
      setFormData({
        dni: '', birthDate: '', firstName: '', lastName: '', phone: '', email: '', address: '', healthInsuranceId: '', password: '',
      });
      setDniABuscar('');
      setFormularioVisible(false);
      setUsuarioExistente(false);
      setSelectedObraSociales(null);
      await fetchPatients();
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || 'Error al crear el paciente';
      window.notifyError(msg);
      console.error('Error al crear paciente:', error);
    }
  };

  const handleObraSocialChange = (selectedOption) => {
    setSelectedObraSociales(selectedOption);
    setFormData({ ...formData, healthInsuranceId: selectedOption ? selectedOption.value : '' });
  };

  const handleDelete = async (nationalId) => {
    const result = await confirmDialog(
      '¿Eliminar paciente?',
      `¿Estás seguro de que deseas eliminar al paciente con DNI ${nationalId}? Esta acción deshabilitará al usuario.`
    );
    if (!result.isConfirmed) return;

    try {
      await deleteUserApi(nationalId);
      window.notifySuccess(`Paciente con DNI ${nationalId} borrado.`);
      await fetchPatients();
    } catch (error) {
      window.notifyError(`Error al borrar el paciente ${nationalId}`);
      console.error(`Error al borrar el paciente ${nationalId}:`, error);
    }
  };

  const handleUpdate = (nationalId) => {
    navigate(`/admin/updatePatient/${nationalId}`);
  };

  const filteredPatients = patients.filter((patient) => {
    const term = searchTerm.toLowerCase();
    const fullName = `${patient.name} ${patient.lastName}`.toLowerCase();
    const dni = patient.nationalId.toString();
    return fullName.includes(term) || dni.includes(term);
  });

  return (
    <div className="page-bg p-6 lg:p-10">
      <div className="max-w-3xl mx-auto animate-slide-up space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin')} className="btn-ghost text-sm">← Volver</button>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">Gestionar Pacientes</h2>
        </div>
        
        <div className="glass-solid rounded-2xl p-6 lg:p-8 space-y-5">
            <h3 className="text-lg font-bold text-gray-900">Crear Nuevo Paciente</h3>
            {!formularioVisible && (
              <form onSubmit={handleBuscarDNI} className="space-y-4">
                <div>
                  <p className="label text-center">Por favor, ingresa el DNI del paciente que quieres crear</p>
                  <input type="text" value={dniABuscar} onChange={(e) => setDniABuscar(e.target.value)} className="input" required />
                </div>
                <button type="submit" className="btn-primary">Buscar usuario</button>
              </form>
            )}

            {formularioVisible && (
              <>
                {!usuarioExistente && (
                  <form onSubmit={handleCreatePatient} className="space-y-4">
                    <div>
                      <p className="label text-center">Fecha de nacimiento</p>
                      <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} required className="input" />
                    </div>
                    <div>
                      <p className="label text-center">Nombre</p>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="input" />
                    </div>
                    <div>
                      <p className="label text-center">Apellido</p>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="input" />
                    </div>
                    <div>
                      <p className="label text-center">Dirección</p>
                      <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="input" />
                    </div>
                    <div>
                      <p className="label text-center">Teléfono</p>
                      <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="input" />
                    </div>
                    <div>
                      <p className="label text-center">Email</p>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="input" />
                    </div>
                    <div>
                      <p className="label text-center">Obra social</p>
                      <Select
                        options={healthInsurances.map((os) => ({ value: os.id, label: os.name }))}
                        onChange={handleObraSocialChange}
                        value={selectedObraSociales}
                        placeholder="Seleccione la obra social"
                        isClearable
                        className="react-select"
                      />
                    </div>
                    <div>
                      <p className="label text-center">Contraseña</p>
                      <input type="password" name="password" value={formData.password} onChange={handleInputChange} required className="input" />
                    </div>
                    <button type="submit" className="btn-primary">Crear Paciente</button>
                  </form>
                )}
              </>
            )}
        </div>

        <div className="glass-solid rounded-2xl p-6 lg:p-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h3 className="text-lg font-bold text-gray-900">Pacientes Registrados</h3>
            <input 
              type="text" 
              placeholder="Buscar por nombre, apellido o DNI..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input md:w-1/2"
            />
          </div>
          <ul className="space-y-2">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <li key={patient.patientId} className="glass-list-item flex justify-between items-center gap-4">
                  <span>
                    <strong>{patient.name} {patient.lastName}</strong> - DNI: {patient.nationalId}
                  </span>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleDelete(patient.nationalId)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-coral-50 text-coral-500 hover:bg-coral-100 transition-colors"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => handleUpdate(patient.nationalId)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors"
                    >
                      Actualizar
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-600">No hay pacientes registrados aún.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
