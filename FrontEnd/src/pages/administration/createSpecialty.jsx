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
    <div className="page-bg p-6 lg:p-10">
      <div className="max-w-5xl mx-auto animate-slide-up space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin')} className="btn-ghost text-sm">← Volver</button>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">Crear nueva especialidad</h2>
        </div>
        <div className="glass-solid rounded-2xl p-6 lg:p-8 space-y-5">

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

        </div>

        <div className="glass-solid rounded-2xl p-6 lg:p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Especialidades creadas
        </h3>
        <ul className="space-y-2">
          {specialties.length > 0 ? (
            specialties.map((especialidad) => (
              <li
                key={especialidad.id}
                className="list-item flex justify-between items-center gap-4"
              >
                <span>
                  <strong>{t(`specialties.${especialidad.name}`, especialidad.name)}</strong>
                </span>
                <button
                  onClick={() => handleBorrarEspecialidad(especialidad.id)}
                  className="text-coral-500 hover:text-coral-600 font-medium text-sm flex-shrink-0"
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
    </div>
  );
}
