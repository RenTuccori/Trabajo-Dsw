import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/global/AuthProvider';

function DoctorHome() {
  const { doctorId, login, comprobarToken, nombreUsuario, apellidoUsuario } =
    useAuth();
  const [dni, setDni] = useState('');
  const [password, setContra] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Manejo del login con toast de éxito
  const handleLogin = async () => {
    try {
      await login({ identifier: dni, credential: password, userType: 'Doctor' });
      window.notifySuccess('¡Login exitoso!');
    } catch (error) {
      console.error('Error al iniciar sesión', error);

      // Usar el toast de error global
      window.notifyError('Error al iniciar sesión');
    }
  };

  const handleDniChange = (event) => {
    setDni(event.target.value);
  };

  const handleContraChange = (event) => {
    setContra(event.target.value);
  };

  useEffect(() => {
    comprobarToken('Doctor');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && dni && password) {
      handleLogin();
    }
  };

  return (
    <div className="page-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-200/15 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-violet-200/15 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <div className="card p-8">
          <div className="text-center mb-6">
            {doctorId && nombreUsuario ? (
              <>
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-2xl mb-3">
                  <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                  Dr/a. {nombreUsuario} {apellidoUsuario}
                </h1>
                <p className="text-slate-500 text-sm mt-1">Panel de gestión médica</p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-2xl mb-3">
                  <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Portal de Médicos</h1>
                <p className="text-slate-500 text-sm mt-1">Ingresá con tu DNI para acceder</p>
              </>
            )}
          </div>

          {!doctorId ? (
            <div className="space-y-5">
              <div>
                <label className="label">DNI</label>
                <input
                  type="text"
                  value={dni}
                  onChange={handleDniChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ingresá tu número de documento"
                  className="input"
                />
              </div>
              <div>
                <label className="label">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handleContraChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ingresá tu contraseña"
                    className="input pr-20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-4 flex items-center text-xs font-semibold text-slate-400 
                    hover:text-primary-600 focus:outline-none transition-colors uppercase tracking-wider"
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>
              <button
                onClick={handleLogin}
                disabled={!dni || !password}
                className="btn-primary"
              >
                Iniciar sesión
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => navigate('todayAppointments')}
                className="group w-full flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 
                hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center 
                group-hover:bg-primary-200 transition-colors flex-shrink-0">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="font-semibold text-slate-700 group-hover:text-primary-700">Turnos de hoy</span>
                  <p className="text-xs text-slate-400">Consultá la agenda del día</p>
                </div>
              </button>

              <button
                onClick={() => navigate('appointmentsByDate')}
                className="group w-full flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 
                hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center 
                group-hover:bg-indigo-200 transition-colors flex-shrink-0">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="font-semibold text-slate-700 group-hover:text-primary-700">Turnos por fecha</span>
                  <p className="text-xs text-slate-400">Buscá turnos en una fecha específica</p>
                </div>
              </button>

              <button
                onClick={() => navigate('appointmentHistory')}
                className="group w-full flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 
                hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center 
                group-hover:bg-violet-200 transition-colors flex-shrink-0">
                  <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="font-semibold text-slate-700 group-hover:text-primary-700">Historial de turnos</span>
                  <p className="text-xs text-slate-400">Revisá todos los turnos pasados</p>
                </div>
              </button>

              <button
                onClick={() => navigate('uploadStudy')}
                className="group w-full flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 
                hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center 
                group-hover:bg-emerald-200 transition-colors flex-shrink-0">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="font-semibold text-slate-700 group-hover:text-primary-700">Gestión de estudios</span>
                  <p className="text-xs text-slate-400">Subí y gestioná estudios médicos</p>
                </div>
              </button>

              <div className="pt-2">
                <button
                  onClick={() => {
                    localStorage.clear();
                    navigate('/');
                  }}
                  className="btn-secondary text-sm"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

export default DoctorHome;



