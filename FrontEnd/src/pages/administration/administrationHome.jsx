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
      await login({ identifier: user, credential: password, userType: 'Admin' });
      window.notifySuccess('¡Login exitoso!');
    } catch (error) {
      window.notifyError('Error: Usuario o contraseña incorrectos');
    }
  };

  const handleUsuarioChange = (event) => setUser(event.target.value);
  const handleContraChange = (event) => setContra(event.target.value);
  const handleKeyDown = (e) => { if (e.key === 'Enter' && user && password) handleLogin(); };

  if (!idAdmin) {
    return (
      <div className="page-split">
        <div className="page-split-visual">
          <div className="shape-blob w-[250px] h-[250px] bg-warm-300/15 top-[10%] left-[10%] animate-float"></div>
          <div className="shape-blob w-[180px] h-[180px] bg-white/10 bottom-[15%] right-[15%] animate-float-delayed"></div>
          <div className="relative z-10 text-white text-center px-10 max-w-sm">
            <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/20">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-3">Administración</h2>
            <p className="text-brand-200 leading-relaxed">Configurá sedes, especialidades, doctores y más</p>
          </div>
        </div>

        <div className="page-split-content">
          <div className="w-full max-w-sm animate-slide-up">
            <div className="mb-8">
              <p className="text-xs font-bold text-brand-600 tracking-widest uppercase mb-2">Panel admin</p>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Iniciar sesión</h1>
              <p className="text-gray-500 mt-2">Acceso restringido a administradores</p>
            </div>
            <div className="space-y-5">
              <div>
                <label className="label">Usuario</label>
                <input type="text" value={user} onChange={handleUsuarioChange} onKeyDown={handleKeyDown}
                  placeholder="Tu usuario" className="input" />
              </div>
              <div>
                <label className="label">Contraseña</label>
                <input type="password" value={password} onChange={handleContraChange} onKeyDown={handleKeyDown}
                  placeholder="Tu contraseña" className="input" />
              </div>
              <button onClick={handleLogin} disabled={!user || !password} className="btn-primary">Ingresar</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== DASHBOARD: Bento grid =====
  const tiles = [
    { path: '/admin/createLocation', label: 'Sedes', desc: 'Gestioná las sedes del sanatorio', color: 'brand', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { path: '/admin/createSpecialty', label: 'Especialidades', desc: 'Administrá las especialidades', color: 'violet', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
    { path: '/admin/createDoctor', label: 'Doctores', desc: 'Creá y gestioná profesionales', color: 'warm', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { path: '/admin/createCombination', label: 'Combinaciones', desc: 'Vinculá doctores, sedes y especialidades', color: 'emerald', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
    { path: '/admin/createInsurance', label: 'Obras sociales', desc: 'Administrá las coberturas', color: 'amber', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  ];

  const colorMap = {
    brand: { bg: 'bg-brand-100', text: 'text-brand-600' },
    violet: { bg: 'bg-violet-100', text: 'text-violet-600' },
    warm: { bg: 'bg-warm-100', text: 'text-warm-600' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
  };

  return (
    <div className="page-bg p-6 lg:p-10">
      <div className="max-w-4xl mx-auto animate-slide-up">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
            <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">Panel de Administración</h1>
            <p className="text-gray-500 text-sm">Gestioná el sistema del sanatorio</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {tiles.map((tile) => (
            <div key={tile.path} onClick={() => navigate(tile.path)}
              className="bento-tile flex flex-col gap-4 p-6 cursor-pointer">
              <div className={`w-12 h-12 ${colorMap[tile.color].bg} rounded-2xl flex items-center justify-center`}>
                <svg className={`w-6 h-6 ${colorMap[tile.color].text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tile.icon} />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{tile.label}</h3>
                <p className="text-sm text-gray-500 mt-1">{tile.desc}</p>
              </div>
            </div>
          ))}

          {/* Cerrar sesión */}
          <div onClick={() => { navigate('/'); localStorage.removeItem('token'); }}
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

export default AdministrationHome;
