const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const routes = require('./routes'); // Import router utama dari folder routes

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Gunakan router utama
app.use('/api', routes); // Menggunakan rute-rute di bawah /api, sesuaikan dengan kebutuhan

// Handle 404 errors
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message || 'Internal Server Error',
    },
  });
});

// Start server dengan Nodemon
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app; // Export app untuk pengujian dengan Mocha atau tes lainnya
