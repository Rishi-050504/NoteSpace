console.log("--- SERVER RUNNING LATEST VERSION - TEST 123 ---");
const dotenv = require('dotenv');
dotenv.config();

// Now, we can safely require other modules
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const spaceRoutes = require('./routes/spaceRoutes');
const recoveryRoutes = require('./routes/recoveryRoutes');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/spaces', spaceRoutes);
app.use('/api/recovery', recoveryRoutes);

app.get('/', (req, res) => {
  res.send('NoteSpace API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});