import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from './context';
import { MainLayout } from './layouts/MainLayout';
import { AppRoutes } from './routes';

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </AppProviders>
    </BrowserRouter>
  );
}
