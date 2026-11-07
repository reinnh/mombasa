import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Volunteer } from "@/types";

interface ExportScope {
  constituency?: string;
  ward?: string;
  pollingStation?: string;
}

function getScopeSlug(scope: ExportScope): string {
  if (scope.ward && scope.ward !== "ALL") {
    return scope.ward.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }
  if (scope.constituency && scope.constituency !== "ALL") {
    return scope.constituency.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }
  return "all-mombasa";
}

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * 1. Professional Vector PDF Export (Landscape A4)
 */
export function exportToPdf(volunteers: Volunteer[], scope: ExportScope = {}) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4", // 297mm x 210mm
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 297mm
  const margin = 12;
  const contentWidth = pageWidth - margin * 2; // 273mm

  const now = new Date();
  const dateFormatted = now.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const constDisplay = scope.constituency && scope.constituency !== "ALL" ? scope.constituency : "All Constituencies (6)";
  const wardDisplay = scope.ward && scope.ward !== "ALL" ? scope.ward : "All Wards (30)";
  const stationDisplay = scope.pollingStation && scope.pollingStation !== "ALL" ? scope.pollingStation : "All Stations";
  const verifiedCount = volunteers.filter((v) => v.status === "verified").length;

  // Header Top Bar
  doc.setFillColor(11, 77, 184); // #0B4DB8 TND Royal Blue
  doc.rect(margin, 10, contentWidth, 2, "F");

  // Title & Subtitle
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(11, 77, 184);
  doc.text("THE NEW DEMOCRATS (TND) YOUTH LEAGUE", margin, 18);

  doc.setFontSize(10);
  doc.setTextColor(229, 26, 36); // #E51A24 Crimson Red
  doc.text("MOMBASA COUNTY CHAPTER — OFFICIAL GROUND VOLUNTEER REGISTER", margin, 23);

  // Metadata Box
  doc.setFillColor(248, 250, 252); // #f8fafc
  doc.setDrawColor(203, 213, 225); // #cbd5e1
  doc.roundedRect(margin, 26, contentWidth, 14, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);

  const col1X = margin + 4;
  const col2X = margin + 65;
  const col3X = margin + 130;
  const col4X = margin + 195;

  doc.text(`Constituency: ${constDisplay}`, col1X, 32);
  doc.text(`Ward: ${wardDisplay}`, col2X, 32);
  doc.text(`Polling Station: ${stationDisplay}`, col3X, 32);
  doc.text(`Generated: ${dateFormatted}`, col4X, 32);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(
    `Total Volunteers: ${volunteers.length}   |   Verified: ${verifiedCount}   |   Active: ${volunteers.length - verifiedCount}`,
    col1X,
    37
  );

  // Table Data
  const head = [
    ["#", "Full Name", "Phone", "National ID", "Constituency", "Ward", "Polling Station", "Role", "Occupation", "Status", "Date"],
  ];

  const body = volunteers.map((v, i) => [
    String(i + 1),
    v.fullName,
    v.phoneNumber,
    v.idNumber || "-",
    v.constituency || "-",
    v.ward,
    v.pollingStation,
    v.volunteerRole || "Mobilizer",
    v.occupation || "-",
    v.status === "verified" ? "VERIFIED" : "ACTIVE",
    v.createdAt ? new Date(v.createdAt).toLocaleDateString("en-GB") : "-",
  ]);

  autoTable(doc, {
    head: head,
    body: body,
    startY: 43,
    margin: { left: margin, right: margin, bottom: 14 },
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 7.5,
      cellPadding: 2,
      textColor: [15, 23, 42],
      lineColor: [226, 232, 240],
      lineWidth: 0.15,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [11, 77, 184],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
      halign: "left",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 8, halign: "center" }, // #
      1: { cellWidth: 38, fontStyle: "bold" }, // Name
      2: { cellWidth: 26 }, // Phone
      3: { cellWidth: 22 }, // ID
      4: { cellWidth: 26 }, // Constituency
      5: { cellWidth: 26 }, // Ward
      6: { cellWidth: 42 }, // Station
      7: { cellWidth: 25 }, // Role
      8: { cellWidth: 25 }, // Occupation
      9: { cellWidth: 18, halign: "center", fontStyle: "bold" }, // Status
      10: { cellWidth: 17, halign: "center" }, // Date
    },
    didDrawCell: (data) => {
      // Custom coloring for Status column
      if (data.section === "body" && data.column.index === 9) {
        const val = data.cell.raw;
        if (val === "VERIFIED") {
          doc.setTextColor(11, 77, 184);
        } else {
          doc.setTextColor(100, 116, 139);
        }
      }
    },
    didDrawPage: (data) => {
      // Footer on every page
      const pageCount = (doc.internal as unknown as { getNumberOfPages: () => number }).getNumberOfPages();
      const currentPage = data.pageNumber;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(
        "The NEW Democrats (TND) Youth League Mombasa Chapter • Confidential & Official Working Document",
        margin,
        204
      );
      doc.text(
        `Page ${currentPage} of ${pageCount}`,
        pageWidth - margin,
        204,
        { align: "right" }
      );
    },
  });

  const slug = getScopeSlug(scope);
  const filename = `mombasa-volunteers-${slug}-${getTodayString()}.pdf`;
  doc.save(filename);
}

/**
 * 2. Excel-Optimized RFC-4180 CSV Export with UTF-8 BOM
 */
