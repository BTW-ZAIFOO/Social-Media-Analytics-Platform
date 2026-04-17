import type { CampaignPayload } from "../types";

export function calculateROI(revenue: number, spend: number): number {
  const revenueValue = Number(revenue || 0);
  const spendValue = Number(spend || 0);

  if (spendValue === 0) {
    return 0;
  }

  return (revenueValue - spendValue) / spendValue;
}

export function buildCsv<T extends Record<string, unknown>>(
  rows: T[],
  headers: string[],
): string {
  const quoted = (value: unknown) => {
    if (value == null) return "";
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

export function normalizeSyncDate(date: string | Date): Date {
  const normalizedDate = new Date(date);
  normalizedDate.setUTCHours(0, 0, 0, 0);
  return normalizedDate;
}
