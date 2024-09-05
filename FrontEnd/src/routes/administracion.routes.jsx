import { Routes, Route} from "react-router-dom";
import AdministracionProvider from "../context/administracion/AdministracionProvider.jsx";
import HomeAdmin from "../pages/administration/homeAdministracion.jsx";



export function AdministracionRoutes() {
  return (
    <AdministracionProvider>
      <Routes>
        <Route path="/" element={<HomeAdmin/>} />
      </Routes>
    </AdministracionProvider>
  );
}

