/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePacientes } from "../../context/paciente/PacientesProvider";
import Select from "react-select";
import "../../estilos/sacarturno.css";
import "../../estilos/home.css";

export function DatosPersonales() {
  const {
    login,
    obraSociales,
    ObtenerObraSociales,
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    CrearUsuario(formData);
    login({ dni: formData.dni, fechaNacimiento: formData.fechaNacimiento });
    navigate("/paciente");
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
    <div className="home=container">
      <form onSubmit={handleSubmit} className="form">
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
    </div>
  );
}
