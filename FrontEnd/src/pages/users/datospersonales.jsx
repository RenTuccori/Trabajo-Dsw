/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePacientes } from "../../context/paciente/PacientesProvider";
import Select from "react-select";
import "../../estilos/sacarturno.css";

export function DatosPersonales() {
  const {
    Login,
    dni,
    obraSociales,
    ObtenerObraSociales,
    idPacienteCreado,
    CrearPaciente,
    CrearUsuario,
  } = usePacientes();
  const [selectedObraSociales, setSelectedObraSociales] = useState(null);
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
  const [userExists, setUserExists] = useState(false); // Estado para manejar si el usuario existe o no

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleCheckUser = async (e) => {
    e.preventDefault();
    const formdni = formData.dni;
    const formfecha = formData.fechaNacimiento;
    Login({ dni: formdni, fechaNacimiento: formfecha });
    console.log(dni);
    if (dni != null) {
    navigate("/paciente/confirmacionturno"); // Redirige a una página de confirmación, si existe}
    }
  };
  const handleSubmit = async (e) => {
    console.log(dni)
    if (dni === null) {
      e.preventDefault();
      CrearUsuario(formData);
      CrearPaciente({ dni: formData.dni });
      if (!idPacienteCreado) {
        navigate("/paciente/confirmacionturno"); // Redirige a una página de confirmación, si existe
      } else {
        console.log("Error al registrar usuario");
      }
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
    <div className="container">
      {!userExists ? (
        <form onSubmit={handleCheckUser} className="form">
          <p className="text">DNI</p>
          <input
            type="text"
            name="dni"
            value={formData.dni}
            onChange={handleInputChange}
            required
          />
          <p className="text">Fecha de Nacimiento</p>
          <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Verificar</button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="form">
          <p className="text">Nombre</p>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
          />
          <p className="text">Apellido</p>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleInputChange}
            required
          />
          <p className="text">Dirección</p>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleInputChange}
            required
          />
          <p className="text">Teléfono</p>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleInputChange}
            required
          />
          <p className="text">Email</p>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <p className="text">Obra Social</p>
          <Select
            options={obraSociales.map((obrasociales) => ({
              value: obrasociales.idObraSocial,
              label: obrasociales.nombre,
            }))}
            onChange={handleObraSocialChange}
            value={selectedObraSociales}
          />
          <button type="submit">Enviar</button>
        </form>
      )}
    </div>
  );
}
