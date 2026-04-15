import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { usePatients } from '../../context/patients/PatientsProvider';

export function UserModification() {
  const {
    userByDni,
    getUserByDniFunction,
    getHealthInsurances,
    healthInsurances,
    updateUserFunction,
  } = usePatients();
  const [selectedObraSociales, setSelectedObraSociales] = useState(null);
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

  const getInsuranceId = (insurance) => insurance?.id ?? insurance?.healthInsuranceId ?? insurance?.idInsuranceCompany;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Alerta de confirmación
    const result = await window.confirmDialog(
      'Guardar Cambios',
      '¿Estás seguro que deseas guardar los cambios?'
    );

    if (result.isConfirmed) {
      // Ensure we send a valid nationalId: prefer form dni, fallback to userByDni.nationalId
      const payload = {
        ...formData,
        dni: formData.dni || userByDni?.nationalId || userByDni?.id || formData.dni,
      };

      try {
        const response = await updateUserFunction(payload);

        if (response && response.data && (response.status === 200 || response.data.message === 'User updated')) {
          window.notifySuccess('Usuario actualizado con éxito');
          navigate('/patient');
        } else {
          const msg = response?.data?.message || 'No se pudo actualizar el usuario';
          await window.confirmDialog('Error', msg, 'error');
        }
      } catch (error) {
        console.error('💥 FRONTEND - Error en handleSubmit:', error);
        const backendMessage = error?.message || error?.data?.message || 'Ocurrió un error al actualizar el usuario';
        await window.confirmDialog('Error', backendMessage, 'error');
      }
    }
  };

  useEffect(() => {
    
    getHealthInsurances();
    getUserByDniFunction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userByDni && healthInsurances.length > 0) {
      
      const insuranceId = userByDni.healthInsuranceId ?? userByDni.idInsuranceCompany;
      
      // Buscar la obra social correspondiente
      const matchingInsurance = (healthInsurances || []).find((os) =>
        String(getInsuranceId(os)) === String(insuranceId)
      );
      
      setFormData({
        dni: userByDni.nationalId || userByDni.dni,
        name: userByDni.firstName || userByDni.name || '', // Mapear firstName a name
        lastName: userByDni.lastName,
        phone: userByDni.phone,
        email: userByDni.email,
        address: userByDni.address,
        healthInsuranceId: insuranceId || '', // Mapear campo correcto
      });

      setSelectedObraSociales({
        value: insuranceId || '',
        label: matchingInsurance?.name || 'No asignada',
      });
      
      console.log('✅ FRONTEND - Obra social seleccionada:', {
        value: insuranceId,
        label: matchingInsurance?.name || 'No asignada',
      });
    }
  }, [userByDni, healthInsurances]);

  const handleObraSocialChange = (selectedOption) => {
    setSelectedObraSociales(selectedOption);
    setFormData((prevFormData) => ({
      ...prevFormData,
      healthInsuranceId: selectedOption.value,
    }));
  };

  return (
    <div className="page-bg p-6 lg:p-10 flex items-center justify-center min-h-[80vh]">
      <div className="glass-solid p-8 lg:p-10 rounded-3xl shadow-glass animate-slide-up w-full max-w-lg">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">Modificar datos</h1>
        <p className="text-gray-500 text-sm mb-6">Actualizá tu información personal</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Nombre</label>
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
            <label className="label">Apellido</label>
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
            <label className="label">Dirección</label>
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
            <label className="label">Teléfono</label>
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
            <label className="label">Email</label>
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
            <label className="label">Obra Social</label>
            <Select
              options={(healthInsurances || []).map((obrasociales) => {
                return {
                  value: getInsuranceId(obrasociales),
                  label: obrasociales.name,
                };
              })}
              onChange={handleObraSocialChange}
              value={selectedObraSociales}
              className="react-select"
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
          >
            Guardar cambios
          </button>
          <button
            type="button"
            onClick={() => navigate('/patient')}
            className="btn-ghost"
          >
            Volver
          </button>
        </form>
      </div>
    </div>
  );
}



