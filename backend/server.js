const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDatabase } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const projectRoutes = require('./routes/projectRoutes');
const inspectionRoutes = require('./routes/inspectionRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const clientOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const isAllowedClientOrigin = (origin, callback) => {
  if (!origin || clientOrigins.includes(origin)) {
    callback(null, true);
    return;
  }

  const isDevelopmentLoopback = process.env.NODE_ENV !== 'production'
    && /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

  callback(null, isDevelopmentLoopback);
};

app.use(
  cors({
    origin: isAllowedClientOrigin,
    credentials: true,
  }),
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'PARAKH API is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/inspections', inspectionRoutes);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error.' });
});

async function startServer() {
  await connectDatabase();

  app.listen(port, () => {
    console.log(`PARAKH server running on http://localhost:${port}`);
  });
}

startServer();
