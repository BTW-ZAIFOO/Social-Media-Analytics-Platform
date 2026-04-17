import express from "express";
import { syncData } from "../controllers/sync.controller";

const router = express.Router();

router.get("/", syncData);

export default router;
