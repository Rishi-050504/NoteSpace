const NoteSpace = require('../models/noteSpaceModel');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '12h',
  });
};

const createSpace = async (req, res) => {
  try {
    const { noteKey, password } = req.body;
    if (!noteKey || !password) {
      return res.status(400).json({ message: 'Please provide a note key and password' });
    }
    const spaceExists = await NoteSpace.findOne({ noteKey });
    if (spaceExists) {
      return res.status(400).json({ message: 'This note key is already taken' });
    }
    const noteSpace = await NoteSpace.create({ noteKey, password });
    res.status(201).json({
      _id: noteSpace._id,
      noteKey: noteSpace.noteKey,
      token: generateToken(noteSpace._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during space creation', error: error.message });
  }
};

const accessSpace = async (req, res) => {
  try {
    const { noteKey, password } = req.body;
    const noteSpace = await NoteSpace.findOne({ noteKey });
    if (noteSpace && (await noteSpace.comparePassword(password))) {
      res.json({
        _id: noteSpace._id,
        noteKey: noteSpace.noteKey,
        notepads: noteSpace.notepads,
        token: generateToken(noteSpace._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid note key or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during space access', error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: 'Token and new password are required.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const noteSpace = await NoteSpace.findById(decoded.id);

    if (noteSpace) {
      // Set the new password. The pre-save hook will automatically hash it.
      noteSpace.password = password;
      await noteSpace.save();
      res.json({ message: 'Password has been reset successfully.' });
    } else {
      res.status(404).json({ message: 'NoteSpace not found or link is invalid.' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Password reset link is invalid or has expired.' });
  }
};

const getSpaceById = async (req, res) => {
  try {
    if (req.spaceId !== req.params.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const noteSpace = await NoteSpace.findById(req.params.id).select('-password');
    if (noteSpace) {
      res.json(noteSpace);
    } else {
      res.status(404).json({ message: 'NoteSpace not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching space', error: error.message });
  }
};

const createNotepad = async (req, res) => {
  try {
    if (req.spaceId !== req.params.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { title } = req.body;
    const noteSpace = await NoteSpace.findById(req.params.id);
    if (noteSpace) {
      const notepad = { title: (title && title.trim() !== '') ? title : 'Untitled Notepad' };
      noteSpace.notepads.push(notepad);
      await noteSpace.save();
      const newNotepad = noteSpace.notepads[noteSpace.notepads.length - 1];
      res.status(201).json(newNotepad);
    } else {
      res.status(404).json({ message: 'NoteSpace not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating notepad', error: error.message });
  }
};

const updateNotepad = async (req, res) => {
  try {
    if (req.spaceId !== req.params.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { title, content, drawingData } = req.body;
    const noteSpace = await NoteSpace.findById(req.params.id);
    if (noteSpace) {
      const notepad = noteSpace.notepads.id(req.params.notepadId);
      if (notepad) {
        notepad.title = title ?? notepad.title;
        notepad.content = content ?? notepad.content;
        notepad.drawingData = drawingData ?? notepad.drawingData;
        await noteSpace.save();
        res.json(notepad);
      } else {
        res.status(404).json({ message: 'Notepad not found' });
      }
    } else {
      res.status(404).json({ message: 'NoteSpace not found' });
    }
  } catch (error) {
    console.error("Update Notepad Error:", error);
    res.status(500).json({ message: 'Server error while updating notepad', error: error.message });
  }
};

const deleteNotepad = async (req, res) => {
  try {
    // Auth check remains the same
    if (req.spaceId !== req.params.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Use the atomic $pull operator with findByIdAndUpdate.
    // This finds the NoteSpace and directly removes the subdocument from the
    // notepads array in a single database operation.
    const result = await NoteSpace.findByIdAndUpdate(
      req.params.id, // Find the parent NoteSpace document
      { $pull: { notepads: { _id: req.params.notepadId } } }, // Pull the notepad with the matching _id from the array
      { new: true } // This option is not strictly needed here but is good practice
    );
    
    if (!result) {
      return res.status(404).json({ message: 'NoteSpace not found' });
    }
    
    res.json({ message: 'Notepad removed successfully' });

  } catch (error) {
    console.error("Delete Notepad Error:", error);
    res.status(500).json({ message: 'Server error while deleting notepad', error: error.message });
  }
};

const addRecoveryEmail = async (req, res) => {
  try {
    if (req.spaceId !== req.params.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const noteSpace = await NoteSpace.findByIdAndUpdate(req.params.id, { recoveryEmail: email });
    if (noteSpace) {
      res.json({ message: `Recovery email updated to ${email}` });
    } else {
      res.status(404).json({ message: 'NoteSpace not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error while adding recovery email', error: error.message });
  }
};

module.exports = {
  createSpace,
  accessSpace,
  getSpaceById,
  createNotepad,
  updateNotepad,
  deleteNotepad,
  addRecoveryEmail,
  resetPassword, 
};