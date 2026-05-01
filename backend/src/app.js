import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import connectMongo from './db/mongo.js';
import routes from './routes/index.js';
import { ensureDefaultAdmin } from './services/authService.js';
import { startUploadCleanupJob } from './services/uploadCleanup.js';

dotenv.config({
  path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env'),
});

const app = express();
const port = process.env.PORT || 4000;
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://127.0.0.1:3000,http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (isProduction && !process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET is required in production.');
}

if (isProduction) {
  app.set('trust proxy', 1);
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    name: process.env.SESSION_COOKIE_NAME || 'chat_ai.sid',
    secret: process.env.SESSION_SECRET || 'change-this-session-secret',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
      ttl: Number(process.env.SESSION_TTL_SECONDS || 60 * 60 * 24),
    }),
    cookie: {
      httpOnly: true,
      maxAge: Number(process.env.SESSION_TTL_SECONDS || 60 * 60 * 24) * 1000,
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
    },
  })
);
app.use('/uploads', express.static(resolve(process.cwd(), 'uploads')));

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal server error',
  });
});

const startServer = async () => {
  try {
    await connectMongo();
    await ensureDefaultAdmin();
    startUploadCleanupJob();
    app.listen(port, () => {
      console.log(`Backend running on port ${port}`);
    });
  } catch (err) {
    console.error('Server startup failed', err);
    process.exit(1);
  }
};

startServer();
