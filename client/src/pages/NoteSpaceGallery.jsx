import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Alert, Card, Modal, Form } from 'react-bootstrap';
import { BsPlusLg } from 'react-icons/bs';
import { FiLogOut, FiMail, FiSave } from 'react-icons/fi';
import API from '../services/api';
import NotepadCard from '../components/NotepadCard';
import { useAuth } from '../context/AuthContext';

const NoteSpaceGallery = () => {
  const { spaceId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notepadToDelete, setNotepadToDelete] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [notepadToEdit, setNotepadToEdit] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/spaces/${spaceId}`);
        setSpace(data);
        setRecoveryEmail(data.recoveryEmail || '');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch NoteSpace');
      } finally {
        setLoading(false);
      }
    };
    fetchSpace();
  }, [spaceId]);

  const handleCreateNotepad = async () => {
    try {
      const { data: newNotepad } = await API.post(`/spaces/${spaceId}/notepads`, { title: 'New Notepad' });
      navigate(`/space/${spaceId}/notepad/${newNotepad._id}`);
    } catch (err) {
      setError('Failed to create new notepad.');
    }
  };

  const openDeleteModal = (notepadId) => {
    setNotepadToDelete(notepadId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setNotepadToDelete(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/spaces/${spaceId}/notepads/${notepadToDelete}`);
      setSpace(prevSpace => ({
        ...prevSpace,
        notepads: prevSpace.notepads.filter(n => n._id !== notepadToDelete)
      }));
      closeDeleteModal();
    } catch (err) {
      setError('Failed to delete notepad.');
      closeDeleteModal();
    }
  };

  const openEditModal = (notepad) => {
    setNotepadToEdit(notepad);
    setNewTitle(notepad.title);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setNotepadToEdit(null);
    setShowEditModal(false);
  };

  const saveTitleChanges = async () => {
    if (!newTitle.trim()) {
      return; // Prevent saving empty titles
    }
    try {
      const { data: updatedNotepad } = await API.put(`/spaces/${spaceId}/notepads/${notepadToEdit._id}`, {
        title: newTitle
      });
      setSpace(prevSpace => ({
        ...prevSpace,
        notepads: prevSpace.notepads.map(n => n._id === updatedNotepad._id ? { ...n, title: updatedNotepad.title } : n)
      }));
      closeEditModal();
    } catch (err) {
      setError('Failed to update title.');
      closeEditModal();
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put(`/spaces/${spaceId}/recovery-email`, { email: recoveryEmail });
      setEmailMessage(data.message);
      setTimeout(() => setEmailMessage(''), 3000);
    } catch (err) {
      setEmailMessage(err.response?.data?.message || 'Failed to update email.');
    }
  };

  if (loading) return <Container className="text-center py-5"><Spinner animation="border" /></Container>;
  
  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom gallery-header">
        <h2><span className="fw-light">Space:</span> {space?.noteKey}</h2>
        <Button variant="outline-secondary" onClick={() => { logout(); navigate('/'); }}>
            <FiLogOut className="me-2"/>Logout
        </Button>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Row xs={2} sm={3} md={4} lg={5} xl={6} className="g-3">
        <Col>
          <Card className="notepad-card h-100 text-center" style={{ cursor: 'pointer' }} onClick={handleCreateNotepad}>
            <Card.Body className="d-flex align-items-center justify-content-center">
              <div>
                <BsPlusLg className="create-card-plus" />
                <div className="mt-2 text-muted">Create New</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        {space?.notepads.map((notepad) => (
          <Col key={notepad._id}>
            <NotepadCard 
              notepad={notepad} 
              spaceId={spaceId} 
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />
          </Col>
        ))}
      </Row>

      <Modal show={showEditModal} onHide={closeEditModal} centered>
        <Modal.Header closeButton><Modal.Title>Edit Notepad Name</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>New Title</Form.Label>
            <Form.Control 
              type="text" 
              value={newTitle} 
              onChange={(e) => setNewTitle(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && saveTitleChanges()}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>Cancel</Button>
          <Button variant="primary" onClick={saveTitleChanges}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={closeDeleteModal} centered>
        <Modal.Header closeButton><Modal.Title>Confirm Deletion</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to delete this notepad? This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteModal}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
      
      <section className="recovery-section mt-5 pt-5 border-top">
        <Row className="justify-content-center">
            <Col md={6}>
                <h4>Recovery Settings</h4>
                <p className="text-muted">Add an email here to ensure you can always recover access to your NoteSpaces.</p>
                {emailMessage && <Alert variant={emailMessage.includes('Failed') ? 'danger' : 'success'}>{emailMessage}</Alert>}
                <Form onSubmit={handleEmailSubmit}>
                    <Form.Group>
                        <Form.Label><FiMail className="me-2"/>Recovery Email</Form.Label>
                        <Form.Control type="email" value={recoveryEmail} onChange={e => setRecoveryEmail(e.target.value)} placeholder="Enter recovery email" />
                    </Form.Group>
                    <Button type="submit" className="mt-3">
                        <FiSave className="me-2"/>Save Email
                    </Button>
                </Form>
            </Col>
        </Row>
      </section>
    </Container>
  );
};

export default NoteSpaceGallery;