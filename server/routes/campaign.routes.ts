import express from "express";
import {
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from "../controllers/campaign.controller";

const router = express.Router();

router.route("/").get(getCampaigns).post(createCampaign);
router.route("/:id").put(updateCampaign).delete(deleteCampaign);

export default router;
