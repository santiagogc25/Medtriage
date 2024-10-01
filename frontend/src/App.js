import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TriageForm from './components/TriageForm';  // Componente del formulario de triage
import ConsultarPacientes from './components/ConsultarPacientes';  // Componente para mostrar las consultas
import DoctorDashboard from './pages/DoctorDashboard';  // Nuevo componente del panel del médico
import Login from './pages/Login';  // Componente de login
import LogoutButton from './components/LogoutButton';  // Botón para cerrar sesión

const App = () => {
  const [role, setRole] = useState(null);  // Estado para almacenar el rol del usuario

  useEffect(() => {
    // Verificar si el usuario ya tiene un token y un rol almacenado en localStorage
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    if (token && storedRole) {
      setRole(storedRole);  // Si hay un token y un rol, asignarlo al estado "role"
    }
  }, []);

  if (!role) {
    // Si no hay rol definido, redirigir al login
    return <Login setRole={setRole} />;
  }

  return (
    <Router>
      <div>
        {/* Mostrar el botón de logout en todas las páginas */}
        <LogoutButton setRole={setRole} />

        {/* Menú de navegación para cambiar entre Triage y Consultas si el rol es "medico" */}
        <nav>
          <ul>
            {/* Enlace al formulario de triage */}
            <li><a href="/triage">Triage</a></li>
            {/* Mostrar el enlace a "Consultas" solo si el usuario es médico */}
            {role === 'medico' && <li><a href="/consultas">Consultas</a></li>}
          </ul>
        </nav>

        {/* Definir las rutas de la aplicación */}
        <Routes>
          {/* Ruta para el formulario de triage */}
          <Route path="/triage" element={<TriageForm />} />
          {/* Ruta para la página de consultas, solo accesible si el usuario es médico */}
          {role === 'medico' && (
            <Route path="/consultas" element={<DoctorDashboard />} />
          )}
          {/* Redirigir cualquier otra ruta a "Triage" */}
          <Route path="*" element={<Navigate to="/triage" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
