import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import '../../estilos/sacarturno.css';
import { usePacientes } from '../../context/paciente/PacientesProvider';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import { toast } from 'react-toastify'; // Importa toast

export function EditarDatosPersonales() {
  const {
    usuarioDni,
    ObtenerUsuarioDni,
    comprobarToken,
    ObtenerObraSociales,
    obraSociales,
    ActualizarUsuario,
  } = usePacientes();
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
    const result = await Swal.fire({
      title: 'Guardar Cambios',
      text: '¿Estás seguro que deseas guardar los cambios?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      const response = await ActualizarUsuario(formData);

      if (response.data) {
        console.log('Usuario actualizado con éxito');
        toast.success('Usuario actualizado con éxito'); // Toast de éxito
        navigate('/paciente');
      } else {
        console.log('Error al actualizar usuario');
        Swal.fire('Error', 'No se pudo actualizar el usuario', 'error'); // Mensaje de error
      }
    }
  };

  useEffect(() => {
    comprobarToken();
    ObtenerObraSociales();
    ObtenerUsuarioDni();
  }, []);

  useEffect(() => {
    if (usuarioDni && obraSociales.length > 0) {
      setFormData({
        dni: usuarioDni.dni,
        nombre: usuarioDni.nombre,
        apellido: usuarioDni.apellido,
        telefono: usuarioDni.telefono,
        email: usuarioDni.email,
        direccion: usuarioDni.direccion,
        idObraSocial: usuarioDni.idObraSocial,
      });

      setSelectedObraSociales({
        value: usuarioDni.idObraSocial,
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
          </div>
          <div>
            <p className="text-center text-gray-600 text-lg">Obra Social</p>
            <Select
              options={obraSociales.map(obrasociales => ({
                value: obrasociales.idObraSocial,
                label: obrasociales.nombre
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
