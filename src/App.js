// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './login';
import Register from './register';

export default function App() {
  return (
    <Router>
      <div>
        <main>
          {/* Sayfa geçişlerinin olduğu kısım */}
          <Routes>
            <Route path="/" element={<h2>Ana Sayfa</h2>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
