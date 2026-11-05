
// encuentra cada src/modules/<domain>/routes.jsx automaticamente 
// y los importa para obtener sus rutas y enlaces de navegación
const modules = Object.values(
    import.meta.glob('../../*/routes.jsx', { eager: true }),
);

export const moduleRoutes = modules.flatMap((m) => m.routes ?? []);
export const navLinks = modules.flatMap((m) => m.navLinks ?? []);