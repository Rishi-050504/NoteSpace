// client/src/pages/RecoveryPage.jsx
import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import API from '../services/api';

const RecoveryPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const { data } = await API.post('/recovery', { email });
            setMessage(data.message);
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
                        <h2 className="text-center mb-4">Recover Your NoteSpaces</h2>
                        <p className="text-muted text-center">Enter your recovery email, and we'll send you a list of your associated Note Keys.</p>
                        {message && <Alert variant="success">{message}</Alert>}
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id="email">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </Form.Group>
                            <Button disabled={loading} className="w-100 mt-3" type="submit">
                                {loading ? 'Sending...' : 'Send Recovery Email'}
                            </Button>
                        </Form>
                         <div className="w-100 text-center mt-3">
                            <a href="/">Back to Login</a>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </Container>
    );
};

export default RecoveryPage;