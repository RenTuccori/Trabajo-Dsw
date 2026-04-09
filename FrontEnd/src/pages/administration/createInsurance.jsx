import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdministration } from '../../context/administration/AdministrationProvider.jsx';

export function CreateInsurance() {
  const navigate = useNavigate();
  const {
    healthInsurances,
    createHealthInsurance,
    getHealthInsurances,
    deleteHealthInsurance,
    updateHealthInsurance,
  } = useAdministration();
  const [insuranceName, setInsuranceName] = useState('');
  const [newInsuranceName, setNewInsuranceName] = useState('');
  const [editingInsuranceId, setEditingInsuranceId] = useState(null);

  useEffect(() => {
    getHealthInsurances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateInsurance = async (e) => {
    e.preventDefault();
    if (insuranceName.trim() !== '') {
      try {
        await createHealthInsurance({ name: insuranceName });
        setInsuranceName('');
        window.notifySuccess('¡Obra Social creada con éxito!');
        getHealthInsurances();
      } catch (error) {
        window.notifyError('Error al crear la obra social');
        console.error('Error creating health insurance:', error);
      }
    }
  };

  const handleBorrarObraSocial = async (healthInsuranceId) => {
    const result = await window.confirmDialog(
      'Are you sure?',
      '¿Deseas eliminar esta obra social?'
    );

    if (result.isConfirmed) {
      try {
        await deleteHealthInsurance(healthInsuranceId);
        window.notifySuccess('¡Obra Social eliminada con éxito!');
        getHealthInsurances();
      } catch (error) {
        window.notifyError('No se puede eliminar esta obra social');
        console.error('Error al borrar obra social:', error);
      }
    }
  };

  const handleActualizarObraSocial = async (e) => {
    e.preventDefault();
    if (obraSocialAEditar && nuevoNombreObraSocial.trim() !== '') {
      try {
        await updateHealthInsurance({
          healthInsuranceId: obraSocialAEditar,
          name: nuevoNombreObraSocial,
        });
        window.notifySuccess('¡Obra Social actualizada con éxito!');
        setObraSocialAEditar(null);
        setNuevoNombreObraSocial('');
        getHealthInsurances();
      } catch (error) {
        window.notifyError('No se puede actualizar esta obra social');
        console.error('Error al actualizar obra social:', error);
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-88px)] bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-center text-gray-800">
          Crear nueva obra social
        </h2>

        {/* Form to create a new health insurance */}
        {!editingInsuranceId && (
          <form onSubmit={handleCreateInsurance} className="space-y-4">
            <input
              type="text"
              placeholder="Nombre de la obra social"
              value={insuranceName}
              onChange={(e) => setInsuranceName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear obra social
            </button>
          </form>
        )}

        {/* Form to update an existing health insurance */}
        {editingInsuranceId && (
          <form onSubmit={handleUpdateInsurance} className="space-y-4">
            <input
              type="text"
              placeholder="Nuevo nombre de la obra social"
              value={newInsuranceName}
              onChange={(e) => setNewInsuranceName(e.target.value)}
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
                onClick={() => setEditingInsuranceId(null)}
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
          Obras sociales creadas
        </h3>
        <ul className="space-y-2">
          {healthInsurances.length > 0 ? (
            healthInsurances.map((insurance) => {
              const id = insurance.id ?? insurance.healthInsuranceId;
              return (
                <li
                  key={id}
                  className="bg-gray-100 p-4 rounded-lg flex justify-between items-center"
                >
                  <span>
                    <strong>{insurance.name}</strong>
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDeleteInsurance(id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => {
                        setEditingInsuranceId(id);
                        setNewInsuranceName(insurance.name);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Actualizar
                    </button>
                  </div>
                </li>
              );
            })
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



