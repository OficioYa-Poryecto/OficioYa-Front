import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './modules/core/components/Layout';
import HomePage from './modules/core/components/HomePage';
import NotFoundPage from './modules/core/components/NotFoundPage';
import { moduleRoutes } from './modules/core/lib/moduleRegistry';
import ProtectedRoute from './modules/auth/components/ProtectedRoute';

const PUBLIC_PATHS = new Set(['/auth', '/auth/register']);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          {moduleRoutes.map((route) => {
            const isPublic = PUBLIC_PATHS.has(route.path);
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  isPublic ? (
                    route.element
                  ) : (
                    <ProtectedRoute>{route.element}</ProtectedRoute>
                  )
                }
              />
            );
          })}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
