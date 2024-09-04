import { DoctoresContext } from './DoctoresContext';
import { verifyDoctor } from '../../api/doctores.api.js';
import { getTurnosHistoricoDoctor } from '../../api/turnos.api.js';
import { useContext, useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import PropTypes from 'prop-types';

// eslint-disable-next-line react-refresh/only-export-components
export const useDoctores = () => {
    const context = useContext(DoctoresContext);
    if (!context) {
      throw new Error(
        'useDoctores must be used within an DoctoresProvider',
      );
    }
    return context;
  };
  
  const DoctoresProvider = ({ children }) => {  
    //proveedor para acceder a los datos de los empleados desde cualquier componente
    
    const [idDoctor, setidDoctor] = useState('');
    const [turnosHist, setTurnosHist] = useState([]);
  

    useEffect(() => {
      comprobarToken();
    }, []);

    async function login({dni,contra}) {
        const response = await verifyDoctor({dni,contra});
        const token = response.data;
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setidDoctor(decoded.idDoctor);
        window.location.reload(); //recarga la pagina para que se actualice el rol globalmente en los componentes hijos
    }
    
    function comprobarToken(){

      if (localStorage.getItem('token')){
        try {
            const decoded = jwtDecode(localStorage.getItem('token'));
            if(decoded.exp < Date.now() / 1000){
                console.error('Token expired');
                localStorage.removeItem('token');
            }else{
              setidDoctor(decoded.idDoctor);
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            localStorage.removeItem('token');
        }
      }else{
        setidDoctor('');
      }
    }
    

    async function Historico(){
      const response = await getTurnosHistoricoDoctor({idDoctor});
      setTurnosHist(response.data);
    }

    return (
      <DoctoresContext.Provider
        value={{ login, comprobarToken, Historico, turnosHist, idDoctor}}>
        {children}
      </DoctoresContext.Provider>
    );
  };

DoctoresProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default DoctoresProvider;
