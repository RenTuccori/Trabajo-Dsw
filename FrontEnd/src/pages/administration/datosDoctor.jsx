/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useAdministracion } from "../../context/administracion/AdministracionProvider.jsx";
import { toast } from "react-toastify"; // Para mostrar notificaciones
import "react-toastify/dist/ReactToastify.css"; // Estilos de toastify

export function DatosPersonales() {
  const {
    obraSociales,
    ObtenerObraSociales,
    CrearUsuario,
    createDoctor,
  } = useAdministracion();
  const [selectedObraSociales, setSelectedObraSociales] = useState(null);
  const [usuarioCreado, setUsuarioCreado] = useState(false); // Para manejar el flujo de creación de usuario y doctor
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dni: "",
    fechaNacimiento: "",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    direccion: "",
    idObraSocial: "",
  });

  const [doctorData, setDoctorData] = useState({
    duracionTurno: "",
    contra: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleDoctorInputChange = (e) => {
    const { name, value } = e.target;
    setDoctorData((prevDoctorData) => ({
      ...prevDoctorData,
      [name]: value,
    }));
  };

  const handleSubmitUsuario = async (e) => {
    e.preventDefault();
    try {
      await CrearUsuario(formData); // Crea el usuario
      setUsuarioCreado(true); // Marca que el usuario ha sido creado
      toast.success('Usuario creado con éxito. Ahora complete los datos del doctor.');
    } catch (error) {
      toast.error('Error al crear el usuario');
      console.error('Error al crear usuario:', error);
    }
  };

  const handleSubmitDoctor = async (e) => {
    e.preventDefault();
    try {
      const { dni } = formData;
      await createDoctor({ dni, ...doctorData }); // Crea el doctor utilizando el DNI del usuario creado
      toast.success('¡Doctor creado con éxito!');
      navigate("/admin"); // Redirige después de crear el doctor
    } catch (error) {
      toast.error('Error al crear el doctor');
      console.error('Error al crear doctor:', error);
    }
  };

  useEffect(() => {
    ObtenerObraSociales();
  }, []);

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
        {/* Formulario para crear usuario */}
        {!usuarioCreado && (
          <form onSubmit={handleSubmitUsuario} className="space-y-4">
            <div>
              <p className="text-center text-gray-600 text-lg">DNI</p>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <p className="text-center text-gray-600 text-lg">Fecha de Nacimiento</p>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300
