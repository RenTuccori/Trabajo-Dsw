import { AdministracionContext } from './AdministracionContext';
import {getAdmin} from '../../api/admin.api.js';
import { useContext, useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import PropTypes from 'prop-types';

// eslint-disable-next-line react-refresh/only-export-components
export const useAdministracion = () => {
    const context = useContext(AdministracionContext);
    if (!context) {
      throw new Error(
        'useAdministracion must be used within an AdministracionProvider',
      );
    }
    return context;
  };
  
  const AdministracionProvider = ({ children }) => {  
    //proveedor para acceder a los datos de los empleados desde cualquier componente
    
    const [idAdmin, setidAdmin] = useState('');
  

    useEffect(() => {
      comprobarToken();
    }, []);

    async function login({usuario,contra}) {
        const response = await getAdmin({usuario,contra});
        
        const token = response.data;
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setidAdmin(decoded.idAdmin);
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
              setidAdmin(decoded.idAdmin);
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            localStorage.removeItem('token');
        }
      }else{
        setidAdmin('');
      }
    }
    



    return (
      <AdministracionContext.Provider
        value={{ login, comprobarToken, idAdmin}}>
        {children}
      </AdministracionContext.Provider>
    );
  };

AdministracionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default AdministracionProvider;
