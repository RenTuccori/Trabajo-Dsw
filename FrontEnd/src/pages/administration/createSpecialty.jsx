import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdministracion } from '../../context/administration/AdministrationProvider.jsx';

export function CreateSpecialty() {
  const navigate = useNavigate();
  const {
    specialties,
    createSpecialty,
    getAvailableSpecialties,
    deleteSpecialty,
  } = useAdministracion();
  const [specialtyName, setSpecialtyName] = useState('');

  // Obtener specialties al cargar el componente
  useEffect(() => {
    getAvailableSpecialties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manejar la creación de una nueva especialidad
  const handlecreateSpecialty = async (e) => {
    e.preventDefault();
    if (specialtyName.trim() !== '') {
      try {
        await createSpecialty({ name: specialtyName });
        setSpecialtyName(''); // Reiniciar el campo de texto
        window.notifySuccess('¡Especialidad creada con éxito!');
        getAvailableSpecialties(); // Actualizar la lista después de crear una especialidad
      } catch (error) {
        window.notifyError('Error al crear la especialidad');
        console.error('Error al crear especialidad:', error);
      }
    }
  };

  const handleBorrarEspecialidad = async (specialtyId) => {
    const result = await window.confirmDialog(
      '¿Está seguro?',
      'Esta acción no se puede deshacer.'
    );

    if (result.isConfirmed) {
      try {
        await deleteSpecialty(specialtyId);
        window.notifySuccess('¡Especialidad eliminada con éxito!');
        getAvailableSpecialties(); // Actualizar la lista después de borrar una especialidad
      } catch (error) {
        window.notifyError('Error al eliminar la especialidad');
        console.error('Error al borrar especialidad:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-center text-gray-800">
          Crear nueva especialidad
        </h2>

        <form onSubmit={handlecreateSpecialty} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre de la especialidad"
            value={specialtyName}
            onChange={(e) => setSpecialtyName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear especialidad
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors mt-4"
        >
          Volver
        </button>

        <h3 className="text-lg font-medium text-gray-800 mt-6">
          Especialidades creadas
        </h3>
        <ul className="space-y-2">
          {specialties.length > 0 ? (
            specialties.map((especialidad) => (
              <li
                key={especialidad.idSpecialty}
                className="bg-gray-100 p-4 rounded-lg flex justify-between items-center"
              >
                <span>
                  <strong>{especialidad.name}</strong>
                </span>
                <button
                  onClick={() =>
                    handleBorrarEspecialidad(especialidad.idSpecialty)
                  }
                  className="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-600">
              No hay specialties creadas aún.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}
