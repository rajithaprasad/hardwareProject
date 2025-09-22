import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './components/Login';
import Header from './components/Header';
import Dashboard from './components/Dashboard';

interface User {
  username: string;
  role: string;
  full_name: string; // Match backend column name
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: { username: string; role: string; full_name: string }) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <ThemeProvider>
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Header user={user} onLogout={handleLogout} />
          <Dashboard
            user={{
              full_name: user.full_name,
              username: user.username,
              role: user.role,
            }}
            onLogout={handleLogout}
          />
        </div>
      )}
    </ThemeProvider>
  );
}

export default App;
