import { sendMail } from "../cron.js";
import { addBdate } from "../repositories/addBdateRepository.js";

const addBdateService = async (userRegData) => {
  try {
    const regUser = await addBdate(userRegData);
    return regUser
  } catch (err) {
    console.error("Error in bdate service:", err.message);
    throw err 
  }
};

export { addBdateService };
