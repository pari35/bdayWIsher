

import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import { scheduleCronJobs } from './cron.js';

dotenv.config();

const app = express();
const runport = process.env.runport || 5000;

// CORS configuration

// Basic middleware
app.use(express.json());

// Static files handling


// Performance Monitoring
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    });
    next();
});


// Routes
app.use('/api/v1', routes);


// Start server
app.listen(runport, async () => {
    scheduleCronJobs()
    // await testDatabaseConnection();
    console.log(`Server is running on http://localhost:${runport}`);
});

app.get('/', (req, res) => {
    res.status(200).json({ status: 'Ok' });
})
export default app;