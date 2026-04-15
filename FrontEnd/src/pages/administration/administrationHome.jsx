import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/global/AuthProvider';

function AdministrationHome() {
  const { login, idAdmin, comprobarToken } = useAuth();
  const [user, setUser] = useState('');
  const [password, setContra] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    comprobarToken('Admin');
  }, [comprobarToken]);

  const handleLogin = async () => {
    try {
      await login({
        identifier: user,
        credential: password,
        userType: 'Admin',
      });
      window.notifySuccess('¡Login exitoso!');
    } catch (error) {
      window.notifyError('Error: Usuario o contraseña incorrectos');
    }
  };

  const handleUsuarioChange = (event) => setUser(event.target.value);
  const handleContraChange = (event) => setContra(event.target.value);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && user && password) {
      handleLogin();
    }
  };

  const renderLoginForm = () => (
    <div className="space-y-5">
      <div>
        <label className="label">Usuario</label>
        <input
          type="text"
          value={user}
          onChange={handleUsuarioChange}
          onKeyDown={handleKeyDown}
          placeholder="Ingresá tu usuario"
          className="input"
        />
      </div>
      <div>
        <label className="label">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={handleContraChange}
          onKeyDown={handleKeyDown}
          placeholder="Ingresá tu contraseña"
          className="input"
        />
      </div>
      <button
        onClick={handleLogin}
        disabled={!user || !password}
        className="btn-primary"
      >
        Iniciar sesión
      </button>
    </div>
  );

  const renderMenu = () => (
    <div className="space-y-3">
      <button
        onClick={() => navigate('/admin/createLocation')}
        className="group w-full flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 
        hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200"
      >
        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors flex-shrink-0">
          <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div className="text-left">
          <span className="font-semibold text-slate-700 group-hover:text-primary-700">Sedes</span>
          <p className="text-xs text-slate-400">Gestioná las sedes del sanatorio</p>
        </div>
      </button>

      <button
        onClick={() => navigate('/admin/createSpecialty')}
        className="group w-full flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 
        hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200"
      >
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors flex-shrink-0">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <div className="text-left">
          <span className="font-semibold text-slate-700 group-hover:text-primary-700">Especialidades</span>
          <p className="text-xs text-slate-400">Administrá las especialidades médicas</p>
        </div>
      </button>

      <button
        onClick={() => navigate('/admin/createDoctor')}
        className="group w-full flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 
        hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200"
      >
        <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center group-hover:bg-violet-200 transition-colors flex-shrink-0">
          <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div className="text-left">
          <span className="font-semibold text-slate-700 group-hover:text-primary-700">Doctores</span>
          <p className="text-xs text-slate-400">Creá y gestioná los profesionales</p>
        </div>
      </button>

      <button
        onClick={() => navigate('/admin/createCombination')}
        className="group w-full flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 
        hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200"
      >
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors flex-shrink-0">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <div className="text-left">
          <span className="font-semibold text-slate-700 group-hover:text-primary-700">Asignar combinación</span>
          <p className="text-xs text-slate-400">Vinculá doctores, sedes y especialidades</p>
        </div>
      </button>

      <button
        onClick={() => navigate('/admin/createInsurance')}
        className="group w-full flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 
        hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200"
      >
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center group-hover:bg-amber-200 transition-colors flex-shrink-0">
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div className="text-left">
          <span className="font-semibold text-slate-700 group-hover:text-primary-700">Obras sociales</span>
          <p className="text-xs text-slate-400">Administrá las obras sociales</p>
        </div>
      </button>

      <div className="pt-2">
        <button
          onClick={() => {
            navigate('/');
            localStorage.removeItem('token');
          }}
          className="btn-secondary text-sm"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <div className="page-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-200/15 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-violet-200/15 rounded-full blur-3xl"></div>

      {/* Contenido */}
      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <div className="card p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-2xl mb-3">
              <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Portal de Administración
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {!idAdmin ? 'Ingresá tus credenciales para acceder' : 'Gestioná el sistema del sanatorio'}
            </p>
          </div>
          {!idAdmin ? renderLoginForm() : renderMenu()}
        </div>
      </div>
    </div>
  );
}

export default AdministrationHome;
