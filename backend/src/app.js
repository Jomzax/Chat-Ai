import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import connectMongo from './db/mongo.js';
import routes from './routes/index.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

const startServer = async () => {
  try {
    await connectMongo();
    app.listen(port, () => {
      console.log(`Backend running on port ${port}`);
    });
  } catch (err) {
    console.error('Server startup failed', err);
    process.exit(1);
  }
};

startServer();
