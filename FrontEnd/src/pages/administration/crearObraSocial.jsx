import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdministracion } from '../../context/administracion/AdministracionProvider.jsx';
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de toastify
import { notifySuccess, notifyError } from '../../components/ToastConfig';
import { confirmDialog } from '../../components/SwalConfig';

export function CrearObraSocial() {
  const navigate = useNavigate();
  const {
    obrasSociales,
    crearObraSocial,
    ObtenerOS,
    borrarObraSocial,
    actualizarObraSocial,
  } = useAdministracion();
  const [nombreObraSocial, setNombreObraSocial] = useState('');
  const [nuevoNombreObraSocial, setNuevoNombreObraSocial] = useState('');
  const [obraSocialAEditar, setObraSocialAEditar] = useState(null);

  useEffect(() => {
    ObtenerOS();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCrearObraSocial = async (e) => {
    e.preventDefault();
    if (nombreObraSocial.trim() !== '') {
      try {
        await crearObraSocial({ nombre: nombreObraSocial });
        setNombreObraSocial('');
        notifySuccess('¡Obra Social creada con éxito!');
        ObtenerOS();
      } catch (error) {
        notifyError('Error al crear la obra social');
        console.error('Error al crear obra social:', error);
      }
    }
  };

  const handleBorrarObraSocial = async (idObraSocial) => {
    const result = await confirmDialog(
      '¿Estás seguro?',
      '¿Deseas eliminar esta obra social?'
    );

    if (result.isConfirmed) {
      try {
        await borrarObraSocial(idObraSocial);
        notifySuccess('¡Obra Social eliminada con éxito!');
        ObtenerOS();
      } catch (error) {
        notifyError('No se puede eliminar esta obra social');
        console.error('Error al borrar obra social:', error);
      }
    }
  };

  const handleActualizarObraSocial = async (e) => {
    e.preventDefault();
    if (obraSocialAEditar && nuevoNombreObraSocial.trim() !== '') {
      try {
        await actualizarObraSocial({
          idObraSocial: obraSocialAEditar,
          nombre: nuevoNombreObraSocial,
        });
        notifySuccess('¡Obra Social actualizada con éxito!');
        setObraSocialAEditar(null);
        setNuevoNombreObraSocial('');
        ObtenerOS();
      } catch (error) {
        notifyError('No se puede actualizar esta obra social');
        console.error('Error al actualizar obra social:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-center text-gray-800">
          Crear Nueva Obra Social
        </h2>

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

        <h3 className="text-lg font-medium text-gray-800 mt-6">
          Obras Sociales Creadas
        </h3>
        <ul className="space-y-2">
          {obrasSociales.length > 0 ? (
            obrasSociales.map((obraSocial) => (
              <li
                key={obraSocial.idObraSocial}
                className="bg-gray-100 p-4 rounded-lg flex justify-between items-center"
              >
                <span>
                  <strong>{obraSocial.nombre}</strong>
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      handleBorrarObraSocial(obraSocial.idObraSocial)
                    }
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
            <p className="text-center text-gray-600">
              No hay obras sociales creadas aún.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}
