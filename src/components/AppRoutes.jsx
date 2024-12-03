import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuditLogPage from '../pages/AuditLogPage';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/audit-logs" element={<AuditLogPage />} />
    </Routes>
  );
};

export default AppRoutes;
