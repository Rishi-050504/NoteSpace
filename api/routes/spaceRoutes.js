// server/routes/spaceRoutes.js
const express = require('express');
const router = express.Router();
const {
  createSpace,
  accessSpace,
  getSpaceById,
  createNotepad,
  updateNotepad,
  deleteNotepad,
  addRecoveryEmail,
   resetPassword,
} = require('../controllers/spaceController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/', createSpace);
router.post('/access', accessSpace);

// Protected routes (require a valid JWT)
router.get('/:id', protect, getSpaceById);
router.put('/:id/recovery-email', protect, addRecoveryEmail);

// Notepad specific routes
router.post('/:id/notepads', protect, createNotepad);
router.put('/:id/notepads/:notepadId', protect, updateNotepad);
router.delete('/:id/notepads/:notepadId', protect, deleteNotepad);

//Password reset
router.post('/reset-password', resetPassword);

module.exports = router;