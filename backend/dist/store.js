"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeLicensePlate = normalizeLicensePlate;
exports.createReport = createReport;
exports.findReportsByLicensePlate = findReportsByLicensePlate;
exports.getAllReports = getAllReports;
exports.initializeStore = initializeStore;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const dataDirectory = path_1.default.join(__dirname, '..', 'data');
const reportsFilePath = path_1.default.join(dataDirectory, 'reports.json');
async function ensureReportsFile() {
    await fs_1.promises.mkdir(dataDirectory, { recursive: true });
    try {
        await fs_1.promises.access(reportsFilePath);
    }
    catch {
        await fs_1.promises.writeFile(reportsFilePath, '[]', 'utf-8');
    }
}
function normalizeLicensePlate(licensePlate) {
    return licensePlate.toUpperCase().replace(/\s+/g, '').trim();
}
async function readReports() {
    await ensureReportsFile();
    try {
        const fileContent = await fs_1.promises.readFile(reportsFilePath, 'utf-8');
        if (!fileContent.trim()) {
            return [];
        }
        const parsed = JSON.parse(fileContent);
        if (!Array.isArray(parsed)) {
            console.warn('reports.json did not contain an array. Resetting file.');
            await writeReports([]);
            return [];
        }
        return parsed;
    }
    catch (error) {
        console.warn('reports.json was empty or corrupted. Resetting file.', error);
        await writeReports([]);
        return [];
    }
}
async function writeReports(reports) {
    await ensureReportsFile();
    await fs_1.promises.writeFile(reportsFilePath, JSON.stringify(reports, null, 2), 'utf-8');
}
async function createReport(input) {
    const reports = await readReports();
    const report = {
        id: crypto.randomUUID(),
        licensePlate: normalizeLicensePlate(input.licensePlate),
        description: input.description.trim(),
        location: input.location.trim(),
        contact: input.contact.trim(),
        date: new Date().toISOString(),
    };
    reports.push(report);
    await writeReports(reports);
    return report;
}
async function findReportsByLicensePlate(licensePlate) {
    const reports = await readReports();
    const normalizedPlate = normalizeLicensePlate(licensePlate);
    return reports.filter((report) => report.licensePlate === normalizedPlate);
}
async function getAllReports() {
    return readReports();
}
async function initializeStore() {
    await ensureReportsFile();
}
