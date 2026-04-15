// src/pages/home.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/global/AuthProvider';
import { useState, useEffect } from 'react';

function UserHome() {
  const navigate = useNavigate();
  const { dni, login, comprobarToken, nombreUsuario, apellidoUsuario } =
    useAuth();
  const [dniform, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      await login({
        identifier: dniform,
        credential: password,
        userType: 'Patient',
      });
      window.notifySuccess('¡Login exitoso!'); // Muestra mensaje de éxito
    } catch (error) {
      window.notifyError('Error en el login, verifica tus datos.'); // Muestra mensaje de error si hay fallo
    }
  };
  useEffect(() => {
    comprobarToken('Patient');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDniChange = (event) => {
    setDni(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && dniform && password) {
      handleLogin();
    }
  };

  return (
    <div className="page-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-200/15 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-accent-200/15 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <div className="card p-8">
          {/* Header */}
          <div className="text-center mb-6">
            {dni && nombreUsuario ? (
              <>
                <div className="inline-flex items-center justify-center w-14 h-14 bg-accent-100 rounded-2xl mb-3">
                  <svg className="w-7 h-7 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                  Hola, {nombreUsuario}
                </h1>
                <p className="text-slate-500 text-sm mt-1">¿Qué querés hacer hoy?</p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-2xl mb-3">
                  <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                  Portal de Pacientes
                </h1>
                <p className="text-slate-500 text-sm mt-1">Ingresá con tu DNI para continuar</p>
              </>
            )}
          </div>

          {!dni ? (
            <div className="space-y-5">
              <div>
                <label className="label">DNI</label>
                <input
                  type="text"
                  value={dniform}
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
                    onChange={handlePasswordChange}
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
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleLogin}
                  disabled={!dniform || !password}
                  className="btn-primary"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => navigate('/patient/personalData')}
                  className="btn-secondary"
                >
                  Crear una cuenta
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => navigate('/patient/bookAppointment')}
                className="group w-full flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 
                hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center 
                group-hover:bg-primary-200 transition-colors flex-shrink-0">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="font-semibold text-slate-700 group-hover:text-primary-700">Sacar un turno</span>
                  <p className="text-xs text-slate-400">Reservá una consulta médica</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/patient/myAppointments')}
                className="group w-full flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 
                hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center 
                group-hover:bg-indigo-200 transition-colors flex-shrink-0">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="font-semibold text-slate-700 group-hover:text-primary-700">Ver mis turnos</span>
                  <p className="text-xs text-slate-400">Consultá tus turnos pendientes</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/patient/myStudies')}
                className="group w-full flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 
                hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center 
                group-hover:bg-violet-200 transition-colors flex-shrink-0">
                  <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="font-semibold text-slate-700 group-hover:text-primary-700">Ver mis estudios</span>
                  <p className="text-xs text-slate-400">Descargá tus estudios médicos</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/patient/editPersonalData')}
                className="group w-full flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 
                hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center 
                group-hover:bg-slate-200 transition-colors flex-shrink-0">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="font-semibold text-slate-700">Modificar datos</span>
                  <p className="text-xs text-slate-400">Actualizá tu información personal</p>
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
    </div>
  );
}

export default UserHome;
