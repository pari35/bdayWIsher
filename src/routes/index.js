import express from "express";

const router = express.Router()
import bdayRoutes from './bdayRoutes.js'
// make routes
router.use('/bday', bdayRoutes)

export default  router 