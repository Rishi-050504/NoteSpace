import React, { useState } from 'react';
import { Form, Button, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { FiKey, FiLock } from 'react-icons/fi'; // Import icons

const AuthForm = ({ mode, onSubmit, error, loading }) => {
  const [noteKey, setNoteKey] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => { e.preventDefault(); onSubmit({ noteKey, password }); };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group className="mb-3" controlId={`formNoteKey-${mode}`}>
        <Form.Label>Note Key</Form.Label>
        <InputGroup>
          <InputGroup.Text><FiKey /></InputGroup.Text>
          <Form.Control type="text" placeholder="e.g., my-secret-project" value={noteKey} onChange={(e) => setNoteKey(e.target.value)} required />
        </InputGroup>
      </Form.Group>
      <Form.Group className="mb-3" controlId={`formPassword-${mode}`}>
        <Form.Label>Password</Form.Label>
        <InputGroup>
          <InputGroup.Text><FiLock /></InputGroup.Text>
          <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </InputGroup>
      </Form.Group>
      <div className="d-grid mt-4">
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" /> : `${mode === 'create' ? 'Create' : 'Access'} NoteSpace`}
        </Button>
      </div>
    </Form>
  );
};

export default AuthForm;