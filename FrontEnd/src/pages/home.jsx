import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  React.useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <div className="page-split">
      {/* Left Visual Panel */}
      <div className="page-split-visual">
        {/* Floating blobs */}
        <div className="shape-blob w-[300px] h-[300px] bg-white/10 top-[10%] left-[10%] animate-float"></div>
        <div className="shape-blob w-[200px] h-[200px] bg-warm-300/20 bottom-[15%] right-[10%] animate-float-delayed"></div>
        <div className="shape-blob w-[150px] h-[150px] bg-brand-300/20 top-[60%] left-[5%] animate-pulse-soft"></div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-12 max-w-md">
          <div className="w-20 h-20 bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">
            Sanatorio UTN
          </h1>
          <p className="text-brand-100 text-lg leading-relaxed">
            Sistema integral de gestión de turnos médicos
          </p>
          <div className="flex items-center justify-center gap-3 mt-10">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-[10px] font-bold">+5k</div>
            </div>
            <span className="text-sm text-brand-200">pacientes confían en nosotros</span>
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="page-split-content">
        <div className="w-full max-w-sm animate-slide-up">
          {/* Mobile header (hidden on lg) */}
          <div className="text-center mb-10 lg:hidden">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sanatorio UTN</h1>
            <p className="text-gray-500 mt-1">Seleccioná tu rol para continuar</p>
          </div>

          {/* Desktop header */}
          <div className="hidden lg:block mb-10">
            <p className="text-sm font-bold text-brand-600 tracking-widest uppercase mb-2">Bienvenido</p>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">¿Cómo querés ingresar?</h2>
            <p className="text-gray-500 mt-2">Seleccioná tu rol para acceder al sistema</p>
          </div>

          {/* Role Cards — Vertical, Illustrated */}
          <div className="space-y-4 mb-8">
            <div
              onClick={() => navigate('/patient')}
              className="bento-tile flex items-center gap-5 cursor-pointer"
            >
              <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center flex-shrink-0 
              group-hover:bg-brand-200 transition-colors">
                <svg className="w-7 h-7 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-lg">Soy Paciente</h3>
                <p className="text-sm text-gray-500">Sacá turnos, consultá estudios</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-brand-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>

            <div
              onClick={() => navigate('/doctor')}
              className="bento-tile flex items-center gap-5 cursor-pointer"
            >
              <div className="w-14 h-14 bg-warm-100 rounded-2xl flex items-center justify-center flex-shrink-0 
              group-hover:bg-warm-200 transition-colors">
                <svg className="w-7 h-7 text-warm-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-lg">Soy Médico</h3>
                <p className="text-sm text-gray-500">Gestioná tu agenda y estudios</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-warm-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>

            <div
              onClick={() => navigate('/admin')}
              className="bento-tile flex items-center gap-5 cursor-pointer"
            >
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0 
              group-hover:bg-gray-200 transition-colors">
                <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-lg">Administración</h3>
                <p className="text-sm text-gray-500">Configurá el sistema</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-gray-400">
            Sanatorio UTN © 2026 — Sistema de gestión médica
          </p>
        </div>
      </div>
    </div>
  );
}
