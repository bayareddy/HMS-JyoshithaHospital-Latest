const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const tenantsRoutes = require('./routes/tenants');
const departmentsRoutes = require('./routes/departments');
const staffRoutes = require('./routes/staff');
const patientsRoutes = require('./routes/patients');
const appointmentsRoutes = require('./routes/appointments');
const qualificationsRoutes = require('./routes/qualifications');
const rolesRoutes = require('./routes/roles');
const availabilitiesRoutes = require('./routes/availabilities');
const shiftsRoutes = require('./routes/shifts');
const statesRoutes = require('./routes/states');
const reasonsRoutes = require('./routes/reasons');
const tasksRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', port: PORT });
});

// Routes
app.use('/api/tenants', tenantsRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/patients', patientsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/qualifications', qualificationsRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/availabilities', availabilitiesRoutes);
app.use('/api/shifts', shiftsRoutes);
app.use('/api/states', statesRoutes);
app.use('/api/reasons', reasonsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/scheduleTemplates', require('./routes/scheduleTemplates'));
app.use('/api/timeOff', require('./routes/timeOff'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message });
});

// Serve static files from the backend/server.js running in the root directory
// The dist folder is at the root level after frontend build
const distPath = path.join(__dirname, '../dist');
console.log('Serving static files from:', distPath);
console.log('Process cwd:', process.cwd());

// Serve static files
app.use(express.static(distPath, { 
  etag: false,
  maxAge: '1d',
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  // Check if this looks like an API request that wasn't handled
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  const indexPath = path.join(__dirname, '../dist/index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      console.log('Tried to serve:', indexPath);
      res.status(500).send('Error loading application');
    }
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});