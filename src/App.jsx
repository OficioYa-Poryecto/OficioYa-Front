import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './modules/core/components/Layout';
import ErrorMessage from './modules/core/components/ErrorMessage';
import Button from './modules/core/design-system/Button';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <section className="card">
                <span className="eyebrow">Bienvenido a OficioYa</span>
                <h1>Estilo base</h1>
                <p>Página temporal para verificar el estilo.</p>
                <Button>Primario</Button> <Button variant="secondary">Secundario</Button>
                <ErrorMessage error="Mensaje de error de ejemplo" />
              </section>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;