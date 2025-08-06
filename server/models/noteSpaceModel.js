const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const notepadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: '' },
  // imageUrls: [{ type: String }],
  drawingData: { type: String, default: '' },
}, { timestamps: true });

const noteSpaceSchema = new mongoose.Schema({
  noteKey: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  recoveryEmail: {
    type: String,
    lowercase: true,
    trim: true,
  },
  notepads: [notepadSchema],
}, { timestamps: true });

noteSpaceSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

noteSpaceSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const NoteSpace = mongoose.model('NoteSpace', noteSpaceSchema);
module.exports = NoteSpace;