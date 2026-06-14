import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from './context';
import { MainLayout } from './layouts/MainLayout';
import { AppRoutes } from './routes';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <MainLayout>
          <AppRoutes />
        </MainLayout>
        <Toaster />
      </AppProviders>
    </BrowserRouter>
  );
}
