import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../estilos/home.css';
import { useAdministracion } from '../../context/administracion/AdministracionProvider.jsx';

export function CrearEspecialidad() {
  const navigate = useNavigate();
  const { crearEspecialidad } = useAdministracion();
  const [nombreEspecialidad, setNombreEspecialidad] = useState('');
  const [mensajeExito, setMensajeExito] = useState(''); // Nuevo estado para mensaje de éxito

  useEffect(() => {
    // ObtenerEspecialidades();
  }, []);

  const handleCrearEspecialidad = async (e) => {
    e.preventDefault();
    if (nombreEspecialidad.trim() !== '') {
      await crearEspecialidad({ nombre: nombreEspecialidad });
      setNombreEspecialidad(''); // Reiniciar el campo de texto
      setMensajeExito('Especialidad creada con éxito'); // Establecer el mensaje de éxito
      setTimeout(() => setMensajeExito(''), 3000); // Ocultar el mensaje después de 3 segundos
      // ObtenerEspecialidades();
    }
  };

  return (
    <div className="crear-especialidad-form">
      <h2>Crear Especialidad</h2>
      {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>} {/* Mostrar el mensaje si existe */}
      <form onSubmit={handleCrearEspecialidad}>
        <div>
          <label htmlFor="nombre">Nombre de la Especialidad:</label>
          <input
            type="text"
            id="nombre"
            value={nombreEspecialidad}
            onChange={(e) => setNombreEspecialidad(e.target.value)}
            required
          />
        </div>
        <button type="submit">Crear</button>
        <button type="button" onClick={() => navigate('/admin')} >Volver</button>
      </form>
    </div>
  );
}
