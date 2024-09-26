import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TriageForm from './components/TriageForm';
import ConsultarPacientes from './components/ConsultarPacientes';
import Login from './pages/Login';
import LogoutButton from './components/LogoutButton';  // Importar el botón de logout

const App = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Verificar si el usuario ya tiene un token y un rol en localStorage
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    if (token && storedRole) {
      setRole(storedRole);
    }
  }, []);

  if (!role) {
    // Si no hay rol definido, mostrar el login
    return <Login setRole={setRole} />;
  }

  return (
    <Router>
      <div>
        {/* Mostrar el botón de logout en cualquier página */}
        <LogoutButton setRole={setRole} />
        <Routes>
          <Route path="/triage" element={<TriageForm />} />
          {role === 'medico' && (
            <Route path="/consultas" element={<ConsultarPacientes />} />
          )}
          {/* Redirigir si no está autenticado */}
          <Route path="*" element={<Navigate to="/triage" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
