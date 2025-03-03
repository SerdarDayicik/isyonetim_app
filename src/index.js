// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';  // 'react-dom/client' yolu ile import edilmeli
import "./globals.css";
import App from './App';
// import Login from "./login";

const root = ReactDOM.createRoot(document.getElementById('root'));  // 'createRoot' fonksiyonu burada kullanılır
root.render(
  <React.StrictMode>
    <App />
    {/* <Login /> */}
  </React.StrictMode>
);
