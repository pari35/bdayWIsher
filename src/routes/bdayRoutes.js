import express from "express";
import { addBdateController } from "../controllers/bdateController.js";

const router = express.Router()

router.post('/addBdate',addBdateController)


export default router