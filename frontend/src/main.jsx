import App from "./App.jsx";
import Dashboard from "./views/admin/Dashboard.jsx";
import Dashboard_dest from "./views/lider/Dashboard_dest.jsx";
import RequireAuth from "./components/requireAuth.jsx";
import Explo from "./views/admin/explo/exploradores.jsx";
import Explo_dest from "./views/lider/explo/exploradores_destc.jsx";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./views/admin/Layout.jsx";
import LayoutDest from "./views/lider/LayoutDest.jsx";
import CrearExplorador from "./views/lider/explo/crear_explorador.jsx";
import EditarExplorador from "./views/lider/explo/editar_explorador.jsx";
import Destacamentos from "./views/admin/destacamentos/destacamentos.jsx";
import CrearDestacamento from "./views/admin/destacamentos/crear_destacamento.jsx";
import EditarDestacamento from "./views/admin/destacamentos/editar_destacamento.jsx";
import EditarAscenso from "./views/admin/ascensos/editar_ascenso.jsx";
import Ascensos from "./views/admin/ascensos/ascensos.jsx";
import CrearAscenso from "./views/admin/ascensos/crear_ascenso.jsx";
import Directiva from "./views/admin/directiva/directiva.jsx";
import CrearDirectiva from "./views/admin/directiva/crear_directivo.jsx";
import EditarDirectiva from "./views/admin/directiva/editar_directivo.jsx";
import Usuarios from "./views/admin/usuarios/usuarios.jsx";
import CrearUsuario from "./views/admin/usuarios/crear_usuario.jsx";
import EditarUsuario from "./views/admin/usuarios/editar_usuario.jsx";
import Logs from "./views/admin/logs.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

export const UserContext = React.createContext();

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />

        <Route element={<RequireAuth role={1} />}>
          <Route element={<Layout />}>
            <Route path="/dashboard/admin" element={<Dashboard />} />
            <Route path="/dashboard/admin/explo" element={<Explo />} />
            <Route path="/dashboard/admin/destacamentos" element={<Destacamentos />} />
            <Route path="/dashboard/admin/destacamentos/crear" element={<CrearDestacamento />} />
            <Route path="/dashboard/admin/destacamentos/editar" element={<EditarDestacamento />} />
            <Route path="/dashboard/admin/ascensos" element={<Ascensos />} />
            <Route path="/dashboard/admin/ascensos/crear" element={<CrearAscenso />} />
            <Route path="/dashboard/admin/ascensos/editar" element={<EditarAscenso />} />
            <Route path="/dashboard/admin/directiva" element={<Directiva />} />
            <Route path="/dashboard/admin/directiva/crear" element={<CrearDirectiva />} />
            <Route path="/dashboard/admin/directiva/editar" element={<EditarDirectiva />} />
            <Route path="/dashboard/admin/usuarios" element={<Usuarios />} />
            <Route path="/dashboard/admin/usuarios/crear" element={<CrearUsuario />} />
            <Route path="/dashboard/admin/usuarios/editar" element={<EditarUsuario />} />
            <Route path="/dashboard/admin/logs" element={<Logs />} />
          </Route>
        </Route>

        <Route element={<RequireAuth role={2} />}>
          <Route element={<LayoutDest />}>
            <Route path="/dashboard/dest" element={<Dashboard_dest />} />
            <Route path="/dashboard/dest/explo" element={<Explo_dest />} />
            <Route path="/dashboard/dest/explo/crear" element={<CrearExplorador />} />
            <Route path="/dashboard/dest/explo/editar" element={<EditarExplorador />} />
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
// </React.StrictMode>
);
