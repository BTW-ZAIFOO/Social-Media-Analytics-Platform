import express from "express";
import { downloadReport } from "../controllers/report.controller";

const router = express.Router();

router.get("/", downloadReport);

export default router;
