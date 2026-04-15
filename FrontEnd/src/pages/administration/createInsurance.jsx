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
  const [nombreObraSocial, setNombreObraSocial] = useState('');
  const [nuevoNombreObraSocial, setNuevoNombreObraSocial] = useState('');
  const [obraSocialAEditar, setObraSocialAEditar] = useState(null);

  useEffect(() => {
    getHealthInsurances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlecreateInsurance = async (e) => {
    e.preventDefault();
    if (nombreObraSocial.trim() !== '') {
      try {
        await createHealthInsurance({ name: nombreObraSocial });
        setNombreObraSocial('');
        window.notifySuccess('¡Obra Social creada con éxito!');
        getHealthInsurances();
      } catch (error) {
        window.notifyError('Error al crear la obra social');
        console.error('Error al crear obra social:', error);
      }
    }
  };

  const handleBorrarObraSocial = async (healthInsuranceId) => {
    const result = await window.confirmDialog(
      '¿Estás seguro?',
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
    <div className="page-bg flex items-center justify-center p-4">
      <div className="card p-8 space-y-5 animate-slide-up w-full max-w-md">
        <h2 className="text-xl font-semibold text-center text-gray-800">
          Crear nueva obra social
        </h2>

        {/* Formulario para crear una nueva obra social */}
        {!obraSocialAEditar && (
          <form onSubmit={handlecreateInsurance} className="space-y-4">
            <input
              type="text"
              placeholder="Nombre de la obra social"
              value={nombreObraSocial}
              onChange={(e) => setNombreObraSocial(e.target.value)}
              className="input"
            />
            <button
              type="submit"
              className="btn-primary"
            >
              Crear obra social
            </button>
          </form>
        )}

        {/* Formulario para actualizar una obra social */}
        {obraSocialAEditar && (
          <form onSubmit={handleActualizarObraSocial} className="space-y-4">
            <input
              type="text"
              placeholder="Nuevo name de la obra social"
              value={nuevoNombreObraSocial}
              onChange={(e) => setNuevoNombreObraSocial(e.target.value)}
              className="input"
            />
            <div className="flex justify-between space-x-2">
              <button
                type="submit"
                className="btn-primary"
              >
                Actualizar
              </button>
              <button
                type="button"
                onClick={() => setObraSocialAEditar(null)}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="btn-secondary mt-4"
        >
          Volver
        </button>

        <h3 className="text-lg font-medium text-gray-800 mt-6">
          Obras sociales creadas
        </h3>
        <ul className="space-y-2">
          {healthInsurances.length > 0 ? (
            healthInsurances.map((obraSocial) => {
              const id = obraSocial.id ?? obraSocial.healthInsuranceId;
              return (
                <li
                  key={id}
                  className="list-item flex justify-between items-center"
                >
                  <span>
                    <strong>{obraSocial.name}</strong>
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleBorrarObraSocial(id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => {
                        setObraSocialAEditar(id);
                        setNuevoNombreObraSocial(obraSocial.name);
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



