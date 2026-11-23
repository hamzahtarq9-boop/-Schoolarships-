import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';
import { query } from './db/pool.js';
import postsRouter from './routes/posts.js';
import messagesRouter from './routes/messages.js';
import quotesRouter from './routes/quotes.js';
import adminRouter from './routes/admin.js';
import { errorHandler, notFound } from './middleware/errors.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1); // Render / Vercel sit behind a proxy
  app.disable('x-powered-by');
  app.use(helmet());

  app.use(
    cors({
      origin(origin, callback) {
        // Allow server-to-server tools (no Origin) and any configured origin.
        if (!origin || config.corsOrigins.length === 0 || config.corsOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(null, false);
      },
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'x-admin-secret'],
      maxAge: 86_400,
    }),
  );

  app.use(express.json({ limit: '100kb' }));

  app.use(
    '/api',
    rateLimit({
      windowMs: 60 * 1000,
      limit: 300,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      message: { error: 'طلبات كثيرة، حاول بعد دقيقة' },
    }),
  );

  app.get('/', (req, res) => {
    res.json({ name: 'Noor wa Sakina API', status: 'ok', docs: '/api/health' });
  });

  app.get('/api/health', async (req, res) => {
    try {
      await query('SELECT 1');
      res.json({ status: 'ok', database: 'connected', time: new Date().toISOString() });
    } catch (err) {
      res.status(503).json({ status: 'error', database: 'unreachable', error: err.message });
    }
  });

  app.use('/api/posts', postsRouter);
  app.use('/api/messages', messagesRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api', quotesRouter);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
