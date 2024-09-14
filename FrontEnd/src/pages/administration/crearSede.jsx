import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../estilos/home.css';
import { useAdministracion } from '../../context/administracion/AdministracionProvider.jsx';

export function CrearSede() {
  const navigate = useNavigate();
  const { sedes, crearNuevaSede, ObtenerSedes, borrarSede } = useAdministracion();
  const [nombreSede, setNombreSede] = useState('');
  const [direccionSede, setDireccionSede] = useState('');
  const [mensajeExito, setMensajeExito] = useState(''); // Estado para el mensaje de éxito

  // Obtener sedes al cargar el componente
  useEffect(() => {
    ObtenerSedes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manejar la creación de una nueva sede
  const handleCrearSede = async (e) => {
    e.preventDefault();
    if (nombreSede.trim() !== '' && direccionSede.trim() !== '') {
      await crearNuevaSede({ nombre: nombreSede, direccion: direccionSede });
      setNombreSede('');
      setDireccionSede('');
      setMensajeExito('¡Sede creada con éxito!'); // Mostrar mensaje de éxito
      setTimeout(() => setMensajeExito(''), 5000); // Ocultar mensaje después de 5 segundos
      ObtenerSedes(); // Actualizar la lista después de crear una sede
    }
  };

  const handleBorrarSede = async (idSede) => {
    await borrarSede(idSede);
    ObtenerSedes(); // Actualizar la lista después de borrar una sede
  };

  return (
    <div>
      <h2>Crear Nueva Sede</h2>

      {/* Mostrar mensaje de éxito si existe */}
      {mensajeExito && (
        <div className="mensaje-exito visible">
          {mensajeExito}
        </div>
      )}

      <form onSubmit={handleCrearSede}>
        <input
          type="text"
          placeholder="Nombre de la sede"
          value={nombreSede}
          onChange={(e) => setNombreSede(e.target.value)}
        />
        <input
          type="text"
          placeholder="Dirección de la sede"
          value={direccionSede}
          onChange={(e) => setDireccionSede(e.target.value)}
        />
        <button type="submit">Crear Sede</button>
      </form>
      <button type="button" onClick={() => navigate('/admin')}>Volver</button>

      <h3>Sedes Creadas</h3>
      <ul>
        {sedes.length > 0 ? (
          sedes.map((sede) => (
            <li key={sede.idSede}>
              <strong>{sede.nombre}</strong> - {sede.direccion}
              <button
                onClick={() => handleBorrarSede(sede.idSede)}
                className="delete-button"
                style={{ marginLeft: '10px', color: 'red' }}
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p>No hay sedes creadas aún.</p>
        )}
      </ul>
    </div>
  );
}
