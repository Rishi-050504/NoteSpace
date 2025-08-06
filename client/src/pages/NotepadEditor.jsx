// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Container, Button, Form, Spinner, Alert, Accordion, Card } from 'react-bootstrap';
// import { FiArrowLeft, FiSave } from 'react-icons/fi';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import { ReactSketchCanvas } from 'react-sketch-canvas';
// import API from '../services/api';

// const NotepadEditor = () => {
//   const { spaceId, notepadId } = useParams();
//   const navigate = useNavigate();
  
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [drawingData, setDrawingData] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, success, error

//   const canvasRef = useRef(null);
  
//   useEffect(() => {
//     const fetchNotepad = async () => {
//       try {
//         setLoading(true);
//         setError('');
//         const { data: spaceData } = await API.get(`/spaces/${spaceId}`);
//         const currentNotepad = spaceData.notepads.find(n => n._id === notepadId);
        
//         if (currentNotepad) {
//           setTitle(currentNotepad.title);
//           setContent(currentNotepad.content);
//           setDrawingData(currentNotepad.drawingData);
//         } else {
//           setError('Notepad not found.');
//         }
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to load notepad. It may have been deleted.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchNotepad();
//   }, [spaceId, notepadId]);

//   useEffect(() => {
//     const quillTooltipMap = {
//       'ql-header': 'Text Style (Heading/Normal)',
//       'ql-bold': 'Bold (Ctrl+B)', 
//       'ql-italic': 'Italic (Ctrl+I)', 
//       'ql-underline': 'Underline (Ctrl+U)', 
//       'ql-strike': 'Strikethrough',
//       'ql-blockquote': 'Blockquote', 
//       'ql-code-block': 'Code Block', 
//       'ql-list[value="ordered"]': 'Ordered List',
//       'ql-list[value="bullet"]': 'Bulleted List', 
//       'ql-link': 'Insert Link', 
//       'ql-clean': 'Remove Formatting'
//     };
//     for (const className in quillTooltipMap) {
//       const element = document.querySelector(`.ql-toolbar .${className}`);
//       if (element) element.setAttribute('title', quillTooltipMap[className]);
//     }
//   }, []);

//   const handleSave = async () => {
//     setSaveStatus('saving');
//     setError('');
//     if (!title || title.trim() === '') {
//         setError("Title is required and cannot be empty.");
//         setSaveStatus('error');
//         return;
//     }
//     try {
//       await API.put(`/spaces/${spaceId}/notepads/${notepadId}`, { title, content, drawingData });
//       setSaveStatus('success');
//       setTimeout(() => setSaveStatus('idle'), 2000);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to save changes.');
//       setSaveStatus('error');
//     }
//   };

//   const quillModules = {
//     toolbar: {
//       container: [
//         [{ 'header': [1, 2, 3, false] }],
//         ['bold', 'italic', 'underline', 'strike'], 
//         ['blockquote', 'code-block'],
//         [{'list': 'ordered'}, {'list': 'bullet'}],
//         ['link'],
//         ['clean']
//       ],
//     },
//   };

//   if (loading) return <Container className="text-center py-5"><Spinner animation="border" /></Container>;
  
//   return (
//     <Container className="py-4 py-md-5">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <Button variant="link" onClick={() => navigate(`/space/${spaceId}`)} className="text-secondary text-decoration-none p-0">
//           <FiArrowLeft size={20} className="me-2"/>Back to Gallery
//         </Button>
//         <div className="d-flex align-items-center" style={{minWidth: '150px', textAlign: 'right'}}>
//           {saveStatus === 'saving' && <><Spinner size="sm" animation="border" /> <span className="ms-2">Saving...</span></>}
//           {saveStatus === 'success' && <span className="text-success fw-bold">Saved!</span>}
//           <Button variant="primary" onClick={handleSave} className="ms-3" disabled={saveStatus === 'saving'}>
//             <FiSave className="me-2"/> Save Changes
//           </Button>
//         </div>
//       </div>

//       {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      
//       <Card className="notepad-editor-card">
//         <Card.Body>
//           <Form.Control 
//             type="text" 
//             value={title} 
//             onChange={(e) => setTitle(e.target.value)} 
//             className="mb-3 fs-2 border-0 shadow-none p-0 notepad-editor-title"
//             placeholder="Notepad Title"
//           />
          
//           <ReactQuill 
//             theme="snow" 
//             value={content} 
//             onChange={setContent} 
//             modules={quillModules} 
//           />
          
//           <Accordion defaultActiveKey="0" className="mt-4">
//             <Accordion.Item eventKey="0">
//               <Accordion.Header>Scratch Pad</Accordion.Header>
//               <Accordion.Body>
//                  <ReactSketchCanvas
//                     ref={canvasRef}
//                     strokeWidth={4}
//                     strokeColor="black"
//                     onStroke={async () => { 
//                       if (canvasRef.current) {
//                         const data = await canvasRef.current.exportSvg(); 
//                         setDrawingData(data); 
//                       }
//                     }}
//                   />
//                  <Button variant="outline-danger" size="sm" className="mt-2" onClick={() => { if(canvasRef.current) { canvasRef.current.clearCanvas(); setDrawingData(''); }}}>
//                     Clear
//                  </Button>
//               </Accordion.Body>
//             </Accordion.Item>
//           </Accordion>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };

