"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const campaign_routes_1 = __importDefault(require("./routes/campaign.routes"));
const report_routes_1 = __importDefault(require("./routes/report.routes"));
const sync_routes_1 = __importDefault(require("./routes/sync.routes"));
const social_1 = __importDefault(require("./routes/social"));
const data_routes_1 = __importDefault(require("./routes/data.routes"));
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
const scheduler_1 = require("./utils/scheduler");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/dashboard", dashboard_routes_1.default);
app.use("/api/campaigns", campaign_routes_1.default);
app.use("/api/reports", report_routes_1.default);
app.use("/api/sync", sync_routes_1.default);
app.use("/api/social", social_1.default);
app.use("/api/data", data_routes_1.default);
app.get("/api/health", (_req, res) => {
    res.json({ success: true, message: "Server is healthy." });
});
app.use(error_middleware_1.default);
const PORT = Number(process.env.PORT) || 5001;
(0, db_1.default)()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
        (0, scheduler_1.startScheduler)();
    });
})
    .catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
});
