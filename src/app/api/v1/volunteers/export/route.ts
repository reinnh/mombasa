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
        ? `<tr><td colspan="11" align="center" style="padding: 20px; font-family: Arial, sans-serif; color: #64748b;">No volunteer records found for this scope.</td></tr>`
        : list
            .map((v, index) => {
              const regDate = v.createdAt
                ? new Date(v.createdAt).toLocaleDateString("en-GB")
                : "-";
              const isVerified = v.status === "verified";
              const statusBg = isVerified ? "#dbeafe" : "#f1f5f9";
              const statusColor = isVerified ? "#0B4DB8" : "#475569";
              const statusText = isVerified ? "VERIFIED" : "ACTIVE";

              return `
              <tr style="background-color: ${index % 2 === 0 ? "#ffffff" : "#f8fafc"};">
                <td align="center" style="padding: 6px 4px; font-family: Arial, sans-serif; font-size: 11px; border: 1px solid #cbd5e1; color: #64748b;">${index + 1}</td>
                <td style="padding: 6px 6px; font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; border: 1px solid #cbd5e1; color: #0f172a;">${escapeHtml(v.fullName)}</td>
                <td style="padding: 6px 6px; font-family: Arial, sans-serif; font-size: 11px; border: 1px solid #cbd5e1; color: #0f172a; white-space: nowrap;">${escapeHtml(v.phoneNumber)}</td>
                <td style="padding: 6px 6px; font-family: Arial, sans-serif; font-size: 11px; border: 1px solid #cbd5e1; color: #475569;">${escapeHtml(v.idNumber || "-")}</td>
                <td style="padding: 6px 6px; font-family: Arial, sans-serif; font-size: 11px; border: 1px solid #cbd5e1; color: #0f172a;">${escapeHtml(v.constituency || "-")}</td>
                <td style="padding: 6px 6px; font-family: Arial, sans-serif; font-size: 11px; border: 1px solid #cbd5e1; color: #0f172a;">${escapeHtml(v.ward)}</td>
                <td style="padding: 6px 6px; font-family: Arial, sans-serif; font-size: 11px; border: 1px solid #cbd5e1; color: #0f172a;">${escapeHtml(v.pollingStation)}</td>
                <td style="padding: 6px 6px; font-family: Arial, sans-serif; font-size: 11px; border: 1px solid #cbd5e1; color: #0f172a;">${escapeHtml(v.volunteerRole || "Mobilizer")}</td>
                <td style="padding: 6px 6px; font-family: Arial, sans-serif; font-size: 11px; border: 1px solid #cbd5e1; color: #475569;">${escapeHtml(v.occupation || "-")}</td>
                <td align="center" style="padding: 6px 4px; font-family: Arial, sans-serif; font-size: 10px; font-weight: bold; border: 1px solid #cbd5e1; background-color: ${statusBg}; color: ${statusColor};">${statusText}</td>
                <td align="center" style="padding: 6px 4px; font-family: Arial, sans-serif; font-size: 11px; border: 1px solid #cbd5e1; color: #64748b;">${escapeHtml(regDate)}</td>
              </tr>`;
            })
            .join("");

    const docHtml = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>TND Volunteer Register</title>
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
      margin: 20pt 20pt 20pt 20pt;
    }
    div.Section1 { page: Section1; }
    body, table, td, th, p {
      font-family: Arial, Helvetica, sans-serif !important;
    }
  </style>
</head>
<body style="font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 16px; background-color: #ffffff;">
  <div class="Section1">
    <!-- Header -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom: 3px solid #0B4DB8; margin-bottom: 12px; padding-bottom: 8px;">
      <tr>
        <td valign="bottom" align="left">
          <div style="font-size: 18px; font-weight: bold; color: #0B4DB8; text-transform: uppercase;">The NEW Democrats (TND) Youth League</div>
          <div style="font-size: 12px; font-weight: bold; color: #E51A24; margin-top: 3px;">Mombasa County Chapter &bull; Official Volunteer Register</div>
        </td>
        <td valign="bottom" align="right" style="font-size: 11px; color: #64748b;">
          <strong>Generated:</strong> ${escapeHtml(generatedDate)}<br/>
          Official Working Document
        </td>
      </tr>
    </table>

    <!-- Metadata Box -->
    <table width="100%" cellpadding="6" cellspacing="0" border="1" style="border-collapse: collapse; border: 1px solid #cbd5e1; background-color: #f8fafc; margin-bottom: 14px; font-size: 11px; color: #334155;">
      <tr>
        <td style="border: 1px solid #cbd5e1;"><strong>Constituency:</strong> ${escapeHtml(constituency || "All Constituencies (6)")}</td>
        <td style="border: 1px solid #cbd5e1;"><strong>Ward:</strong> ${escapeHtml(ward || "All Wards (30)")}</td>
        <td style="border: 1px solid #cbd5e1;"><strong>Polling Station:</strong> ${escapeHtml(pollingStation || "All Stations")}</td>
        <td style="border: 1px solid #cbd5e1;"><strong>Total Records:</strong> ${list.length} (${verifiedCount} Verified)</td>
      </tr>
    </table>

    <!-- Data Table -->
    <table width="100%" cellpadding="4" cellspacing="0" border="1" style="border-collapse: collapse; border: 1px solid #cbd5e1; font-size: 11px;">
      <thead>
        <tr style="background-color: #0B4DB8; color: #ffffff;">
          <th width="3%" align="center" style="padding: 7px 4px; border: 1px solid #0B4DB8; color: #ffffff;">#</th>
          <th width="16%" align="left" style="padding: 7px 6px; border: 1px solid #0B4DB8; color: #ffffff;">Full Name</th>
          <th width="11%" align="left" style="padding: 7px 6px; border: 1px solid #0B4DB8; color: #ffffff;">Phone</th>
          <th width="9%" align="left" style="padding: 7px 6px; border: 1px solid #0B4DB8; color: #ffffff;">National ID</th>
          <th width="10%" align="left" style="padding: 7px 6px; border: 1px solid #0B4DB8; color: #ffffff;">Constituency</th>
          <th width="10%" align="left" style="padding: 7px 6px; border: 1px solid #0B4DB8; color: #ffffff;">Ward</th>
          <th width="17%" align="left" style="padding: 7px 6px; border: 1px solid #0B4DB8; color: #ffffff;">Polling Station</th>
          <th width="9%" align="left" style="padding: 7px 6px; border: 1px solid #0B4DB8; color: #ffffff;">Role</th>
          <th width="9%" align="left" style="padding: 7px 6px; border: 1px solid #0B4DB8; color: #ffffff;">Occupation</th>
          <th width="7%" align="center" style="padding: 7px 4px; border: 1px solid #0B4DB8; color: #ffffff;">Status</th>
          <th width="7%" align="center" style="padding: 7px 4px; border: 1px solid #0B4DB8; color: #ffffff;">Date</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <div style="margin-top: 16px; font-size: 10px; color: #94a3b8; text-align: right; border-top: 1px solid #e2e8f0; padding-top: 6px;">
      The NEW Democrats (TND) Youth League &bull; Mombasa County Grassroots Register
    </div>
  </div>
</body>
</html>`.trim();

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
