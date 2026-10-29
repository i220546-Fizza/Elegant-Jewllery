const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes');

connectDB();

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((o) => o.trim());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS only applies to the API - static files (the built frontend, uploaded
// images) are served from this same origin and never need a CORS check.
// Vite marks its generated <script>/<link> tags crossorigin, which makes the
// browser send an Origin header even for same-origin asset requests; a
// globally-applied cors() middleware would reject those if the current
// domain isn't in CLIENT_URL, turning a same-origin asset load into a 500.
app.use(
  '/api',
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.get('/api/health', (req, res) => res.json({ success: true, message: 'Fizara-N-Sitara API is running' }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/admin', adminRoutes);

// If the frontend has been built (client/dist), serve it from this same
// server so the deployed site is a single origin - no CORS, no separate
// "which domain is the API on" configuration to get wrong. Local dev keeps
// using the two-server Vite proxy setup unless you've also run a client build.
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(
    express.static(clientDistPath, {
      // Vite content-hashes everything under /assets, so those files are safe
      // to cache forever - a changed file gets a new filename. index.html is
      // NOT hashed and must always be revalidated, or browsers/CDNs can keep
      // serving a stale shell that references deleted asset filenames.
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('index.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        } else if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      },
    })
  );
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Fizara-N-Sitara API listening on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
