


import express from 'express';
import cors from 'cors';
import logger from './utils/logger.js';
import { requestLogger, notFoundHandler, errorHandler } from './middlewares/loggerMiddleware.js';


const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(cors());
app.use(express.json());

app.use(requestLogger);



app.get('/', (req, res) => {
	logger.info('Hello World endpoint hit');
	res.json({ message: 'Hello World' });
});

app.use(notFoundHandler);



app.use(errorHandler);

app.listen(PORT, () => {
	logger.info(`Server running on http://localhost:${PORT}`);
});
