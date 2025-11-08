import winston from 'winston';
const serviceName = process.env.SERVICE_NAME || 'order-service';
// Generate logid in the format: order-YYYYMMDD-HHMMSS.mmm
const getNextLogId = () => {
    const now = new Date();

    const pad = (num, size = 2) => num.toString().padStart(size, '0');

    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const date = pad(now.getDate());
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());
    const milliseconds = pad(now.getMilliseconds(), 3);

    return `${serviceName}-${year}${month}${date}-${hours}${minutes}${seconds}.${milliseconds}`;
};

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format((info) => {
            info.logid = getNextLogId();
            return info;
        })(),

        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: { service: 'respos-api' },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

logger.add(new winston.transports.Console({
    format: winston.format.simple(),
}));

export default logger;
export { getNextLogId };