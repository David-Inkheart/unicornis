import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf((info) => {
          const meta = info[Symbol.for('splat')];
          const metaData = meta && meta.length ? JSON.stringify(meta) : '';
          return `${info.level}: ${info.message} ${metaData}`;
        }),
      ),
    }),
  ],
  exceptionHandlers: [new winston.transports.File({ filename: 'exceptions.log' })],
});

// If we're in production, log to files
if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.File({ filename: 'error.log', level: 'error' }));
  logger.add(new winston.transports.File({ filename: 'combined.log' }));
}

export default logger;
