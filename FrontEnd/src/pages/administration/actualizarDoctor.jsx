import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Importa useParams
import Select from 'react-select';
import { useAdministracion } from '../../context/administracion/AdministracionProvider';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import { toast } from 'react-toastify'; // Importa toast

export function ActualizarDoctor() {
  const {
    comprobarToken,
    ObtenerOS,
    obrasSociales,
    doctor,
    ObtenerDoctorPorId,
    actualizarUsuario,
    actualizarDoctor,
  } = useAdministracion();

  const [selectedObraSociales, setSelectedObraSociales] = useState(null);
  const navigate = useNavigate();
  const { idDoctor } = useParams(); // Usa useParams para obtener el idDoctor desde la URL

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
      const response = await actualizarUsuario(formData);
      const responseDoctor = await actualizarDoctor(formData);
      console.log(response.data, responseDoctor.data);
      if (response.data && responseDoctor.data) {
        console.log('Usuario actualizado con éxito');
        toast.success('Usuario actualizado con éxito'); // Toast de éxito
        navigate('/admin/crearDoc'); // Redirige a la lista de doctores
      } else {
        console.log('Error al actualizar usuario');
        Swal.fire('Error', 'No se pudo actualizar el usuario', 'error'); // Mensaje de error
      }
    }
  };

  useEffect(() => {
    comprobarToken();
    ObtenerOS();
    ObtenerDoctorPorId(idDoctor); // Llama a la función con el idDoctor obtenido de la URL
  }, [idDoctor]);

  // Set formData after all dependencies are loaded
  useEffect(() => {
    if (obrasSociales.length > 0 && doctor.dni) {
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
          obrasSociales.find((os) => os.idObraSocial === doctor.idObraSocial)
            ?.nombre || 'No asignada',
      });
    }
  }, [obrasSociales, doctor]);
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
              options={obrasSociales.map((obrasociales) => ({
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
              Duración del Turno (minutos)
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
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
}
