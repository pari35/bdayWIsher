
import pool from '../utils/db.js';
import { AppError } from '../middleware/errorHandler.js';

const addBdate = async (userData) => {
  try {
    const { name, email, bdate } = userData;

    // Check if user with email exists
    const getUserQuery = `SELECT * FROM bdayWish WHERE email = $1`;
    const existingUser = await pool.query(getUserQuery, [email]);

    if (existingUser.rows[0]) {
      throw new AppError('User already exists', 409);
    }

    // Insert new record
    const insertQuery = `
      INSERT INTO bdayWish (name, email, bdate)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const result = await pool.query(insertQuery, [name, email, bdate]);

    console.log("Birthday entry added successfully:", result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error("Error adding birthday entry:", error.message);
    throw error;
  }
};


export {
    addBdate
}