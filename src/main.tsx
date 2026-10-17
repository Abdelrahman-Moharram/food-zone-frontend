import './index.css'
import "./i18n";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'

import CustomProvider from './redux/provider.tsx'
import Layout from './Pages/Layout.tsx'
import Login from './Pages/Auth/Login.tsx'
import Logout from './Pages/Auth/logout.tsx'
import NotFound from './Pages/Errors/NotFound.tsx'
import Home from './Pages/Home/index.tsx';
import AuthenticatedOrRedirect from './Components/Guards/AuthenticatedOrRedirect.tsx';
import NotAuthenticatedOrRedirect from './Components/Guards/NotAuthenticatedOrRedirect.tsx';



import { IsAllowedPermissionOrRedirect } from './Components/Guards/IsAllowedPermission.tsx';
import Menus from './Pages/Menus/Menus.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: (
      <Layout>
        <NotFound />
      </Layout>
    ),
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: 'menus',
        // element : (
        //   <IsAllowedPermissionOrRedirect permission='permissions.restaurants.menus'>
        //     <Outlet />
        //   </IsAllowedPermissionOrRedirect>
        // ),
        children: [
          {
            index: true,
            element: <Menus />
          },
        ]
      }
    ]
  },
  {
    path: '/auth',
    children: [
      {
        path: "logout",
        element:
          <AuthenticatedOrRedirect>
            <Logout />
          </AuthenticatedOrRedirect>
      },
      {
        path: "login",
        element:
          <NotAuthenticatedOrRedirect>
            <Login />
          </NotAuthenticatedOrRedirect>
      },

    ]
  },

])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CustomProvider>
      <RouterProvider router={router} />
    </CustomProvider>
  </StrictMode>,
)
