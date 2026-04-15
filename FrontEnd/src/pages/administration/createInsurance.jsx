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
    <div className="page-bg p-6 lg:p-10">
      <div className="max-w-5xl mx-auto animate-slide-up space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin')} className="btn-ghost text-sm">← Volver</button>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">Crear nueva obra social</h2>
        </div>
        <div className="glass-solid rounded-2xl p-6 lg:p-8 space-y-5">

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

        </div>

        <div className="glass-solid rounded-2xl p-6 lg:p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Obras sociales creadas
        </h3>
        <ul className="space-y-2">
          {healthInsurances.length > 0 ? (
            healthInsurances.map((obraSocial) => {
              const id = obraSocial.id ?? obraSocial.healthInsuranceId;
              return (
                <li
                  key={id}
                  className="glass-list-item flex justify-between items-center gap-4"
                >
                  <span>
                    <strong>{obraSocial.name}</strong>
                  </span>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleBorrarObraSocial(id)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-coral-50 text-coral-500 hover:bg-coral-100 transition-colors"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => {
                        setObraSocialAEditar(id);
                        setNuevoNombreObraSocial(obraSocial.name);
                      }}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors"
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
    </div>
  );
}



