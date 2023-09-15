import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { action as loginAction } from './components/LoginPage/login.action';
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
    element: <ValidationTwoAuth />
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RouterProvider router={router} />
);
