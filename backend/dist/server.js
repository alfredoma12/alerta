"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const store_1 = require("./store");
const app = (0, express_1.default)();
const port = Number(process.env.PORT || 3000);
// Allow frontend requests from any origin for now.
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Log each incoming request to keep local debugging simple.
app.use((req, _res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});
function getRequiredString(value, fieldName) {
    if (typeof value !== 'string' || !value.trim()) {
        return {
            ok: false,
            message: `${fieldName} is required and must be a non-empty string.`,
        };
    }
    return { ok: true, value: value.trim() };
}
app.get('/', (_req, res) => {
    res.json({ message: 'Stolen car backend is running.' });
});
app.get('/reports', async (_req, res) => {
    try {
        const reports = await (0, store_1.getAllReports)();
        res.json(reports);
    }
    catch (error) {
        console.error('Failed to load all reports:', error);
        res.status(500).json({ error: 'Could not load reports.' });
    }
});
app.post('/reports', async (req, res) => {
    const { licensePlate, description, location, contact } = req.body;
    const licensePlateResult = getRequiredString(licensePlate, 'licensePlate');
    if (!licensePlateResult.ok) {
        res.status(400).json({ error: licensePlateResult.message });
        return;
    }
    const descriptionResult = getRequiredString(description, 'description');
    if (!descriptionResult.ok) {
        res.status(400).json({ error: descriptionResult.message });
        return;
    }
    const locationResult = getRequiredString(location, 'location');
    if (!locationResult.ok) {
        res.status(400).json({ error: locationResult.message });
        return;
    }
    const contactResult = getRequiredString(contact, 'contact');
    if (!contactResult.ok) {
        res.status(400).json({ error: contactResult.message });
        return;
    }
    try {
        const report = await (0, store_1.createReport)({
            licensePlate: licensePlateResult.value,
            description: descriptionResult.value,
            location: locationResult.value,
            contact: contactResult.value,
        });
        res.status(201).json(report);
    }
    catch (error) {
        console.error('Failed to create report:', error);
        res.status(500).json({ error: 'Could not save the report.' });
    }
});
app.get('/reports/:licensePlate', async (req, res) => {
    const rawLicensePlate = req.params.licensePlate;
    const licensePlate = Array.isArray(rawLicensePlate) ? rawLicensePlate[0] : rawLicensePlate;
    const licensePlateResult = getRequiredString(licensePlate, 'licensePlate');
    if (!licensePlateResult.ok) {
        res.status(400).json({ error: licensePlateResult.message });
        return;
    }
    try {
        const reports = await (0, store_1.findReportsByLicensePlate)(licensePlateResult.value);
        res.json(reports);
    }
    catch (error) {
        console.error('Failed to search reports:', error);
        res.status(500).json({ error: 'Could not load reports.' });
    }
});
app.post('/alerts', async (req, res) => {
    const { licensePlate, seenLocation } = req.body;
    const licensePlateResult = getRequiredString(licensePlate, 'licensePlate');
    if (!licensePlateResult.ok) {
        res.status(400).json({ error: licensePlateResult.message });
        return;
    }
    const seenLocationResult = getRequiredString(seenLocation, 'seenLocation');
    if (!seenLocationResult.ok) {
        res.status(400).json({ error: seenLocationResult.message });
        return;
    }
    try {
        const matchingReports = await (0, store_1.findReportsByLicensePlate)(licensePlateResult.value);
        if (matchingReports.length === 0) {
            res.json({
                message: `No report found for plate ${(0, store_1.normalizeLicensePlate)(licensePlateResult.value)}.`,
            });
            return;
        }
        console.log(`ALERT: stolen car spotted | plate=${(0, store_1.normalizeLicensePlate)(licensePlateResult.value)} | seenLocation=${seenLocationResult.value} | matches=${matchingReports.length}`);
        res.json({
            message: 'Alert simulated successfully.',
            licensePlate: (0, store_1.normalizeLicensePlate)(licensePlateResult.value),
            seenLocation: seenLocationResult.value,
            matchesFound: matchingReports.length,
            reports: matchingReports,
        });
    }
    catch (error) {
        console.error('Failed to trigger alert:', error);
        res.status(500).json({ error: 'Could not trigger alert.' });
    }
});
app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found.' });
});
async function startServer() {
    await (0, store_1.initializeStore)();
    app.listen(port, () => {
        console.log(`Backend running on http://localhost:${port}`);
    });
}
startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
