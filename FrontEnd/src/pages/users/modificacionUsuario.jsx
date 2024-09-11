import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import '../../estilos/sacarturno.css';
import { usePacientes } from '../../context/paciente/PacientesProvider';

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
    const response = await ActualizarUsuario(formData);

    if (response.data) {
      console.log('Usuario actualizado con éxito');
      navigate('/paciente');
    } else {
      console.log('Error al actualizar usuario');
    }
  };

  useEffect(() => {
    comprobarToken();
    ObtenerObraSociales();
    ObtenerUsuarioDni();
  }, []);

  // Este useEffect se ejecuta una vez que los datos de usuarioDni y obraSociales están cargados.
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
    <div className="container">
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
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
}


/*
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import '../../estilos/sacarturno.css';
import { usePacientes } from '../../context/paciente/PacientesProvider';

export function EditarDatosPersonales() {
  const {
    usuarioDni,
    ObtenerUsuarioDni,
    comprobarToken,
    ObtenerObraSociales,
    obraSociales,
    ActualizarUsuario,
  } = usePacientes();
  const [obrasociales, setObraSociales] = useState([]);
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
    const response = await ActualizarUsuario(formData);

    if (response.data) {
      console.log('Usuario actualizado con éxito');
      navigate('/paciente');
    } else {
      console.log('Error al actualizar usuario');
    }
  };

  useEffect(() => {
    comprobarToken();
    ObtenerObraSociales();
    ObtenerUsuarioDni();
    const user = usuarioDni;
    setFormData({
      ...formData,
      nombre: user.nombre,
      apellido: user.apellido,
      telefono: user.telefono,
      email: user.email,
      direccion: user.direccion,
      idObraSocial: user.idObraSocial,
    });
    setSelectedObraSociales({
      value: user.idObraSocial,
      label:
        obraSociales.find((os) => os.idObraSocial === user.idObraSocial)
          ?.nombre || 'No asignada',
    });
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
          options={obrasociales.map((obrasociales) => ({
            value: obrasociales.idObraSocial,
            label: obrasociales.nombre,
          }))}
          onChange={handleObraSocialChange}
          value={selectedObraSociales}
        />
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
}
*/