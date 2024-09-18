import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-center text-gray-800">Crear Nueva Sede</h2>

        {/* Mostrar mensaje de éxito si existe */}
        {mensajeExito && (
          <div className="bg-green-100 text-green-800 p-2 rounded-lg text-center">
            {mensajeExito}
          </div>
        )}

        <form onSubmit={handleCrearSede} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre de la sede"
            value={nombreSede}
            onChange={(e) => setNombreSede(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Dirección de la sede"
            value={direccionSede}
            onChange={(e) => setDireccionSede(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Crear Sede
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors mt-4"
        >
          Volver
        </button>

        <h3 className="text-lg font-medium text-gray-800 mt-6">Sedes Creadas</h3>
        <ul className="space-y-2">
          {sedes.length > 0 ? (
            sedes.map((sede) => (
              <li key={sede.idSede} className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                <span>
                  <strong>{sede.nombre}</strong> - {sede.direccion}
                </span>
                <button
                  onClick={() => handleBorrarSede(sede.idSede)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-600">No hay sedes creadas aún.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
