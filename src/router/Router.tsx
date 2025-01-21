import { RouterProvider,createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

const Main = lazy(() => import('@/pages/Main'))
const Board = lazy(() => import('@/pages/Board'))
const Login = lazy(() => import('@/pages/Login'))
const Profile = lazy(() => import('@/pages/Profile'))
const Register = lazy(() => import('@/pages/Register'))

function Router() {
    const router = createBrowserRouter([
      {
        path: '/',
        children: [
          { index: true, element: <Main /> },
          { path: '/board', element: <Board /> },
          { path: '/login', element: <Login /> },
          { path: '/profile', element: <Profile /> },
          { path: '/register', element: <Register /> },
        ],
      },
    ]);
  
    return <RouterProvider router={router} />;
  }
  
  export default Router;