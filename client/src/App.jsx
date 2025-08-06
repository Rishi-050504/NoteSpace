// client/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NoteSpaceGallery from './pages/NoteSpaceGallery';
import NotepadEditor from './pages/NotepadEditor';
import RecoveryPage from './pages/RecoveryPage';
import ProtectedRoute from './components/ProtectedRoute';
import ResetPasswordPage from './pages/ResetPasswordPage';
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/recover" element={<RecoveryPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/space/:spaceId" element={<NoteSpaceGallery />} />
        <Route path="/space/:spaceId/notepad/:notepadId" element={<NotepadEditor />} />
      </Route>
    </Routes>
  );
}

export default App;