import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../estilos/home.css';
import { useAdministracion } from '../../context/administracion/AdministracionProvider.jsx';

export function CrearObraSocial() {
  const navigate = useNavigate();
  const { obrasSociales, crearObraSocial, ObtenerOS, borrarObraSocial, actualizarObraSocial } = useAdministracion();
  const [nombreObraSocial, setNombreObraSocial] = useState('');
  const [nuevoNombreObraSocial, setNuevoNombreObraSocial] = useState(''); // Estado para el nuevo nombre
  const [obraSocialAEditar, setObraSocialAEditar] = useState(null); // Estado para saber qué obra social estamos editando
  const [mensajeExito, setMensajeExito] = useState(''); // Estado para el mensaje de éxito

  useEffect(() => {
    ObtenerOS();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCrearObraSocial = async (e) => {
    e.preventDefault();
    if (nombreObraSocial.trim() !== '') {
      await crearObraSocial({ nombre: nombreObraSocial });
      setNombreObraSocial('');
      setMensajeExito('¡Obra Social creada con éxito!');
      setTimeout(() => setMensajeExito(''), 5000);
      ObtenerOS();
    }
  };

  const handleBorrarObraSocial = async (idObraSocial) => {
    try {
      await borrarObraSocial(idObraSocial);
      setMensajeExito('¡Obra Social eliminada con éxito!');
      setTimeout(() => setMensajeExito(''), 5000);
      ObtenerOS();
    } catch (error) {
      setMensajeExito('No se puede eliminar esta obra social');
      setTimeout(() => setMensajeExito(''), 5000);
      console.error('Error al borrar obra social:', error);
    }
  };

  const handleActualizarObraSocial = async (e) => {
    e.preventDefault();
    if (obraSocialAEditar && nuevoNombreObraSocial.trim() !== '') {
      try {
        console.log('Actualizando obra social:', obraSocialAEditar, nuevoNombreObraSocial);
        await actualizarObraSocial({ idObraSocial: obraSocialAEditar, nombre: nuevoNombreObraSocial });
        setMensajeExito('¡Obra Social actualizada con éxito!');
        setTimeout(() => setMensajeExito(''), 5000);
        setObraSocialAEditar(null); // Resetear el estado de edición
        setNuevoNombreObraSocial(''); // Limpiar el campo de nombre
        ObtenerOS();
      } catch (error) {
        setMensajeExito('No se puede actualizar esta obra social');
        setTimeout(() => setMensajeExito(''), 5000);
        console.error('Error al actualizar obra social:', error);
      }
    }
  };

  return (
    <div>
      <h2>Crear Nueva Obra Social</h2>

      {/* Mostrar mensaje de éxito si existe */}
      {mensajeExito && (
        <div className="mensaje-exito visible">
          {mensajeExito}
        </div>
      )}

      {/* Formulario para crear una nueva obra social */}
      <form onSubmit={handleCrearObraSocial}>
        <input
          type="text"
          placeholder="Nombre de la obra social"
          value={nombreObraSocial}
          onChange={(e) => setNombreObraSocial(e.target.value)}
        />
        <button type="submit">Crear Obra Social</button>
      </form>

      {/* Formulario para actualizar una obra social */}
      {obraSocialAEditar && (
        <form onSubmit={handleActualizarObraSocial}>
          <input
            type="text"
            placeholder="Nuevo nombre de la obra social"
            value={nuevoNombreObraSocial}
            onChange={(e) => setNuevoNombreObraSocial(e.target.value)}
          />
          <button type="submit">Actualizar Obra Social</button>
          <button type="button" onClick={() => setObraSocialAEditar(null)}>Cancelar</button>
        </form>
      )}

      <button type="button" onClick={() => navigate('/admin')}>Volver</button>

      <h3>Obras Sociales Creadas</h3>
      <ul>
        {obrasSociales.length > 0 ? (
          obrasSociales.map((obraSocial) => (
            <li key={obraSocial.idObraSocial}>
              <strong>{obraSocial.nombre}</strong>
              <button
                onClick={() => handleBorrarObraSocial(obraSocial.idObraSocial)}
                className="delete-button"
                style={{ marginLeft: '10px', color: 'red' }}
              >
                Delete
              </button>

              {/* Botón para activar el formulario de actualización */}
              <button
                onClick={() => {
                  setObraSocialAEditar(obraSocial.idObraSocial);
                  setNuevoNombreObraSocial(obraSocial.nombre); // Prellena el campo con el nombre actual
                }}
                className="update-button"
                style={{ marginLeft: '10px', color: 'blue' }}
              >
                Actualizar
              </button>
            </li>
          ))
        ) : (
          <p>No hay obras sociales creadas aún.</p>
        )}
      </ul>
    </div>
  );
}
