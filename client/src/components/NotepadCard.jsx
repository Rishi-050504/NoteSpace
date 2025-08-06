import React from 'react';
import { Card, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsThreeDotsVertical } from 'react-icons/bs'; // Import icon

const ThreeDotsToggle = React.forwardRef(({ onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={(e) => { e.preventDefault(); onClick(e); }}
    className="p-0 text-secondary text-decoration-none"
  >
    {/* Use the new icon component */}
    <BsThreeDotsVertical size={20} />
  </a>
));

const NotepadCard = ({ notepad, spaceId, onEdit, onDelete }) => {
  return (
    <div className="notepad-card h-100">
        <div className="card-actions-overlay">
            <Dropdown>
                <Dropdown.Toggle as={ThreeDotsToggle} id={`dropdown-${notepad._id}`} />
                <Dropdown.Menu align="end">
                    <Dropdown.Item onClick={() => onEdit(notepad)}>Edit Name</Dropdown.Item>
                    <Dropdown.Item onClick={() => onDelete(notepad._id)} className="text-danger">
                        Delete
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
      <Link to={`/space/${spaceId}/notepad/${notepad._id}`} className="text-decoration-none text-dark h-100">
        <Card.Body className="h-100 d-flex align-items-center justify-content-center text-center">
          <Card.Title className="m-0 p-3">{notepad.title}</Card.Title>
        </Card.Body>
      </Link>
    </div>
  );
};

export default NotepadCard;