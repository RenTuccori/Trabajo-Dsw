import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  React.useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('../src/components/fondo.jpg')" }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>
      <div className="relative bg-white rounded-lg shadow-md w-full max-w-md p-6 z-10">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800">Sanatorio UTN</h1>
          <p className="text-gray-600">Bienvenido a nuestro sistema de turnos</p>
        </div>
        <div className="space-y-4">
          <p className="text-center text-gray-600">Por favor, selecciona tu rol para continuar:</p>
          <div className="grid grid-cols-2 gap-4">
            <button
              className="h-24 flex flex-col items-center justify-center border border-gray-300 rounded-lg hover:bg-blue-50 transition-colors"
              onClick={() => navigate('/doctor')}
            >
              <span className="text-4xl mb-2">👨‍⚕️</span>
              Soy doctor
            </button>
            <button
              className="h-24 flex flex-col items-center justify-center border border-gray-300 rounded-lg hover:bg-blue-50 transition-colors"
              onClick={() => navigate('/paciente')}
            >
              <span className="text-4xl mb-2">🙋‍♂️</span>
              Soy paciente
            </button>
          </div>
        </div>
      </div>
    </div>
  );

}