import { AdminAuthContext, useAdminAuthProvider } from '../hooks/useAdminAuth';

interface AdminAuthProviderProps {
  children: React.ReactNode;
}

export function AdminAuthProvider({ children }: AdminAuthProviderProps) {
  const auth = useAdminAuthProvider();
  
  return (
    <AdminAuthContext.Provider value={auth}>
      {children}
    </AdminAuthContext.Provider>
  );
}