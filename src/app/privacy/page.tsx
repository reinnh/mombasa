import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  CheckCircle2,
  FileText,
  UserCheck,
  BarChart3,
  Calendar,
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy & Data Protection | Mombasa Volunteer Hub",
  description:
    "Official privacy policy and data protection declaration for TND Youth League Mombasa Chapter 2027 volunteer mobilization registry.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex flex-col justify-between selection:bg-[#0B4DB8]/15 selection:text-[#0B4DB8]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e2e8f0] px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#0B4DB8] hover:text-[#083B8F] transition-colors bg-[#0B4DB8]/10 px-2.5 py-1.5 rounded-sm border border-[#0B4DB8]/20"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Form</span>
            </Link>
            <div className="h-4 w-px bg-[#e2e8f0]" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 overflow-hidden border border-[#e2e8f0] shrink-0 bg-white rounded-xs p-0.5">
                <img
                  src="/images/tnd-logo.jpg"
                  alt="TND Youth League"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs font-bold text-[#0f172a] hidden sm:inline">
                Mombasa Volunteer Hub
              </span>
            </div>
          </div>

          <span className="text-[10px] font-bold text-[#E51A24] bg-[#E51A24]/10 px-2.5 py-1 rounded-sm border border-[#E51A24]/20 uppercase tracking-wide">
            2027
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 flex-1">
        <div className="ios-card p-6 sm:p-8 space-y-6 border-[#e2e8f0]">
          {/* Title Banner */}
          <div className="border-b border-[#e2e8f0] pb-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B4DB8] mb-1">
              <Shield className="w-4 h-4 text-[#0B4DB8]" />
              <span>Official Privacy Policy &amp; Data Commitment</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0f172a] leading-tight">
              Privacy Policy &amp; Terms of Data Collection
            </h1>
            <p className="text-xs text-[#64748b] mt-1.5 flex flex-wrap items-center gap-3">
              <span>The New Democrats Youth League Mombasa Chapter (Mombasa County)</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Updated: 2026/2027
              </span>
            </p>
          </div>

          {/* Absolute Commitment Callout Box */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-sm p-4 sm:p-5 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-sm font-bold text-emerald-900 uppercase tracking-wide">
                  Core Guarantee: No Third-Party Data Sharing Whatsoever
                </h2>
                <p className="text-xs text-emerald-800 leading-relaxed mt-1">
                  We declare unconditionally that <strong>your personal data and National ID are NEVER sold, rented, leased, disclosed, or shared with ANY third party, commercial vendor, advertising agency, state actor, external political party, or unauthorized entity.</strong>
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-emerald-900">
              <div className="flex items-start gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Strict Identification:</strong> Used exclusively to authenticate your registered identity as an authorized campaign volunteer mobilizer.
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Accurate Tallying:</strong> Used strictly for internal volunteer counts, preventing duplicate registrations, and polling station coverage statistics across Mombasa County.
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Policy Sections */}
          <div className="space-y-6 text-xs text-[#0f172a] leading-relaxed">
            {/* Section 1 */}
            <section className="space-y-2">
              <h3 className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
                <span className="w-5 h-5 rounded-xs bg-[#0B4DB8] text-white flex items-center justify-center text-[10px] font-bold">
                  1
                </span>
                Data Controller &amp; Organization
              </h3>
              <p className="text-[#64748b]">
                This registration platform is operated strictly on behalf of the secretariat of{" "}
                <strong className="text-[#0f172a]">The New Democrats Youth League Mombasa Chapter</strong> across Mombasa County (encompassing Changamwe, Jomvu, Kisauni, Likoni, Mvita, and Nyali constituencies). All data collected remains under the sovereign custody of the official secretariat.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-2">
              <h3 className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
                <span className="w-5 h-5 rounded-xs bg-[#0B4DB8] text-white flex items-center justify-center text-[10px] font-bold">
                  2
                </span>
                Information We Collect
              </h3>
              <p className="text-[#64748b]">
                To organize ground mobilization across all 30 Wards and polling stations in Mombasa County, we collect only the necessary information provided willingly by you:
              </p>
              <ul className="space-y-1.5 text-[#64748b] pl-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#0B4DB8] font-bold">&bull;</span>
                  <span>
                    <strong className="text-[#0f172a]">Full Legal Name:</strong> Used for official identification and unique volunteer registration.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0B4DB8] font-bold">&bull;</span>
                  <span>
                    <strong className="text-[#0f172a]">National ID Number (Kitambulisho):</strong> Used solely to authenticate your registration, eliminate duplicate mobilizer entries, and ensure one person per station. It is strictly confidential and never shared.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0B4DB8] font-bold">&bull;</span>
                  <span>
                    <strong className="text-[#0f172a]">Active Phone Number:</strong> Used for operational SMS alerts, WhatsApp coordination, and direct communication by coordinators.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0B4DB8] font-bold">&bull;</span>
                  <span>
                    <strong className="text-[#0f172a]">Constituency, Ward &amp; Polling Station / Landmark:</strong> Required to map your station placement, calculate coverage, and link you to your immediate neighborhood team.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0B4DB8] font-bold">&bull;</span>
                  <span>
                    <strong className="text-[#0f172a]">Volunteer Role &amp; Commitment Pledge:</strong> Used to assign appropriate field responsibilities.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0B4DB8] font-bold">&bull;</span>
                  <span>
                    <strong className="text-[#0f172a]">Occupation &amp; Education Level (Optional):</strong> Voluntarily provided to assist the secretariat in deploying volunteers according to specialized professional skills.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0B4DB8] font-bold">&bull;</span>
                  <span>
                    <strong className="text-[#0f172a]">Comments / Suggestions (Optional):</strong> Any supplementary notes you choose to share with the mobilization team.
                  </span>
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-2">
              <h3 className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
                <span className="w-5 h-5 rounded-xs bg-[#0B4DB8] text-white flex items-center justify-center text-[10px] font-bold">
                  3
                </span>
                Explicit Purpose of Data Usage
              </h3>
              <p className="text-[#64748b]">
                Your information is used strictly and exclusively for two primary purposes:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-[#f8fafc] p-3 rounded-sm border border-[#e2e8f0]">
                  <h4 className="font-bold text-[#0f172a] mb-1 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-[#0B4DB8]" />
                    1. Identification &amp; Credentials
                  </h4>
                  <p className="text-[11px] text-[#64748b]">
                    Assigning official Volunteer IDs, issuing identification badges where applicable, verifying active field mobilizers, and eliminating duplicate entries.
                  </p>
                </div>
                <div className="bg-[#f8fafc] p-3 rounded-sm border border-[#e2e8f0]">
                  <h4 className="font-bold text-[#0f172a] mb-1 flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-[#0B4DB8]" />
                    2. Ground Tallying &amp; Strategy
                  </h4>
                  <p className="text-[11px] text-[#64748b]">
                    Calculating volunteer density per polling station, monitoring ward-level mobilization readiness, and coordinating logistics for civic activities across Mombasa County.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-2">
              <h3 className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
                <span className="w-5 h-5 rounded-xs bg-[#0B4DB8] text-white flex items-center justify-center text-[10px] font-bold">
                  4
                </span>
                Data Security &amp; Access Controls
              </h3>
              <p className="text-[#64748b]">
                All volunteer records are housed within a secure, encrypted database with strict role-based access control. Only vetted and designated administrative coordinators possess clearance to view regional registries. Exporting or disseminating volunteer details outside authorized campaign duties is strictly forbidden.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-2">
              <h3 className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
                <span className="w-5 h-5 rounded-xs bg-[#0B4DB8] text-white flex items-center justify-center text-[10px] font-bold">
                  5
                </span>
                Retention &amp; Deletion Schedule
              </h3>
              <p className="text-[#64748b]">
                Your personal details are maintained strictly for the active duration of the 2027 electoral cycle. Following the completion and certification of the election, or upon your written request, records are securely archived or purged from active databases in accordance with standard data protection principles.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-2">
              <h3 className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
                <span className="w-5 h-5 rounded-xs bg-[#0B4DB8] text-white flex items-center justify-center text-[10px] font-bold">
                  6
                </span>
                Your Rights as a Volunteer
              </h3>
              <p className="text-[#64748b]">
                As an individual participating in the Mombasa volunteer hub, you retain comprehensive rights over your personal data:
              </p>
              <div className="bg-[#f8fafc] rounded-sm p-3 border border-[#e2e8f0] space-y-2 text-[11px] text-[#64748b]">
                <p>
                  <strong className="text-[#0f172a]">Right to Inspect &amp; Correct:</strong> You may verify your recorded details and update any phone numbers or assigned locations.
                </p>
                <p>
                  <strong className="text-[#0f172a]">Right to De-register:</strong> Volunteer service is 100% voluntary. You may request deactivation or complete removal of your record at any stage without prejudice.
                </p>
              </div>
            </section>

            {/* Section 7 - Terms of Participation */}
            <section className="space-y-2 pt-2 border-t border-[#e2e8f0]">
              <h3 className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0B4DB8]" />
                Terms &amp; Conditions of Volunteer Participation
              </h3>
              <div className="space-y-2 text-[#64748b]">
                <p>
                  1. <strong className="text-[#0f172a]">Voluntary Engagement:</strong> Registration does not constitute commercial employment or a contractual agency relationship. All participation is conducted as patriotic civic volunteerism.
                </p>
                <p>
                  2. <strong className="text-[#0f172a]">Peaceful &amp; Lawful Conduct:</strong> Volunteers pledge to uphold the dignity of Mombasa County, promoting peace, lawful assembly, and respect for all community members regardless of political persuasion.
                </p>
                <p>
                  3. <strong className="text-[#0f172a]">Official Representation:</strong> No volunteer is permitted to solicit unauthorized funds or make public media statements on behalf of TND Youth League without written sanction from the secretariat.
                </p>
              </div>
            </section>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-[#e2e8f0] flex flex-col sm:flex-row items-center justify-between gap-3">
            <Link
              href="/"
              className="ios-button-primary w-full sm:w-auto text-xs py-2.5 px-5 flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Volunteer Registration</span>
            </Link>

            <span className="text-[11px] text-[#64748b]">
              Mombasa County &bull; 2027 General Election
            </span>
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="max-w-3xl mx-auto w-full px-4 py-4 text-center text-[10px] text-[#64748b] border-t border-[#e2e8f0] mt-6">
        <p>
          &copy; {new Date().getFullYear()} The New Democrats Youth League Mombasa Chapter. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
