import express from "express";
const router = express.Router();
import { showTrains } from "../controllers/showTrains.js";

router.route("/trains").get(showTrains);

export default router;
