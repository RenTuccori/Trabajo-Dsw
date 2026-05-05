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

  const handleLogin = async () => {
    try {
      await login({ identifier: dni, credential: password, userType: 'Doctor' });
      window.notifySuccess('¡Login exitoso!');
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      window.notifyError('Error al iniciar sesión');
    }
  };

  const handleDniChange = (event) => setDni(event.target.value);
  const handleContraChange = (event) => setContra(event.target.value);

  useEffect(() => {
    comprobarToken('Doctor');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && dni && password) handleLogin();
  };

  if (!doctorId) {
    // ===== LOGIN: Split screen =====
    return (
      <div className="page-split">
        <div className="page-split-visual">
          <div className="shape-blob w-[280px] h-[280px] bg-warm-300/15 top-[15%] right-[10%] animate-float"></div>
          <div className="shape-blob w-[200px] h-[200px] bg-white/10 bottom-[20%] left-[15%] animate-float-delayed"></div>
          <div className="relative z-10 text-white text-center px-10 max-w-sm">
            <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/20">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-3">Portal Médico</h2>
            <p className="text-brand-200 leading-relaxed">Gestioná tu agenda, turnos y estudios de tus pacientes</p>
          </div>
        </div>

        <div className="page-split-content">
          <div className="w-full max-w-sm animate-slide-up">
            <div className="mb-8">
              <p className="text-xs font-bold text-brand-600 tracking-widest uppercase mb-2">Acceso médicos</p>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Iniciar sesión</h1>
              <p className="text-gray-500 mt-2">Ingresá con tu DNI y contraseña</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="label">DNI</label>
                <input type="text" value={dni} onChange={handleDniChange} onKeyDown={handleKeyDown}
                  placeholder="Tu número de documento" className="input" />
              </div>
              <div>
                <label className="label">Contraseña</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={handleContraChange}
                    onKeyDown={handleKeyDown} placeholder="Tu contraseña" className="input pr-20" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-4 flex items-center text-xs font-bold text-gray-400 
                    hover:text-brand-600 focus:outline-none transition-colors uppercase tracking-wider">
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>
              <button onClick={handleLogin} disabled={!dni || !password} className="btn-primary">Ingresar</button>
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
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center">
            <svg className="w-7 h-7 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
              Dr/a. {nombreUsuario} {apellidoUsuario}
            </h1>
            <p className="text-gray-500 text-sm">Panel de gestión médica</p>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Turnos de hoy — highlight */}
          <div onClick={() => navigate('todayAppointments')}
            className="bento-tile md:col-span-2 flex items-center gap-6 p-8 cursor-pointer bg-gradient-to-br from-brand-50 to-white">
            <div className="w-16 h-16 bg-brand-500 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-colored">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Turnos de hoy</h3>
              <p className="text-gray-500 mt-1">Consultá tu agenda del día y gestioná las consultas</p>
            </div>
            <svg className="w-6 h-6 text-gray-300 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Turnos por fecha */}
          <div onClick={() => navigate('appointmentsByDate')} className="bento-tile flex flex-col gap-4 p-6 cursor-pointer">
            <div className="w-12 h-12 bg-warm-100 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-warm-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Turnos por fecha</h3>
              <p className="text-sm text-gray-500 mt-1">Buscá turnos en una fecha específica</p>
            </div>
          </div>

          {/* Historial */}
          <div onClick={() => navigate('appointmentHistory')} className="bento-tile flex flex-col gap-4 p-6 cursor-pointer">
            <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Historial de turnos</h3>
              <p className="text-sm text-gray-500 mt-1">Revisá todos los turnos pasados</p>
            </div>
          </div>

          {/* Estudios */}
          <div onClick={() => navigate('uploadStudy')} className="bento-tile flex items-center gap-4 p-6 cursor-pointer">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <span className="font-semibold text-gray-700">Gestión de estudios</span>
          </div>

          {/* Cerrar sesión */}
          <div onClick={() => { localStorage.clear(); navigate('/'); }}
            className="bento-tile flex items-center gap-4 p-6 cursor-pointer">
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

export default DoctorHome;
