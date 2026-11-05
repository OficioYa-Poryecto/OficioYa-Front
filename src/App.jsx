
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './modules/auth/states/AuthProvider';
import Layout from './modules/core/components/Layout';
import HomePage from './modules/core/components/HomePage';
import NotFoundPage from './modules/core/components/NotFoundPage';
import { moduleRoutes } from './modules/core/lib/moduleRegistry';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            {moduleRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;