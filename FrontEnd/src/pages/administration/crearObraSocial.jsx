import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-center text-gray-800">Crear Nueva Obra Social</h2>

        {/* Mostrar mensaje de éxito si existe */}
        {mensajeExito && (
          <div className="bg-green-100 text-green-800 p-2 rounded-lg text-center">
            {mensajeExito}
          </div>
        )}

        {/* Formulario para crear una nueva obra social */}
        {!obraSocialAEditar && (
          <form onSubmit={handleCrearObraSocial} className="space-y-4">
            <input
              type="text"
              placeholder="Nombre de la obra social"
              value={nombreObraSocial}
              onChange={(e) => setNombreObraSocial(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear Obra Social
            </button>
          </form>
        )}

        {/* Formulario para actualizar una obra social */}
        {obraSocialAEditar && (
          <form onSubmit={handleActualizarObraSocial} className="space-y-4">
            <input
              type="text"
              placeholder="Nuevo nombre de la obra social"
              value={nuevoNombreObraSocial}
              onChange={(e) => setNuevoNombreObraSocial(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <div className="flex justify-between space-x-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Actualizar
              </button>
              <button
                type="button"
                onClick={() => setObraSocialAEditar(null)}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors mt-4"
        >
          Volver
        </button>

        <h3 className="text-lg font-medium text-gray-800 mt-6">Obras Sociales Creadas</h3>
        <ul className="space-y-2">
          {obrasSociales.length > 0 ? (
            obrasSociales.map((obraSocial) => (
              <li key={obraSocial.idObraSocial} className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                <span>
                  <strong>{obraSocial.nombre}</strong>
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBorrarObraSocial(obraSocial.idObraSocial)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setObraSocialAEditar(obraSocial.idObraSocial);
                      setNuevoNombreObraSocial(obraSocial.nombre);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Actualizar
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-600">No hay obras sociales creadas aún.</p>
          )}
        </ul>
      </div>
    </div>
  );
}