"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sync_controller_1 = require("../controllers/sync.controller");
const router = express_1.default.Router();
router.get("/", sync_controller_1.syncData);
exports.default = router;
