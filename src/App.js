import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import Register from './register';
import Settings from './page/settings';
import CreateProject from './page/CreateProject';
import WorkingProject from "./page/WorkingProject";
import CustomerPage from "./page/CustomerPage";
import AdministratorProject from "./page/AdministratorProject";
import CommissionProject from "./page/CommissionProject";
import Notification from "./page/Notifications";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";

function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    // Kontrol devam ederken null veya bir yükleniyor animasyonu döndürebilirsiniz.
    return null;
  }
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div>
          <main>
            <Routes>
              <Route path="/" element={<PrivateRoute><CreateProject /></PrivateRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
              <Route path="/Project/WorkingProject" element={<PrivateRoute><WorkingProject /></PrivateRoute>} />
              <Route path="/Project/CustomerPage" element={<PrivateRoute><CustomerPage /></PrivateRoute>} />
              <Route path="/Project/AdministratorProject" element={<PrivateRoute><AdministratorProject /></PrivateRoute>} />
              <Route path="/Project/CommissionProject" element={<PrivateRoute><CommissionProject /></PrivateRoute>} />
              <Route path="/Project/Notification" element={<PrivateRoute><Notification /></PrivateRoute>} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}
