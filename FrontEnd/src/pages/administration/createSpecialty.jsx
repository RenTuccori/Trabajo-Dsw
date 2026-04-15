import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdministration } from '../../context/administration/AdministrationProvider.jsx';
import { useTranslation } from 'react-i18next';

export function CreateSpecialty() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    specialties,
    createSpecialty,
    getAvailableSpecialties,
    deleteSpecialty,
  } = useAdministration();
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
    <div className="page-bg flex items-center justify-center p-4">
      <div className="card p-8 space-y-5 animate-slide-up w-full max-w-md">
        <h2 className="text-xl font-semibold text-center text-gray-800">
          Crear nueva especialidad
        </h2>

        <form onSubmit={handlecreateSpecialty} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre de la especialidad"
            value={specialtyName}
            onChange={(e) => setSpecialtyName(e.target.value)}
            className="input"
          />
          <button
            type="submit"
            className="btn-primary"
          >
            Crear especialidad
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="btn-secondary mt-4"
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
                key={especialidad.id}
                className="list-item flex justify-between items-center"
              >
                <span>
                  <strong>{t(`specialties.${especialidad.name}`, especialidad.name)}</strong>
                </span>
                <button
                  onClick={() => handleBorrarEspecialidad(especialidad.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-600">
              No hay especialidades creadas aún.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}
