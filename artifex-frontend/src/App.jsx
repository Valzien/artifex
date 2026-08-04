import { useEffect } from "react";
import AppRoutes from "@/routes";
import { ToastProvider } from "@/components/shared/Toast";
import useAuthStore from "@/store/useAuthStore";

function App() {
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ToastProvider>
      <AppRoutes />
    </ToastProvider>
  );
}

export default App;
