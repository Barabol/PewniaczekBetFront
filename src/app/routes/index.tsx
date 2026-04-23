import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

import { HomePage } from '../pages/HomePage';
import { LivePage } from '../pages/LivePage';
import { PromotionsPage } from '../pages/PromotionsPage';
import { ResultsPage } from '../pages/ResultsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { HistoryPage } from '../pages/HistoryPage';
import { WalletPage } from '../pages/WalletPage';
import { SettingsPage } from '../pages/SettingsPage';
import { EsportsPage } from '../pages/EsportsPage';
import { LoginPage } from '../pages/LoginPage';
import { StatsPage } from '../pages/StatsPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Publiczne trasy */}
      <Route path="/" element={<HomePage />} />
      <Route path="/live" element={<LivePage />} />
      <Route path="/esports" element={<EsportsPage />} />
      <Route path="/promotions" element={<PromotionsPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Chronione trasy - wymagają logowania */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wallet"
        element={
          <ProtectedRoute>
            <WalletPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stats"
        element={
          <ProtectedRoute>
            <StatsPage />
          </ProtectedRoute>
        }
      />

      {/* Redirect dla nieistniejących tras */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
