


import express from 'express';
import cors from 'cors';
import winston from 'winston';
// Winston logger setup
const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
	),
	transports: [
		new winston.transports.Console(),
	],
});


const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
	logger.info(`${req.method} ${req.url}`);
	next();
});



app.get('/', (req, res) => {
	logger.info('Hello World endpoint hit');
	res.json({ message: 'Hello World' });
});

// 404 handler
app.use((req, res, next) => {
	logger.warn(`404 Not Found: ${req.method} ${req.originalUrl}`);
	res.status(404).json({ error: 'Not Found' });
});



// 500 and general error handler
app.use((err, req, res, next) => {
	logger.error(`Error: ${err.message}\nStack: ${err.stack}`);
	if (res.headersSent) {
		return next(err);
	}
	const status = err.status || 500;
	res.status(status).json({
		error: status === 500 ? 'Internal Server Error' : err.message || 'Error',
		details: process.env.NODE_ENV === 'development' ? err.stack : undefined
	});
});

app.listen(PORT, () => {
	logger.info(`Server running on http://localhost:${PORT}`);
});
