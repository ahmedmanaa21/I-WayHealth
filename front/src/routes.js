import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import MedicamentsPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import SignupPage from './pages/SignupPage';
import ForgotPassword from './pages/ForgotPassword';
import { useAuthStore } from "./utils/zustand";
import NewPassword from './pages/page-new-password';
import DossierPage from './pages/Dossier';
import ConsultationPage from './pages/Consultation';
import AdherentsPage from './pages/Adherents';
import AdherentDetaisPage from './components/Adherents/AdherentPage';
import UpdateAdherentPage from './components/Adherents/UpdateAdherentPage';



export default function Router() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const routes = useRoutes([
    {
      path: '/dashboard',
      element: isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'medicaments', element: <MedicamentsPage /> },
        { path: 'dossier', element: <DossierPage /> },
        { path: 'consultation', element: <ConsultationPage /> },
        { path: 'Adherents', element: <AdherentsPage /> },
        { path: 'Adherents/:AdherentID', element: <AdherentDetaisPage /> },
        { path: 'Adherents/Update/:AdherentID', element: <UpdateAdherentPage /> },


      ],
    },



    {
      path: 'login',
      element: isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />,
    },
    {
      path: 'signup',
      element: isAuthenticated ? <Navigate to="/dashboard" /> : <SignupPage />,
    },
    {
      path: 'ForgotPassword',
      element: isAuthenticated ? <Navigate to="/dashboard" /> : <ForgotPassword />,
    },
    {
      path: 'page-new-password',
      element: isAuthenticated ? <Navigate to="/dashboard" /> : <NewPassword />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
