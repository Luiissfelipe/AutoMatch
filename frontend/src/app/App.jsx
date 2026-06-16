import React from 'react';
import { AppRoutes } from './routes';
import { useInitialization } from '../features/auth/hooks/useInitialization';
import useAuthStore from '../store/useAuthStore';

export default function App() {
  const { isInitializing } = useInitialization();
  const { userId, token } = useAuthStore();

  if (isInitializing) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' }}>
        <p style={{ color: '#112A46', fontWeight: 'bold' }}>Carregando AutoMatch...</p>
      </div>
    );
  }

  return <AppRoutes isAuthenticated={Boolean(token && userId)} />;
}
