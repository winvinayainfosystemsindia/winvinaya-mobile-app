import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';

// Catalog
import CourseCatalog from '../pages/catalog/CourseCatalog';

// Common
import NotFound from '../pages/common/NotFound';
import Maintenance from '../pages/common/Maintenance';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/maintenance" element={<Maintenance />} />
      
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<CourseCatalog />} />
        <Route path="/page-not-found" element={<NotFound />} />
      </Route>

      <Route path="*" element={<Navigate to="/page-not-found" replace />} />
    </Routes>
  );
};

export default AppRouter;
