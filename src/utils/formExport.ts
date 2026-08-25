import * as XLSX from "xlsx";
import { DynamicForm, FormSubmission } from "@/types/form";

/**
 * Format timestamp to WIB readable format
 */
function formatDateWIB(dateStr?: string): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const pad = (n: number) => String(n).padStart(2, "0");
    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear();
    const hours = pad(d.getHours());
    const mins = pad(d.getMinutes());
    const secs = pad(d.getSeconds());
    return `${day}/${month}/${year} ${hours}:${mins}:${secs}`;
  } catch {
    return dateStr;
  }
}

/**
 * Clean string for safe filenames
 */
function sanitizeFilename(title: string): string {
  return title
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "_");
}

/**
 * Prepare raw structured rows from form and submissions
 */
function buildExportData(form: DynamicForm, submissions: FormSubmission[]) {
  const fields = form.fields_schema || [];
  
  // Headers
  const headers = ["No", "ID Respon", "Waktu Pengisian", ...fields.map((f) => f.label || f.id)];

  // Rows
  const rows = submissions.map((sub, idx) => {
    const rowObj: Record<string, any> = {
      No: idx + 1,
      "ID Respon": sub.id,
      "Waktu Pengisian": formatDateWIB(sub.submitted_at),
    };

    fields.forEach((f) => {
      const val = sub.answers?.[f.id];
      const headerKey = f.label || f.id;
      if (Array.isArray(val)) {
        rowObj[headerKey] = val.join(", ");
      } else if (typeof val === "object" && val !== null) {
        rowObj[headerKey] = JSON.stringify(val);
      } else if (val === undefined || val === null) {
        rowObj[headerKey] = "";
      } else {
        rowObj[headerKey] = String(val);
      }
    });

    return rowObj;
  });

  return { headers, rows };
}

/**
 * Export responses as Microsoft Excel (.xlsx) file
 */
export function exportSubmissionsToExcel(form: DynamicForm, submissions: FormSubmission[]) {
  if (!submissions || submissions.length === 0) {
    alert("Tidak ada data respon untuk diunduh.");
    return;
  }

  const { rows } = buildExportData(form, submissions);
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Auto-fit column widths
  const colWidths = Object.keys(rows[0] || {}).map((key) => {
    let maxLen = key.length;
    rows.forEach((r) => {
      const valLen = String(r[key] || "").length;
      if (valLen > maxLen) maxLen = valLen;
    });
    return { wch: Math.min(Math.max(maxLen + 3, 12), 50) };
  });
  worksheet["!cols"] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data Respon");

  const cleanTitle = sanitizeFilename(form.title || "Form");
  const dateTag = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const fileName = `Rekap_${cleanTitle}_${dateTag}.xlsx`;

  XLSX.writeFile(workbook, fileName);
}

/**
 * Export responses as CSV (.csv) with UTF-8 BOM
 */
export function exportSubmissionsToCsv(form: DynamicForm, submissions: FormSubmission[]) {
  if (!submissions || submissions.length === 0) {
    alert("Tidak ada data respon untuk diunduh.");
    return;
  }

  const { headers, rows } = buildExportData(form, submissions);

  // Escape CSV field
  const escapeCsv = (str: any) => {
    const s = String(str ?? "").replace(/"/g, '""');
    return `"${s}"`;
  };

  const csvRows: string[] = [];
  csvRows.push(headers.map(escapeCsv).join(","));

  rows.forEach((row) => {
    const line = headers.map((h) => escapeCsv(row[h] ?? ""));
    csvRows.push(line.join(","));
  });

  // Prepend UTF-8 BOM so Excel opens it with proper encoding
  const csvContent = "\ufeff" + csvRows.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  
  const cleanTitle = sanitizeFilename(form.title || "Form");
  const dateTag = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const fileName = `Rekap_${cleanTitle}_${dateTag}.csv`;

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
