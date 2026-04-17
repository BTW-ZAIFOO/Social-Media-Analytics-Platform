"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateROI = calculateROI;
exports.buildCsv = buildCsv;
exports.normalizeSyncDate = normalizeSyncDate;
function calculateROI(revenue, spend) {
    const revenueValue = Number(revenue || 0);
    const spendValue = Number(spend || 0);
    if (spendValue === 0) {
        return 0;
    }
    return (revenueValue - spendValue) / spendValue;
}
function buildCsv(rows, headers) {
    const quoted = (value) => {
        if (value == null)
            return "";
        const stringValue = String(value).replace(/"/g, '""');
        return `"${stringValue}"`;
    };
    const csvRows = [headers.map(quoted).join(",")];
    rows.forEach((row) => {
        const values = headers.map((header) => quoted(row[header]));
        csvRows.push(values.join(","));
    });
    return csvRows.join("\n");
}
function normalizeSyncDate(date) {
    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0);
    return normalizedDate;
}
