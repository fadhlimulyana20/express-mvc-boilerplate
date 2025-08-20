
import winston from 'winston';
import LokiTransport from 'winston-loki';

const transports: winston.transport[] = [
  new winston.transports.Console(),
];

// Optional Loki integration
if (process.env.LOKI_ENABLED === 'true' && process.env.LOKI_HOST) {
  transports.push(
    new LokiTransport({
      host: process.env.LOKI_HOST,
      labels: { app: 'express-mvc' },
      json: true,
      // You can add more Loki options here as needed
    })
  );
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
  ),
  transports,
});

export default logger;
