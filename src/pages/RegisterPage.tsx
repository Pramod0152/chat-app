import { Navigate } from 'react-router-dom';

import { RegisterForm } from '@/components/auth/RegisterForm';
import { useAuthStore } from '@/store/auth.store';

function RegisterPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/chat" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <RegisterForm />
    </div>
  );
}

export default RegisterPage;
