// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Login from './pages/Login';
import LeaderHome from './pages/leader/LeaderHome';
import MemberList from './pages/leader/MemberList';
import AdminHome from './admin/AdminHome';
import ChurchList from './admin/ChurchList';
import CreateChurch from './admin/CreateChurch';

// Simulación de estado de autenticación
const isAuthenticated = true;  // Cambiar según sea necesario
const isAdmin = true;          // Cambiar para pruebas de roles

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <PrivateRoute isAuthenticated={isAuthenticated} />, // Rutas protegidas
        children: [
          {
            path: "leader/home",
            element: <LeaderHome />,
          },
          {
            path: "leader/members",
            element: <MemberList />,
          },
        ],
      },
      {
        element: <AdminRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin} />, // Rutas de administrador
        children: [
          {
            path: "admin/home",
            element: <AdminHome />,
          },
          {
            path: "admin/churches",
            element: <ChurchList />,
          },
          {
            path: "admin/churches/create",
            element: <CreateChurch />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
