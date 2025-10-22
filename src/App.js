import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Dashboard from './pages/Dashboard';
import ProfileDetails from './pages/ProfileDetails';
import './App.css';

function App() {
  return (
    <Router>
      <Container className="py-4">
        <h1 className="text-center mb-4">Developer Profiles Dashboard</h1>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile/:id" element={<ProfileDetails />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;