import React, { useState } from 'react';
import { Container, Card, Tabs, Tab } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleAuthSubmit = async (formData, mode) => {
    setLoading(true);
    setError('');
    try {
      const url = mode === 'create' ? '/spaces' : '/spaces/access';
      const { data } = await API.post(url, formData);
      login(data.token);
      navigate(`/space/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero-section-overlay">
      <Container className="auth-card-wrapper">
        <div className="text-center text-white mb-4">
          <h1 className="fw-bold">NoteSpace</h1>
          <p className="lead">Your private corner on the web for thoughts and ideas.</p>
        </div>
        <Card className="auth-card">
          <Card.Body className="p-4">
            <Tabs defaultActiveKey="access" id="auth-tabs" className="mb-3" fill>
              <Tab eventKey="access" title="Access a Space">
                <AuthForm mode="access" onSubmit={(data) => handleAuthSubmit(data, 'access')} error={error} loading={loading} />
              </Tab>
              <Tab eventKey="create" title="Create a Space">
                <AuthForm mode="create" onSubmit={(data) => handleAuthSubmit(data, 'create')} error={error} loading={loading} />
              </Tab>
            </Tabs>
             <div className="text-center mt-3">
                <Link to="/recover" className="text-secondary">Forgot your Note Key?</Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default HomePage;