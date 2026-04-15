import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  React.useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <div className="page-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg animate-slide-up">
        {/* Main Card */}
        <div className="card p-8 md:p-10">
          {/* Logo / Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mb-4 shadow-glow">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent tracking-tight">
              Sanatorio UTN
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Sistema integral de gestión de turnos médicos
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Seleccioná tu rol</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              className="group relative h-32 flex flex-col items-center justify-center rounded-2xl border-2 border-slate-200 
              hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-300 hover:shadow-glow"
              onClick={() => navigate('/doctor')}
            >
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-3 
              group-hover:bg-primary-200 transition-colors duration-300">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-semibold text-slate-700 group-hover:text-primary-700 transition-colors">Soy doctor</span>
            </button>
            <button
              className="group relative h-32 flex flex-col items-center justify-center rounded-2xl border-2 border-slate-200 
              hover:border-accent-300 hover:bg-accent-50/50 transition-all duration-300 hover:shadow-glow"
              onClick={() => navigate('/patient')}
            >
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mb-3 
              group-hover:bg-accent-200 transition-colors duration-300">
                <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="font-semibold text-slate-700 group-hover:text-accent-700 transition-colors">Soy paciente</span>
            </button>
          </div>

          {/* Admin link */}
          <div className="text-center">
            <button
              onClick={() => navigate('/admin')}
              className="text-xs text-slate-400 hover:text-primary-600 transition-colors font-medium"
            >
              Acceso administración →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