// export default NotepadEditor;
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Form, Spinner, Alert, Accordion, Card } from 'react-bootstrap';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import API from '../services/api';

const NotepadEditor = () => {
  const { spaceId, notepadId } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [drawingData, setDrawingData] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState('idle');
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);
  const quillRef = useRef(null);
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const fetchNotepad = async () => {
      try {
        setLoading(true);
        setError('');
        const { data: spaceData } = await API.get(`/spaces/${spaceId}`);
        const currentNotepad = spaceData.notepads.find(n => n._id === notepadId);
        
        if (currentNotepad) {
          setTitle(currentNotepad.title);
          setContent(currentNotepad.content);
          setDrawingData(currentNotepad.drawingData);
        } else {
          setError('Notepad not found.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load notepad. It may have been deleted.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotepad();
  }, [spaceId, notepadId]);

  useEffect(() => {
    const quillTooltipMap = {
      'ql-header': 'Text Style (Heading/Normal)',
      'ql-bold': 'Bold (Ctrl+B)', 'ql-italic': 'Italic (Ctrl+I)', 'ql-underline': 'Underline (Ctrl+U)',
      'ql-strike': 'Strikethrough', 'ql-blockquote': 'Blockquote', 'ql-code-block': 'Code Block',
      'ql-list[value="ordered"]': 'Ordered List', 'ql-list[value="bullet"]': 'Bulleted List',
      'ql-link': 'Insert Link', 'ql-clean': 'Remove Formatting',
      'ql-dictate': 'Start/Stop Dictation'
    };
    for (const className in quillTooltipMap) {
      const element = document.querySelector(`.ql-toolbar .${className}`);
      if (element) element.setAttribute('title', quillTooltipMap[className]);
    }
  }, []);

  const handleSave = async () => {
    setSaveStatus('saving');
    setError('');
    if (!title || title.trim() === '') {
        setError("Title is required and cannot be empty.");
        setSaveStatus('error');
        return;
    }
    try {
      await API.put(`/spaces/${spaceId}/notepads/${notepadId}`, { title, content, drawingData });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save changes.');
      setSaveStatus('error');
    }
  };

  const handleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (!recognitionRef.current) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setError("Speech recognition is not supported in this browser.");
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        const quill = quillRef.current?.getEditor();
        if (!quill) return;
        
        const transcript = event.results[0][0].transcript.trim() + ' ';
        const range = quill.getSelection(true) || { index: quill.getLength(), length: 0 };
        quill.insertText(range.index, transcript, 'user');
        quill.setSelection(range.index + transcript.length);
      };
      
      recognitionRef.current = recognition;
    }
    
    if (quillRef.current) quillRef.current.focus();
    recognitionRef.current.start();
  };

  const quillModules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'], 
        ['blockquote', 'code-block'],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['link'], ['clean'], ['dictate']
      ],
      handlers: { 'dictate': handleListen },
    },
  };

  if (loading) return <Container className="text-center py-5"><Spinner animation="border" /></Container>;
  
  return (
    <Container className="py-4 py-md-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="link" onClick={() => navigate(`/space/${spaceId}`)} className="text-secondary text-decoration-none p-0">
          <FiArrowLeft size={20} className="me-2"/>Back to Gallery
        </Button>
        <div className="d-flex align-items-center" style={{minWidth: '150px', textAlign: 'right'}}>
          {saveStatus === 'saving' && <><Spinner size="sm" animation="border" /> <span className="ms-2">Saving...</span></>}
          {saveStatus === 'success' && <span className="text-success fw-bold">Saved!</span>}
          <Button variant="primary" onClick={handleSave} className="ms-3" disabled={saveStatus === 'saving'}>
            <FiSave className="me-1"/> Save
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      
      <Card className="notepad-editor-card">
        <Card.Body>
          <Form.Control 
            type="text" value={title} onChange={(e) => setTitle(e.target.value)} 
            className="mb-3 fs-2 border-0 shadow-none p-0 notepad-editor-title"
            placeholder="Notepad Title"
          />
          <div className={isListening ? 'is-listening' : ''}>
            <ReactQuill 
              ref={quillRef} theme="snow" value={content} onChange={setContent} 
              modules={quillModules} 
            />
          </div>
          <Accordion defaultActiveKey="0" className="mt-4">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Scratch Pad</Accordion.Header>
              <Accordion.Body>
                 <ReactSketchCanvas
                    ref={canvasRef}
                    strokeWidth={4}
                    strokeColor="black"
                    onStroke={async () => { 
                      if (canvasRef.current) {
                        const data = await canvasRef.current.exportSvg(); 
                        setDrawingData(data); 
                      }
                    }}
                  />
                 <Button variant="outline-danger" size="sm" className="mt-2" onClick={() => { if(canvasRef.current) { canvasRef.current.clearCanvas(); setDrawingData(''); }}}>
                    Clear
                 </Button>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default NotepadEditor;