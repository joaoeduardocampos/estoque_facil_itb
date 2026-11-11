import { useEffect, useState } from "react";
import { LandingPage } from './components/LandingPage';
import { LoginModal } from './components/LoginModal';
import { Dashboard } from './components/Dashboard';
import { api, AuthUser, clearSession, getToken } from "./lib/api";

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!getToken()) return;
    api.me().then(setUser).catch(clearSession);
  }, []);

  const handleLogout = () => {
    clearSession();
    setUser(null);
  };

  return (
    <div className="size-full">
      {!user ? (
        <>
          <LandingPage onOpenLogin={() => setShowLoginModal(true)} />
          <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            onLogin={(authenticatedUser) => {
              setUser(authenticatedUser);
              setShowLoginModal(false);
            }}
          />
        </>
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}
