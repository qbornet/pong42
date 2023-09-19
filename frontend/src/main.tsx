import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { action as loginAction } from './components/LoginPage/login.action';
import { loader as twoAuthLoader } from './components/LoginPage/twoAuth.loader';
import LoginPage from './components/LoginPage/LoginPage';
import LoginForm from './components/LoginPage/LoginForm';
import ErrorLoginPage from './components/LoginPage/ErrorLoginPage';
import ValidationTwoAuth from './components/LoginPage/ValidationTwoAuth';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
    errorElement: <ErrorLoginPage />
  },
  {
    path: '/signup',
    element: <LoginForm />,
    errorElement: <LoginForm />,
    action: loginAction
  },
  {
    path: '/2fa-validation',
    element: <ValidationTwoAuth />,
    loader: twoAuthLoader
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RouterProvider router={router} />
);
