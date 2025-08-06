import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Container, Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import API from '../services/api';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      return setError('Invalid link. No token found.');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);
    try {
      const { data } = await API.post('/spaces/reset-password', { token, password });
      setSuccess(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div style={{ maxWidth: '450px', width: '100%' }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Set New Password</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success ? (
              <Alert variant="success">
                {success}
                <div className="mt-3">
                  <Link to="/">Click here to return to the homepage and log in.</Link>
                </div>
              </Alert>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Form.Group id="password">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </Form.Group>
                <Form.Group id="confirm-password">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </Form.Group>
                <Button disabled={loading} className="w-100 mt-3" type="submit">
                  {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Reset Password'}
                </Button>
              </Form>
            )}
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default ResetPasswordPage;