import schedule from 'node-schedule'
import nodemailer from 'nodemailer';
import pool from '../src/utils/db.js';
import logger from './logger.js';
import cron from 'node-cron';

let cachedTransporter = null
function createTransporter() {
    const host = "smtp.gmail.com"
    const port = 465
    const secure = true
    const user = "paritoshpardeshi35@gmail.com"
    const pass = "hgtdrxothfrrhhhi"

    if (!host || !port || !user || !pass) {
        throw new Error('SMTP configuration missing. Ensure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS are set');
    }

    return nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
        pool: true,
    });
}


const scheduleCronJobs = () => {
    // Logs when the cron job is scheduled and active
    // cron.schedule('*/1 * * * *', async () => {
        cron.schedule('0 7 * * *', async () => {
        logger.info('Cron job starting: Sending Birthday Mail...');
        try {
        
            let sendMailDetails = await sendMail()

        } catch (error) {
            // Logs detailed error if cron job fails
            logger.error('Error in order notifications cron job:', error);
        }
    });
}

const sendMail = async () => {

    let todaysBdays = await getTodaysBirthdays()

    try {
        if (!cachedTransporter) {
            cachedTransporter = createTransporter();
        }

        if (todaysBdays.length > 0) {
            let todaysBdaysArr = await Promise.all(todaysBdays.map(async (b) => {
                let to = b.email
                let subject = `Happy Birthday, ${b.name}`
                let text = `Wishing you a wonderful birthday, ${b.name}!`
                const info = await cachedTransporter.sendMail({
                    from: "paritoshpardeshi35@gmail.com",
                    to,
                    subject,
                    text
                })
                logger.info('Email sent', { messageId: info.messageId, to });
            }))
        }

    } catch (error) {
        logger.error('Error sending email', { error: error.message, stack: error.stack });
        throw error;
    }
}

const getTodaysBirthdays = async () => {
    try {
        const query = `
      SELECT *
      FROM bdayWish
      WHERE EXTRACT(MONTH FROM bdate AT TIME ZONE 'Asia/Kolkata') = EXTRACT(MONTH FROM CURRENT_DATE AT TIME ZONE 'Asia/Kolkata')
        AND EXTRACT(DAY FROM bdate AT TIME ZONE 'Asia/Kolkata') = EXTRACT(DAY FROM CURRENT_DATE AT TIME ZONE 'Asia/Kolkata');
    `;

        const result = await pool.query(query);
        return result.rows;
    } catch (err) {
        console.error('Error fetching today\'s birthdays:', err.message);
        throw err;
    }
};

export {
    scheduleCronJobs,
    sendMail
}