export function exportToCsv(volunteers: Volunteer[], scope: ExportScope = {}) {
  const headers = [
    "No",
    "Full Name",
    "Phone Number",
    "National ID",
    "Constituency",
    "Ward",
    "Polling Station / Landmark",
    "Volunteer Role",
    "Occupation",
    "Education Level",
    "Status",
    "Committed",
    "Registration Date",
    "Comment",
    "Admin Notes",
  ];

  const escapeCsv = (val: string | number | boolean | null | undefined): string => {
    if (val === null || val === undefined) return '""';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = volunteers.map((v, i) => [
    escapeCsv(i + 1),
    escapeCsv(v.fullName),
    escapeCsv(v.phoneNumber),
    escapeCsv(v.idNumber || ""),
    escapeCsv(v.constituency || ""),
    escapeCsv(v.ward),
    escapeCsv(v.pollingStation),
    escapeCsv(v.volunteerRole || "Mobilizer"),
    escapeCsv(v.occupation || ""),
    escapeCsv(v.educationLevel || ""),
    escapeCsv(v.status),
    escapeCsv(v.isCommitted !== false ? "Yes" : "No"),
    escapeCsv(v.createdAt ? new Date(v.createdAt).toLocaleDateString("en-GB") : ""),
    escapeCsv(v.comment || ""),
    escapeCsv(v.notes || ""),
  ]);

  // Prepend UTF-8 BOM so Excel opens it with proper encoding on any device
  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const slug = getScopeSlug(scope);
  link.setAttribute("href", url);
  link.setAttribute("download", `mombasa-volunteers-${slug}-${getTodayString()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 3. Mobile-Safe Word Document (.doc) Export
 * Formatted with explicit table layout, inline widths & borders so mobile readers cannot collapse columns.
 */
export function exportToWord(volunteers: Volunteer[], scope: ExportScope = {}) {
  const slug = getScopeSlug(scope);
  const params = new URLSearchParams();
  if (scope.constituency && scope.constituency !== "ALL") params.append("constituency", scope.constituency);
  if (scope.ward && scope.ward !== "ALL") params.append("ward", scope.ward);
  if (scope.pollingStation && scope.pollingStation !== "ALL") params.append("pollingStation", scope.pollingStation);

  window.open(`/api/v1/volunteers/export?${params.toString()}`, "_blank");
}

/**
 * 4. Print / Native Save as PDF dialog
 */
export function openPrintDialog(volunteers: Volunteer[], scope: ExportScope = {}) {
  const constDisplay = scope.constituency && scope.constituency !== "ALL" ? scope.constituency : "All Constituencies";
  const wardDisplay = scope.ward && scope.ward !== "ALL" ? scope.ward : "All Wards";
  const verifiedCount = volunteers.filter((v) => v.status === "verified").length;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const rows = volunteers
    .map(
      (v, i) => `
    <tr>
      <td style="text-align: center;">${i + 1}</td>
      <td style="font-weight: bold;">${v.fullName}</td>
      <td>${v.phoneNumber}</td>
      <td>${v.idNumber || "-"}</td>
      <td>${v.constituency || "-"}</td>
      <td>${v.ward}</td>
      <td>${v.pollingStation}</td>
      <td>${v.volunteerRole || "Mobilizer"}</td>
      <td>${v.occupation || "-"}</td>
      <td style="text-align: center; font-weight: bold; color: ${v.status === "verified" ? "#0B4DB8" : "#64748b"}">${v.status.toUpperCase()}</td>
      <td style="text-align: center;">${v.createdAt ? new Date(v.createdAt).toLocaleDateString("en-GB") : "-"}</td>
    </tr>
  `
    )
    .join("");

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>TND Volunteer Register - ${wardDisplay}</title>
      <style>
        @page { size: landscape; margin: 10mm; }
        body { font-family: Arial, sans-serif; font-size: 11px; color: #0f172a; margin: 0; padding: 12px; }
        .header { border-bottom: 3px solid #0B4DB8; padding-bottom: 8px; margin-bottom: 12px; }
        .title { font-size: 18px; font-weight: bold; color: #0B4DB8; }
        .sub { font-size: 13px; font-weight: bold; color: #E51A24; margin-top: 2px; }
        .meta { background: #f8fafc; border: 1px solid #cbd5e1; padding: 6px 10px; margin-bottom: 12px; font-size: 11px; display: flex; justify-content: space-between; }
        table { width: 100%; border-collapse: collapse; font-size: 10px; }
        th { background: #0B4DB8; color: white; border: 1px solid #0B4DB8; padding: 6px 4px; text-align: left; }
        td { border: 1px solid #cbd5e1; padding: 5px 4px; vertical-align: top; }
        tr:nth-child(even) td { background: #f8fafc; }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">THE NEW DEMOCRATS (TND) YOUTH LEAGUE</div>
        <div class="sub">Mombasa County Chapter — Official Ground Volunteer Register</div>
      </div>
      <div class="meta">
        <div><strong>Constituency:</strong> ${constDisplay} &nbsp;|&nbsp; <strong>Ward:</strong> ${wardDisplay}</div>
        <div><strong>Total Records:</strong> ${volunteers.length} &nbsp;|&nbsp; <strong>Verified:</strong> ${verifiedCount}</div>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width: 20px; text-align: center;">#</th>
            <th>Full Name</th>
            <th>Phone</th>
            <th>National ID</th>
            <th>Constituency</th>
            <th>Ward</th>
            <th>Polling Station</th>
            <th>Role</th>
            <th>Occupation</th>
            <th style="text-align: center;">Status</th>
            <th style="text-align: center;">Date</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

