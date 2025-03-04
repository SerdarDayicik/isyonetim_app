// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './login';
import Register from './register';
import AnaSayfa from './anaSayfa';

export default function App() {
  return (
    <Router>
      <div>
        <main>
          {/* Sayfa geçişlerinin olduğu kısım */}
          <Routes>
            <Route path="/" element={<AnaSayfa />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
