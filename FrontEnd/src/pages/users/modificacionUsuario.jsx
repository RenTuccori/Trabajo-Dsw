import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { usePacientes } from '../../context/paciente/PacientesProvider';
import { useAuth } from '../../context/global/AuthProvider';
import { confirmDialog } from '../../components/SwalConfig.jsx';
import { notifySuccess, notifyError } from '../../components/ToastConfig';

export function ModificacionUsuario() {
  const {
    usuarioDni,
    ObtenerUsuarioDni,
    ObtenerObraSociales,
    obraSociales,
    ActualizarUsuario,
  } = usePacientes();
  const {
    comprobarToken,
    userType
  } = useAuth();
  const [selectedObraSociales, setSelectedObraSociales] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dni: '',
    fechaNacimiento: '',
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    direccion: '',
    idObraSocial: '',
  });

  // Get home route based on user type
  const getHomeRoute = () => {
    switch(userType) {
      case 'D': return '/doctor';
      case 'A': return '/admin'; 
      case 'P': return '/paciente';
      default: return '/paciente';
    }
  };

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
    const result = await confirmDialog(
      'Guardar Cambios',
      '¿Estás seguro que deseas guardar los cambios?'
    );

    if (result.isConfirmed) {
      try {
        const response = await ActualizarUsuario(formData);

        if (response && response.data) {
          console.log('Usuario actualizado con éxito');
          notifySuccess('Datos guardados exitosamente'); // Toast de éxito
          navigate(getHomeRoute());
        } else {
          console.log('Error al actualizar usuario');
          notifyError('No se pudo actualizar el usuario'); // Mensaje de error
        }
      } catch (error) {
        console.error('Error al actualizar usuario:', error);
        notifyError('Error al guardar los datos. Intente nuevamente.'); // Mensaje de error más específico
      }
    }
  };

  useEffect(() => {
    comprobarToken('P');
    ObtenerObraSociales();
    ObtenerUsuarioDni();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => {
    if (usuarioDni && obraSociales.length > 0) {
      setFormData({
        dni: usuarioDni.dni || '',
        nombre: usuarioDni.nombre || '',
        apellido: usuarioDni.apellido || '',
        telefono: usuarioDni.telefono || '',
        email: usuarioDni.email || '',
        direccion: usuarioDni.direccion || '',
        idObraSocial: usuarioDni.idObraSocial || '',
      });

      setSelectedObraSociales({
        value: usuarioDni.idObraSocial || '',
        label:
          obraSociales.find((os) => os.idObraSocial === usuarioDni.idObraSocial)
            ?.nombre || 'No asignada',
      });
    }
  }, [usuarioDni, obraSociales]);

  const handleObraSocialChange = (selectedOption) => {
    setSelectedObraSociales(selectedOption);
    setFormData((prevFormData) => ({
      ...prevFormData,
      idObraSocial: selectedOption.value,
    }));
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
              value={formData.nombre || ''}
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
              value={formData.apellido || ''}
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
              value={formData.direccion || ''}
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
              value={formData.telefono || ''}
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
              value={formData.email || ''}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <p className="text-center text-gray-600 text-lg">Obra Social</p>
            <Select
              options={(obraSociales || []).map((obrasociales) => ({
                value: obrasociales.idObraSocial,
                label: obrasociales.nombre,
              }))}
              onChange={handleObraSocialChange}
              value={selectedObraSociales}
              className="react-select"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
}
