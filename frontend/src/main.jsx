import App from "./App.jsx"
import Dashboard from "./views/admin/Dashboard.jsx"
import Dashboard_dest from "./views/lider/Dashboard_dest.jsx";
import RequireAuth from "./components/requireAuth.jsx";
import Explo from "./views/admin/explo/exploradores.jsx";
import Explo_dest from "./views/lider/explo/exploradores_destc.jsx";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./views/admin/Layout.jsx";
import LayoutDest from "./views/lider/LayoutDest.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route element={<Layout/>}>

          <Route element={<RequireAuth role={1} />}>
            <Route path="/dashboard/admin" element={<Dashboard />} />
            <Route path="/dashboard/admin/explo" element={<Explo />} />
          
          </Route>
        </Route>

        <Route element={<LayoutDest/>}>
          <Route element={<RequireAuth role={2} />}>
            <Route path="/dashboard/dest" element={<Dashboard_dest />} />
            <Route path="/dashboard/dest/explo" element={<Explo_dest />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
