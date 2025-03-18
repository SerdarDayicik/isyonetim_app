// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './login';
import Register from './register';
import Settings from './page/settings';
import CreateProject from './page/CreateProject';
import WorkingProject from "./page/WorkingProject"
import CustomerPage from "./page/CustomerPage"
import AdministratorProject from "./page/AdministratorProject"
import CommissionProject from "./page/CommissionProject"
import Notification from "./page/Notifications"

export default function App() {
  return (
    <Router>
      <div>
        <main>
          {/* Sayfa geçişlerinin olduğu kısım */}
          <Routes>
            <Route path="/" element={<CreateProject />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/Project/WorkingProject' element={<WorkingProject />} />
            <Route path='/Project/CustomerPage' element={<CustomerPage />} />
            <Route path='/Project/AdministratorProject' element={<AdministratorProject />} />
            <Route path='/Project/CommissionProject' element={<CommissionProject />} />
            <Route path='/Project/Notification' element={<Notification />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
