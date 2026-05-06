import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { getUserByNationalId, updateUser } from '../../api/users.api.js';
import { getInsurance } from '../../api/insurance.api.js';

export function UpdateUser() {
  const { id } = useParams(); // nationalId
  const navigate = useNavigate();

  const [healthInsurances, setHealthInsurances] = useState([]);
  const [selectedObraSociales, setSelectedObraSociales] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    healthInsuranceId: '',
    password: '', // solo si desea cambiarla
  });

  useEffect(() => {
    const initData = async () => {
      try {
        const resUser = await getUserByNationalId({ dni: id });
        const user = resUser.data;
        const resInsurances = await getInsurance();
        setHealthInsurances(resInsurances.data);

        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          phone: user.phone || '',
          email: user.email || '',
          address: user.address || '',
          healthInsuranceId: user.healthInsuranceId || '',
          password: '',
        });

        if (user.healthInsuranceId) {
          const selectedOs = resInsurances.data.find((os) => os.id === user.healthInsuranceId);
          if (selectedOs) {
            setSelectedObraSociales({ value: selectedOs.id, label: selectedOs.name });
          }
        }
      } catch (error) {
        console.error('Error cargando usuario:', error);
        window.notifyError('No se pudo cargar la información del usuario.');
      }
    };
    initData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleObraSocialChange = (selectedOption) => {
    setSelectedObraSociales(selectedOption);
    setFormData({ ...formData, healthInsuranceId: selectedOption ? selectedOption.value : null });
  };

  const handleUpdatePatient = async (e) => {
    e.preventDefault();
    try {
      await updateUser({
        nationalId: id,
        name: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        healthInsuranceId: formData.healthInsuranceId,
        ...(formData.password ? { password: formData.password } : {}),
      });
      window.notifySuccess('Paciente actualizado con éxito!');
      navigate('/admin/createPatient');
    } catch (error) {
      window.notifyError('Error al actualizar el paciente');
      console.error(error);
    }
  };

  return (
    <div className="page-bg p-6 lg:p-10">
      <div className="max-w-3xl mx-auto animate-slide-up space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/createPatient')} className="btn-ghost text-sm">← Volver</button>
          <h2 className="text-2xl font-extrabold text-gray-900">Actualizar Paciente ({id})</h2>
        </div>

        <div className="glass-solid rounded-2xl p-6 lg:p-8">
          <form onSubmit={handleUpdatePatient} className="space-y-4">
            <div>
              <p className="label">Nombre</p>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="input" />
            </div>
            <div>
              <p className="label">Apellido</p>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="input" />
            </div>
            <div>
              <p className="label">Dirección</p>
              <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="input" />
            </div>
            <div>
              <p className="label">Teléfono</p>
              <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="input" />
            </div>
            <div>
              <p className="label">Email</p>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="input" />
            </div>
            <div>
              <p className="label">Obra social</p>
              <Select
                options={healthInsurances.map((os) => ({ value: os.id, label: os.name }))}
                onChange={handleObraSocialChange}
                value={selectedObraSociales}
                isClearable
                placeholder="Seleccione la obra social"
                className="react-select"
              />
            </div>
            <div>
              <p className="label">Nueva Contraseña (opcional)</p>
              <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Dejar en blanco para no cambiar" className="input" />
            </div>
            <button type="submit" className="btn-primary w-full mt-4">Actualizar Paciente</button>
          </form>
        </div>
      </div>
    </div>
  );
}
