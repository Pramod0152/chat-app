import { Navigate } from 'react-router-dom';

import { LoginForm } from '@/components/auth/LoginForm';
import { useAuthStore } from '@/store/auth.store';

function LoginPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/chat" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}

export default LoginPage;
