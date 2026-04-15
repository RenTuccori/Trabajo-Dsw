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
      window.notifySuccess('¡Login exitoso!');
    } catch (error) {
      window.notifyError('Error en el login, verifica tus datos.');
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

  if (!dni) {
    // ===== LOGIN: Split screen =====
    return (
      <div className="page-split">
        <div className="page-split-visual">
          <div className="shape-blob w-[250px] h-[250px] bg-white/10 top-[20%] left-[15%] animate-float"></div>
          <div className="shape-blob w-[180px] h-[180px] bg-brand-300/15 bottom-[20%] right-[10%] animate-float-delayed"></div>
          <div className="relative z-10 text-white text-center px-10 max-w-sm">
            <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/20">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-3">Portal de Pacientes</h2>
            <p className="text-brand-200 leading-relaxed">Accedé para gestionar tus turnos, estudios y datos personales</p>
          </div>
        </div>

        <div className="page-split-content">
          <div className="w-full max-w-sm animate-slide-up">
            <div className="mb-8">
              <p className="text-xs font-bold text-brand-600 tracking-widest uppercase mb-2">Acceso pacientes</p>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Iniciar sesión</h1>
              <p className="text-gray-500 mt-2">Ingresá tus datos para continuar</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="label">DNI</label>
                <input
                  type="text"
                  value={dniform}
                  onChange={handleDniChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ingresá tu documento"
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
                    placeholder="Tu contraseña"
                    className="input pr-20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-4 flex items-center text-xs font-bold text-gray-400 
                    hover:text-brand-600 focus:outline-none transition-colors uppercase tracking-wider"
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>
              <div className="space-y-3 pt-3">
                <button
                  onClick={handleLogin}
                  disabled={!dniform || !password}
                  className="btn-primary"
                >
                  Ingresar
                </button>
                <button
                  onClick={() => navigate('/patient/personalData')}
                  className="btn-outline"
                >
                  Crear una cuenta nueva
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== DASHBOARD: Bento grid =====
  return (
    <div className="page-bg p-6 lg:p-10">
      <div className="max-w-4xl mx-auto animate-slide-up">
        {/* Greeting */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-1">
            <div className="w-12 h-12 bg-brand-100 rounded-2xl flex items-center justify-center">
              <span className="text-xl">👋</span>
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
                Hola, {nombreUsuario}
              </h1>
              <p className="text-gray-500 text-sm">¿Qué necesitás hoy?</p>
            </div>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Large tile - Sacar turno */}
          <div
            onClick={() => navigate('/patient/bookAppointment')}
            className="bento-tile md:col-span-2 flex items-center gap-6 p-8 cursor-pointer bg-gradient-to-br from-brand-50 to-white"
          >
            <div className="w-16 h-16 bg-brand-500 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-colored">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Sacar un turno nuevo</h3>
              <p className="text-gray-500 mt-1">Elegí especialidad, médico, fecha y horario para tu consulta</p>
            </div>
            <svg className="w-6 h-6 text-gray-300 ml-auto flex-shrink-0 group-hover:text-brand-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Mis turnos */}
          <div
            onClick={() => navigate('/patient/myAppointments')}
            className="bento-tile flex flex-col gap-4 p-6 cursor-pointer"
          >
            <div className="w-12 h-12 bg-warm-100 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-warm-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Mis turnos</h3>
              <p className="text-sm text-gray-500 mt-1">Confirmá o cancelá tus turnos pendientes</p>
            </div>
          </div>

          {/* Mis estudios */}
          <div
            onClick={() => navigate('/patient/myStudies')}
            className="bento-tile flex flex-col gap-4 p-6 cursor-pointer"
          >
            <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Mis estudios</h3>
              <p className="text-sm text-gray-500 mt-1">Descargá tus resultados médicos</p>
            </div>
          </div>

          {/* Modificar datos */}
          <div
            onClick={() => navigate('/patient/editPersonalData')}
            className="bento-tile flex items-center gap-4 p-6 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-700">Modificar mis datos</span>
          </div>

          {/* Cerrar sesión */}
          <div
            onClick={() => { localStorage.clear(); navigate('/'); }}
            className="bento-tile flex items-center gap-4 p-6 cursor-pointer"
          >
            <div className="w-10 h-10 bg-coral-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-coral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <span className="font-semibold text-gray-700">Cerrar sesión</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHome;
