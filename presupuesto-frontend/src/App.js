import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Presupuestos from './pages/Presupuestos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/presupuestos" element={<Presupuestos />} />
      </Routes>
    </Router>
  );
}

export default App;
