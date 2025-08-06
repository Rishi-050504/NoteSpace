const NoteSpace = require('../models/noteSpaceModel');
const { Resend } = require('resend');
const jwt = require('jsonwebtoken');

// This token's purpose is now specifically for resetting a password
const generatePasswordResetToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const sendPasswordResetLink = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Please provide an email address.' });
    }
    const resend = new Resend(process.env.RESEND_API_KEY);
    const spaces = await NoteSpace.find({ recoveryEmail: email.toLowerCase() }).select('_id noteKey');
    
    if (!spaces || spaces.length === 0) {
      return res.status(200).json({ message: 'If an account with this email exists, a recovery email has been sent.' });
    }

    const resetLinksList = spaces.map(space => {
        const token = generatePasswordResetToken(space._id);
        const url = `http://localhost:3000/reset-password?token=${token}`; // New URL
        return `<li>Reset password for <strong>${space.noteKey}</strong>: <a href="${url}">Click Here</a></li>`;
    }).join('');

    await resend.emails.send({
        from: process.env.RECOVERY_EMAIL_FROM,
        to: email,
        subject: 'Reset Your NoteSpace Password', // New Subject
        html: `
          <h1>NoteSpace Password Reset</h1>
          <p>You requested to reset the password for your NoteSpaces. Please click a link below to set a new password. These links are valid for 15 minutes.</p>
          <ul>
            ${resetLinksList}
          </ul>
          <p>If you did not request this, please ignore this email.</p>
        `,
    });

    res.status(200).json({ message: 'If an account with this email exists, a password reset email has been sent.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send recovery email.' });
  }
};

// Update the export name
module.exports = { sendPasswordResetLink };