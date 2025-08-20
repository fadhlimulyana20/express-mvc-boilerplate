import express from 'express';
import cors from 'cors';
import logger from './utils/logger';
import { requestLogger, notFoundHandler, errorHandler } from './middlewares/loggerMiddleware';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api', routes);

app.get('/', (req, res) => {
  logger.info('Hello World endpoint hit');
  res.json({ message: 'Hello World' });
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
