import { NextRequest, NextResponse } from "next/server";
import { getVolunteers } from "@/lib/volunteer-service";

function escapeHtml(text: string | number | null | undefined): string {
  if (text === null || text === undefined) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const constituency = searchParams.get("constituency") || undefined;
    const ward = searchParams.get("ward") || undefined;
    const pollingStation = searchParams.get("pollingStation") || undefined;

    const list = await getVolunteers({ constituency, ward, pollingStation });

    const now = new Date();
    const generatedDate = now.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const dateStr = now.toISOString().split("T")[0];

    const scopeLabel = ward
      ? ward.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      : constituency
      ? constituency.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      : "all-wards";

    const filename = `mombasa-volunteers-${scopeLabel}-${dateStr}.doc`;

    const verifiedCount = list.filter((v) => v.status === "verified").length;

    const rowsHtml =
      list.length === 0
        ? `<tr><td colspan="12" style="text-align: center; padding: 24pt; color: #64748b; font-style: italic;">No volunteer registrations recorded for this selection.</td></tr>`
        : list
            .map((v, index) => {
              const regDate = v.createdAt
                ? new Date(v.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "-";
              const isVerified = v.status === "verified";
              const statusTag = isVerified
                ? `<span style="background-color: #dbeafe; color: #0B4DB8; font-weight: bold; font-size: 7.5pt; padding: 2pt 4pt; border-radius: 2pt;">VERIFIED</span>`
                : `<span style="background-color: #f1f5f9; color: #475569; font-weight: bold; font-size: 7.5pt; padding: 2pt 4pt; border-radius: 2pt;">ACTIVE</span>`;

              return `
              <tr>
                <td style="text-align: center; color: #64748b; font-weight: bold;">${index + 1}</td>
                <td style="font-weight: 600; color: #0f172a;">${escapeHtml(v.fullName)}</td>
                <td style="font-family: Consolas, monospace; color: #0f172a;">${escapeHtml(v.phoneNumber)}</td>
                <td style="font-family: Consolas, monospace; color: #475569;">${escapeHtml(v.idNumber || "-")}</td>
                <td>${escapeHtml(v.constituency || "-")}</td>
                <td style="font-weight: 500;">${escapeHtml(v.ward)}</td>
                <td>${escapeHtml(v.pollingStation)}</td>
                <td>${escapeHtml(v.volunteerRole || "Mobilizer")}</td>
                <td>${escapeHtml(v.occupation || "-")}</td>
                <td>${escapeHtml(v.educationLevel || "-")}</td>
                <td style="text-align: center;">${statusTag}</td>
                <td style="color: #64748b; font-size: 8pt;">${escapeHtml(regDate)}</td>
              </tr>`;
            })
            .join("");

    const docHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>TND Youth League Mombasa - Volunteer Roster</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: 841.9pt 595.3pt;
      mso-page-orientation: landscape;
      margin: 0.5in 0.5in 0.5in 0.5in;
      mso-header-margin: 0.3in;
      mso-footer-margin: 0.3in;
    }
    div.Section1 {
      page: Section1;
    }
    body {
      font-family: Calibri, 'Segoe UI', Arial, sans-serif;
      font-size: 9.5pt;
      color: #0f172a;
      margin: 0;
      padding: 0;
      background-color: #ffffff;
    }
    .header-table {
      width: 100%;
      border-bottom: 2.5pt solid #0B4DB8;
      padding-bottom: 6pt;
      margin-bottom: 10pt;
    }
    .header-table td {
      border: none !important;
      padding: 0;
    }
    .org-title {
      font-size: 15pt;
      font-weight: bold;
      color: #0B4DB8;
      letter-spacing: 0.5pt;
      text-transform: uppercase;
      margin: 0;
    }
    .org-sub {
      font-size: 10.5pt;
      font-weight: bold;
      color: #E51A24;
      margin: 2pt 0 0 0;
    }
    .filter-meta {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10pt;
      font-size: 9pt;
    }
    .filter-meta td {
      border: 1px solid #cbd5e1;
      padding: 4pt 8pt;
      background-color: #f8fafc;
      color: #334155;
    }
    .filter-meta td strong {
      color: #0f172a;
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.5pt;
    }
    table.data-table th {
      background-color: #0B4DB8;
      color: #ffffff;
      padding: 6pt 4pt;
      border: 1px solid #0B4DB8;
      font-weight: bold;
      text-align: left;
    }
    table.data-table td {
      padding: 4.5pt 4pt;
      border: 1px solid #cbd5e1;
      vertical-align: top;
      background-color: #ffffff;
    }
    table.data-table tr:nth-child(even) td {
      background-color: #f8fafc;
    }
    .footer-note {
      margin-top: 14pt;
      font-size: 8pt;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      padding-top: 6pt;
      text-align: right;
    }
  </style>
</head>
<body>
  <div class="Section1">
    <table class="header-table">
      <tr>
        <td>
          <div class="org-title">The NEW Democrats (TND) Youth League</div>
          <div class="org-sub">Mombasa County Chapter &bull; Official Volunteer Roster</div>
        </td>
        <td style="text-align: right; vertical-align: bottom; font-size: 8.5pt; color: #64748b;">
          <strong>Date:</strong> ${escapeHtml(generatedDate)}<br/>
          <strong>Classification:</strong> Official Internal Roster
        </td>
      </tr>
    </table>

    <table class="filter-meta">
      <tr>
        <td><strong>Constituency:</strong> ${escapeHtml(constituency || "All Constituencies (6)")}</td>
        <td><strong>Ward:</strong> ${escapeHtml(ward || "All Wards (30)")}</td>
        <td><strong>Polling Station:</strong> ${escapeHtml(pollingStation || "All Stations")}</td>
        <td><strong>Total Records:</strong> ${list.length} (${verifiedCount} Verified)</td>
      </tr>
    </table>

    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 22pt; text-align: center;">#</th>
          <th style="width: 100pt;">Full Name</th>
          <th style="width: 65pt;">Phone</th>
          <th style="width: 55pt;">National ID</th>
          <th style="width: 65pt;">Constituency</th>
          <th style="width: 65pt;">Ward</th>
          <th style="width: 110pt;">Polling Station</th>
          <th style="width: 65pt;">Role</th>
          <th style="width: 65pt;">Occupation</th>
          <th style="width: 60pt;">Education</th>
          <th style="width: 48pt; text-align: center;">Status</th>
          <th style="width: 55pt;">Reg. Date</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <div class="footer-note">
      Official Working Document &bull; The NEW Democrats (TND) Youth League Mombasa Chapter &bull; Generated from Ground Network Portal
    </div>
  </div>
</body>
</html>
`.trim();

    return new NextResponse(docHtml, {
      status: 200,
      headers: {
        "Content-Type": "application/msword; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Export failed";
    return new NextResponse(msg, { status: 500 });
  }
}
