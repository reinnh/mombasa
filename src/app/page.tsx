"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import Lenis from "lenis";
import {
  User,
  Phone,
  MapPin,
  Vote,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Shield,
  Briefcase,
  MessageSquare,
  HelpCircle,
  GraduationCap,
  Award,
  CheckSquare,
  Lock,
  Hash,
  CreditCard,
  Building2,
} from "lucide-react";
import {
  mombasaWards,
  totalPollingStations,
  mombasaConstituencies,
  getWardsByConstituency,
  getConstituencyByWard,
} from "@/constants/mombasa-wards";
import { ApiResponse, Volunteer } from "@/types";

const OTHER_STATION = "__OTHER__";
const OTHER_ROLE = "Other (Specify)";

export default function VolunteerRegistrationPage() {
  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [constituency, setConstituency] = useState("");
  const [ward, setWard] = useState("");
  const [pollingStation, setPollingStation] = useState("");
  const [isOtherStation, setIsOtherStation] = useState(false);
  const [otherStationText, setOtherStationText] = useState("");
  const [volunteerRole, setVolunteerRole] = useState("Mobilizer (Ground Agent)");
  const [otherRoleText, setOtherRoleText] = useState("");
  const [isCommitted, setIsCommitted] = useState(true);
  const [occupation, setOccupation] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successVolunteer, setSuccessVolunteer] = useState<Volunteer | null>(null);
  const [showWardsAccordion, setShowWardsAccordion] = useState(false);

  // Lenis iOS smooth inertial spring scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.35,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Stretchy iOS spring parallax on scroll
  const { scrollY } = useScroll();
  const rawHeroScale = useTransform(scrollY, [0, 260], [1, 0.975]);
  const heroScale = useSpring(rawHeroScale, { stiffness: 220, damping: 28 });
  const rawHeroY = useTransform(scrollY, [0, 260], [0, 10]);
  const heroY = useSpring(rawHeroY, { stiffness: 220, damping: 28 });

  // Cascading wards based on selected constituency
  const availableWards = constituency
    ? getWardsByConstituency(constituency)
    : mombasaWards;

  // Cascading polling stations based on selected ward
  const selectedWardData = mombasaWards.find((w) => w.ward === ward);
  const availableStations = selectedWardData ? selectedWardData.pollingStations : [];

  const handleConstituencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newConst = e.target.value;
    setConstituency(newConst);
    setWard("");
    setPollingStation("");
    setIsOtherStation(false);
    setOtherStationText("");
    setError(null);
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newWard = e.target.value;
    setWard(newWard);
    if (newWard && !constituency) {
      const parentConst = getConstituencyByWard(newWard);
      if (parentConst) setConstituency(parentConst);
    }
    setPollingStation(""); // Reset cascading dropdown
    setIsOtherStation(false);
    setOtherStationText("");
    setError(null);
  };

  const handleStationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === OTHER_STATION) {
      setIsOtherStation(true);
      setPollingStation(OTHER_STATION);
    } else {
      setIsOtherStation(false);
      setOtherStationText("");
      setPollingStation(val);
    }
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!fullName.trim() || fullName.trim().length < 2) {
      setError("Please provide your full legal name (at least 2 characters).");
      return;
    }

    const cleanPhone = phoneNumber.trim().replace(/\s+/g, "");
    if (!cleanPhone || cleanPhone.length < 9) {
      setError("Please provide a valid active phone number.");
      return;
    }

    if (!constituency) {
      setError("Please select your Constituency.");
      return;
    }

    if (!ward) {
      setError("Please select your Ward.");
      return;
    }

    if (!pollingStation) {
      setError("Please select your Landmark.");
      return;
    }

    if (isOtherStation && !otherStationText.trim()) {
      setError("Please describe your landmark or location.");
      return;
    }

    if (!isCommitted) {
      setError("Please confirm your commitment by checking the pledge box.");
      return;
    }

    const finalStation = isOtherStation ? otherStationText.trim() : pollingStation;
    const finalRole = volunteerRole === OTHER_ROLE && otherRoleText.trim() ? otherRoleText.trim() : volunteerRole;

    setLoading(true);

    try {
      const response = await fetch("/api/v1/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          idNumber: idNumber.trim(),
          phoneNumber: cleanPhone,
          constituency,
          ward,
          pollingStation: finalStation,
          isOtherStation,
          volunteerRole: finalRole,
          isCommitted,
          occupation: occupation.trim(),
          educationLevel: educationLevel.trim(),
          comment: comment.trim(),
        }),
      });

      const result: ApiResponse<Volunteer> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to submit registration");
      }

      setSuccessVolunteer(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFullName("");
    setIdNumber("");
    setPhoneNumber("");
    setConstituency("");
    setWard("");
    setPollingStation("");
    setIsOtherStation(false);
    setOtherStationText("");
    setVolunteerRole("Mobilizer (Ground Agent)");
    setOtherRoleText("");
    setIsCommitted(true);
    setOccupation("");
    setEducationLevel("");
    setComment("");
    setError(null);
    setSuccessVolunteer(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex flex-col justify-between pb-12 selection:bg-[#0B4DB8]/15 selection:text-[#0B4DB8]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e2e8f0] px-4 py-2.5">
        <div className="max-w-md lg:max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 overflow-hidden border border-[#e2e8f0] shrink-0 bg-white rounded-sm p-0.5">
              <img
                src="/images/tnd-logo.jpg"
                alt="TND Youth League"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xs font-bold tracking-tight text-[#0f172a] leading-none">
                Mombasa Volunteer Hub
              </h1>
              <p className="text-[10px] text-[#64748b] mt-0.5 font-medium">
                The New Democrats Youth League
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#E51A24] bg-[#E51A24]/10 px-2.5 py-0.5 rounded-sm border border-[#E51A24]/20 uppercase tracking-wide">
              2027
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md lg:max-w-6xl mx-auto w-full px-3.5 lg:px-6 pt-3 lg:pt-6 flex-1">
        {successVolunteer ? (
          /* Success Receipt Card */
          <div className="ios-card max-w-md lg:max-w-lg mx-auto p-6 mt-3 lg:mt-8 text-center border-[#e2e8f0]">
            <div className="w-14 h-14 rounded-full bg-[#0B4DB8]/10 text-[#0B4DB8] flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#0B4DB8] bg-[#0B4DB8]/10 px-2.5 py-0.5 rounded-sm mb-2">
              Registration Confirmed
            </span>

            <h2 className="text-lg font-bold text-[#0f172a]">
              Welcome, {successVolunteer.fullName}!
            </h2>
            <p className="text-xs text-[#64748b] mt-0.5 mb-5">
              You are registered as a volunteer agent for Mombasa County (2027).
            </p>

            {/* Receipt Summary Details */}
            <div className="bg-[#f8fafc] rounded-sm p-3.5 text-left border border-[#e2e8f0] space-y-2.5 mb-5">
              {/* Volunteer ID */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#64748b] flex items-center gap-1">
                  <Hash className="w-3 h-3" /> Volunteer ID
                </span>
                <span className="font-mono font-semibold text-[#0B4DB8] text-[10px] tracking-tight select-all">
                  {successVolunteer._id}
                </span>
              </div>
              <div className="h-px bg-[#e2e8f0]" />
              {successVolunteer.constituency && (
                <>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#64748b]">Constituency</span>
                    <span className="font-semibold text-[#0f172a]">{successVolunteer.constituency}</span>
                  </div>
                  <div className="h-px bg-[#e2e8f0]" />
                </>
              )}
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#64748b]">Ward</span>
                <span className="font-semibold text-[#0f172a]">{successVolunteer.ward}</span>
              </div>
              {successVolunteer.idNumber && (
                <>
                  <div className="h-px bg-[#e2e8f0]" />
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#64748b]">National ID</span>
                    <span className="font-semibold text-[#0f172a]">{successVolunteer.idNumber}</span>
                  </div>
                </>
              )}
              <div className="h-px bg-[#e2e8f0]" />
              <div className="flex justify-between items-start text-xs">
                <span className="text-[#64748b]">Landmark</span>
                <span className="font-semibold text-[#0f172a] text-right max-w-[65%]">
                  {successVolunteer.pollingStation}
                  {successVolunteer.isOtherStation && (
                    <span className="text-[#0B4DB8] text-[10px] block">Not in list</span>
                  )}
                </span>
              </div>
              <div className="h-px bg-[#e2e8f0]" />
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#64748b]">Volunteer As</span>
                <span className="font-semibold text-[#0B4DB8]">
                  {successVolunteer.volunteerRole || "Mobilizer"}
                </span>
              </div>
              <div className="h-px bg-[#e2e8f0]" />
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#64748b]">Phone</span>
                <span className="font-semibold text-[#0f172a]">{successVolunteer.phoneNumber}</span>
              </div>
              {successVolunteer.occupation && (
                <>
                  <div className="h-px bg-[#e2e8f0]" />
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#64748b]">Occupation</span>
                    <span className="font-semibold text-[#0f172a]">{successVolunteer.occupation}</span>
                  </div>
                </>
              )}
              {successVolunteer.educationLevel && (
                <>
                  <div className="h-px bg-[#e2e8f0]" />
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#64748b]">Education</span>
                    <span className="font-semibold text-[#0f172a]">{successVolunteer.educationLevel}</span>
                  </div>
                </>
              )}
              <div className="h-px bg-[#e2e8f0]" />
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#64748b]">Commitment</span>
                <span className="font-semibold text-emerald-700">
                  Confirmed Pledge ✓
                </span>
              </div>
              <div className="h-px bg-[#e2e8f0]" />
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#64748b]">Status</span>
                <span className="font-semibold text-[#0B4DB8] capitalize">
                  {successVolunteer.status}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleReset}
                className="ios-button-primary cursor-pointer"
              >
                Register Another Volunteer
              </button>

              <Link
                href="/admin"
                className="ios-button-secondary w-full text-xs"
              >
                View Polling Station Team
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        ) : (
          /* Normal Registration: Stacked on mobile, 2-column side-by-side on LG screens */
          <div className="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 lg:items-start">
            {/* Left Column (Hero & Geographic Accordion on LG) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 26, mass: 0.8 }}
              className="lg:col-span-5 space-y-3"
            >
              {/* Hero Banner */}
              <div className="ios-card overflow-hidden bg-white border border-[#e2e8f0] shadow-xs">
                {/* Edge-to-Edge Image Container spanning 100% container width */}
                <div className="relative w-full bg-white overflow-hidden border-b border-[#e2e8f0]">
                  {/* Floating Badges over top of Image */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20 pointer-events-none">
                    <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-sm border border-[#e2e8f0] text-[#0f172a] shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-[#0B4DB8] animate-pulse" />
                      <span className="text-[10px] font-semibold tracking-wide text-[#0B4DB8]">
                        Official Portal
                      </span>
                    </div>

                    <div className="bg-[#E51A24] text-white px-2.5 py-1 rounded-sm text-[10px] font-bold tracking-wider uppercase shadow-xs">
                      2027 Election
                    </div>
                  </div>

                  {/* Full Container Width Image with Stretchy Elastic Spring */}
                  <div className="w-full relative aspect-square sm:aspect-[4/3] lg:aspect-square bg-white flex items-center justify-center overflow-hidden">
                    <motion.div
                      style={{ scale: heroScale, y: heroY }}
                      className="w-full h-full origin-top"
                    >
                      <img
                        src="/images/candidate.jpg"
                        alt="The New Democrats Youth League - Mombasa Chapter"
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.015]"
                      />
                    </motion.div>
                  </div>

                  {/* Header and Subtitle Under Graphic */}
                  <div className="text-center p-4 sm:p-5 bg-gradient-to-b from-white to-[#f8fafc] border-t border-[#e2e8f0]/80">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-[#E51A24] bg-[#E51A24]/10 px-3 py-0.5 rounded-full border border-[#E51A24]/20 inline-block mb-1.5">
                      Mombasa County Chapter
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-[#475569] leading-tight font-sans">
                      Ground Volunteer Network
                    </h2>
                    <p className="text-xs text-[#64748b] mt-1.5 max-w-sm mx-auto font-normal leading-relaxed">
                      Mobilizing 6 Constituencies, 30 Wards &amp; 229 Polling Stations across Mombasa County.
                    </p>
                  </div>
                </div>

                {/* County Stats Strip */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-[#f8fafc] text-center border-t border-[#e2e8f0]">
                  <motion.div
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 450, damping: 20 }}
                    className="bg-white py-2 px-1 rounded-sm border border-[#e2e8f0] shadow-xs hover:border-[#0B4DB8]/40 transition-colors cursor-default select-none"
                  >
                    <p className="text-[10px] text-[#64748b] uppercase font-semibold">Constituencies</p>
                    <p className="text-sm font-extrabold text-[#0B4DB8]">{mombasaConstituencies.length}</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 450, damping: 20 }}
                    className="bg-white py-2 px-1 rounded-sm border border-[#e2e8f0] shadow-xs hover:border-[#0B4DB8]/40 transition-colors cursor-default select-none"
                  >
                    <p className="text-[10px] text-[#64748b] uppercase font-semibold">Wards</p>
                    <p className="text-sm font-extrabold text-[#0B4DB8]">{mombasaWards.length}</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 450, damping: 20 }}
                    className="bg-white py-2 px-1 rounded-sm border border-[#e2e8f0] shadow-xs hover:border-[#E51A24]/40 transition-colors cursor-default select-none"
                  >
                    <p className="text-[10px] text-[#64748b] uppercase font-semibold">Stations</p>
                    <p className="text-sm font-extrabold text-[#E51A24]">{totalPollingStations}</p>
                  </motion.div>
                </div>
              </div>

              {/* Geographical Mappings - Smooth Accordion */}
              <div className="ios-card overflow-hidden border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setShowWardsAccordion((prev) => !prev)}
                  className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-[#f1f5f9] active:bg-[#eef4fb] transition-colors select-none"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-sm bg-[#0B4DB8]/10 text-[#0B4DB8] flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0f172a]">
                        Constituencies, Wards &amp; Polling Stations
                      </h4>
                      <p className="text-[10px] text-[#64748b]">
                        {showWardsAccordion
                          ? "Tap to collapse mappings"
                          : `${mombasaConstituencies.length} Constituencies • ${mombasaWards.length} Wards • ${totalPollingStations} Stations (Tap to explore)`}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`p-1 text-[#64748b] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                      showWardsAccordion ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Stretchy Spring Accordion Content */}
                <AnimatePresence initial={false}>
                  {showWardsAccordion && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 320, damping: 28 }}
                      className="overflow-hidden border-t border-[#e2e8f0]"
                    >
                      <div className="p-3 space-y-2.5 bg-[#f8fafc]">
                        <p className="text-[10px] text-[#64748b]">
                          Tap any designated station below to pre-select it in the registration form:
                        </p>

                        <div className="space-y-3">
                          {mombasaConstituencies.map((cName) => {
                            const cWards = getWardsByConstituency(cName);
                            return (
                              <div
                                key={cName}
                                className="bg-white rounded-sm border border-[#e2e8f0] p-2.5 space-y-2 shadow-xs"
                              >
                                <div className="flex items-center justify-between pb-1.5 border-b border-[#e2e8f0]">
                                  <p className="text-xs font-bold text-[#0B4DB8] uppercase tracking-wide">
                                    {cName} Constituency
                                  </p>
                                  <span className="text-[10px] text-[#64748b] font-medium">
                                    {cWards.length} Wards
                                  </span>
                                </div>

                                <div className="space-y-2">
                                  {cWards.map((w) => (
                                    <div
                                      key={w.ward}
                                      className="bg-[#f8fafc] rounded-xs border border-[#e2e8f0]/80 p-2 space-y-1.5"
                                    >
                                      <div className="flex items-center justify-between">
                                        <p className="text-[11px] font-bold text-[#0f172a]">
                                          {w.ward} Ward
                                        </p>
                                        <p className="text-[10px] text-[#64748b]">
                                          {w.pollingStations.length} Stations
                                        </p>
                                      </div>

                                      {/* Station Buttons with iOS Spring Tactile Feedback */}
                                      <div className="pt-1 border-t border-[#e2e8f0]/60 flex flex-wrap gap-1">
                                        {w.pollingStations.map((station) => (
                                          <motion.button
                                            key={station}
                                            type="button"
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.93 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 20 }}
                                            onClick={() => {
                                              setConstituency(cName);
                                              setWard(w.ward);
                                              setPollingStation(station);
                                              setIsOtherStation(false);
                                              setOtherStationText("");
                                              window.scrollTo({ top: 120, behavior: "smooth" });
                                            }}
                                            className={`text-[10px] px-2.5 py-1 rounded-sm border cursor-pointer select-none ${
                                              constituency === cName && ward === w.ward && pollingStation === station
                                                ? "bg-[#0B4DB8] text-white border-[#0B4DB8] font-semibold shadow-xs ring-1 ring-[#0B4DB8]"
                                                : "bg-white text-[#0f172a] border-[#e2e8f0] hover:bg-[#eef4fb] hover:border-[#0B4DB8]/30"
                                            }`}
                                          >
                                            {station}
                                          </motion.button>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Right Column (Volunteer Registration Form on LG) */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 26, delay: 0.05, mass: 0.8 }}
              className="lg:col-span-7"
            >
              {/* Error Banner */}
              {error && (
                <div className="bg-white border-l-4 border-red-600 text-red-800 p-3 rounded-sm border border-[#e2e8f0] text-xs flex items-start gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-[#0f172a]">Notice</p>
                    <p className="text-[#64748b] mt-0.5">{error}</p>
                  </div>
                </div>
              )}

              {/* Registration Form Card */}
              <form onSubmit={handleSubmit} className="ios-card p-4 sm:p-5 lg:p-6 space-y-4 border-[#e2e8f0]">
                <div className="border-b border-[#e2e8f0] pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#0f172a]">
                        Volunteer Registration
                      </h3>
                      <p className="text-xs text-[#64748b] mt-0.5">
                        Join the ground mobilization network across Mombasa County.
                      </p>
                    </div>
                    <span className="hidden sm:inline-block text-[11px] font-semibold text-[#0B4DB8] bg-[#0B4DB8]/10 px-2.5 py-1 rounded-sm border border-[#0B4DB8]/20">
                      TND Mombasa
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0f172a] mb-1.5">
                      Full Legal Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748b]">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Wycliffe Omwitsa"
                        className="ios-input ios-input-icon !pl-11"
                      />
                    </div>
                  </div>

                  {/* National ID & Phone Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* National ID Number */}
                    <div>
                      <label className="block text-xs font-semibold text-[#0f172a] mb-1.5 flex items-center justify-between">
                        <span>National ID Number</span>
                        <span className="text-[10px] font-normal text-[#64748b]">Kitambulisho</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748b]">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={idNumber}
                          onChange={(e) => setIdNumber(e.target.value)}
                          placeholder="e.g. 12345678"
                          className="ios-input ios-input-icon !pl-11"
                        />
                      </div>
                      <p className="text-[10px] text-[#64748b] mt-1 pl-0.5">
                        Strictly for voter verification &amp; tallying.
                      </p>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-semibold text-[#0f172a] mb-1.5">
                        Mobile Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748b]">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="0712 345 678 or +254 7..."
                          className="ios-input ios-input-icon !pl-11"
                        />
                      </div>
                      <p className="text-[10px] text-[#64748b] mt-1 pl-0.5">
                        Used for SMS station alerts and direct WhatsApp coordination.
                      </p>
                    </div>
                  </div>

                  {/* Occupation (Kazi) & Education Level */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Occupation (Kazi) - Optional */}
                    <div>
                      <label className="block text-xs font-semibold text-[#0f172a] mb-1.5 flex items-center gap-1.5">
                        <span>Kazi</span>
                        <span className="text-[10px] font-normal text-[#64748b] line-through decoration-[#0B4DB8]/50">Occupation</span>
                        <span className="text-[10px] font-normal text-[#64748b]">(Optional)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748b]">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={occupation}
                          onChange={(e) => setOccupation(e.target.value)}
                          placeholder="e.g. Teacher, Farmer, Business..."
                          className="ios-input ios-input-icon !pl-11"
                        />
                      </div>
                    </div>

                    {/* Level of Education - Optional */}
                    <div>
                      <label className="block text-xs font-semibold text-[#0f172a] mb-1.5 flex items-center gap-1.5">
                        <span>Level of Education</span>
                        <span className="text-[10px] font-normal text-[#64748b]">(Optional)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748b]">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <select
                          value={educationLevel}
                          onChange={(e) => setEducationLevel(e.target.value)}
                          className="ios-input ios-input-icon ios-select-icon !pl-11 !pr-9 appearance-none bg-white cursor-pointer"
                        >
                          <option value="">-- Choose Level --</option>
                          <option value="Primary School">Primary School (KCPE)</option>
                          <option value="Secondary School">Secondary School (KCSE)</option>
                          <option value="Certificate / TVET">Certificate / TVET</option>
                          <option value="Diploma">Diploma</option>
                          <option value="Undergraduate Degree">Undergraduate Degree (Bachelors)</option>
                          <option value="Postgraduate">Postgraduate (Masters / PhD)</option>
                          <option value="Other">Other</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#64748b]">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Volunteer As (Role) Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0f172a] mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#0B4DB8]" />
                        <span>Volunteer As</span>
                        <span className="text-red-500">*</span>
                      </span>
                      <span className="text-[10px] font-normal text-[#64748b]">Select your primary capacity</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748b]">
                        <Award className="w-4 h-4" />
                      </div>
                      <select
                        required
                        value={volunteerRole}
                        onChange={(e) => setVolunteerRole(e.target.value)}
                        className="ios-input ios-input-icon ios-select-icon !pl-11 !pr-9 appearance-none bg-white cursor-pointer"
                      >
                        <option value="Mobilizer (Ground Agent)">Mobilizer (Ground Agent)</option>
                        <option value="Campaign Team & Strategy">Campaign Team & Strategy</option>
                        <option value="Sponsor & Well Wisher">Sponsor & Well Wisher</option>
                        <option value="Blogger & Social Media">Blogger & Social Media</option>
                        <option value="Media & Communications">Media & Communications</option>
                        <option value="Office & Administration">Office & Administration</option>
                        <option value="Women League Leader">Women League Leader</option>
                        <option value="Youth & Bodaboda Mobilizer">Youth & Bodaboda Mobilizer</option>
                        <option value="Polling Day Agent">Polling Day Agent</option>
                        <option value="Logistics & Transport">Logistics & Transport</option>
                        <option value={OTHER_ROLE}>Other (Specify)</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#64748b]">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>

                    {volunteerRole === OTHER_ROLE && (
                      <div className="mt-2 relative">
                        <input
                          type="text"
                          required
                          value={otherRoleText}
                          onChange={(e) => setOtherRoleText(e.target.value)}
                          placeholder="Please specify how you wish to volunteer..."
                          className="ios-input text-xs"
                        />
                      </div>
                    )}
                  </div>

                  {/* 3 Cascading Dropdowns: Constituency, Ward & Landmark */}
                  <div className="space-y-3.5">
                    {/* Constituency Selection (Dropdown 1) */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-semibold text-[#0f172a]">
                          Select Constituency <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[10px] text-[#0B4DB8] font-semibold">
                          {mombasaConstituencies.length} in Mombasa County
                        </span>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748b]">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <select
                          required
                          value={constituency}
                          onChange={handleConstituencyChange}
                          className="ios-input ios-input-icon ios-select-icon !pl-11 !pr-9 appearance-none bg-white cursor-pointer"
                        >
                          <option value="">-- Choose Constituency in Mombasa --</option>
                          {mombasaConstituencies.map((c) => (
                            <option key={c} value={c}>
                              {c} Constituency
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#64748b]">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Ward & Landmark Grid (Dropdowns 2 & 3) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Ward Selection (Dropdown 2 - Cascading) */}
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="text-xs font-semibold text-[#0f172a]">
                            Select Ward <span className="text-red-500">*</span>
                          </label>
                          {constituency && (
                            <span className="text-[10px] text-[#0B4DB8] font-semibold">
                              {availableWards.length} in {constituency}
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748b]">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <select
                            required
                            disabled={!constituency}
                            value={ward}
                            onChange={handleWardChange}
                            className="ios-input ios-input-icon ios-select-icon !pl-11 !pr-9 appearance-none bg-white cursor-pointer disabled:bg-[#f1f5f9] disabled:text-[#64748b] disabled:cursor-not-allowed"
                          >
                            <option value="">
                              {constituency
                                ? `-- Choose Ward in ${constituency} --`
                                : "-- Select Constituency First --"}
                            </option>
                            {availableWards.map((w) => (
                              <option key={w.ward} value={w.ward}>
                                {w.ward} Ward
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#64748b]">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Landmark (Dropdown 3 - Cascading) */}
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="text-xs font-semibold text-[#0f172a]">
                            Select Landmark <span className="text-red-500">*</span>
                          </label>
                          {selectedWardData && (
                            <span className="text-[10px] text-[#0B4DB8] font-semibold">
                              {availableStations.length} in {ward}
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748b]">
                            <Vote className="w-4 h-4" />
                          </div>
                          <select
                            required
                            disabled={!ward}
                            value={pollingStation}
                            onChange={handleStationChange}
                            className="ios-input ios-input-icon ios-select-icon !pl-11 !pr-9 appearance-none bg-white cursor-pointer disabled:bg-[#f1f5f9] disabled:text-[#64748b] disabled:cursor-not-allowed"
                          >
                            <option value="">
                              {ward
                                ? `-- Choose Landmark in ${ward} --`
                                : "-- Select Ward First --"}
                            </option>
                            {availableStations.map((station) => (
                              <option key={station} value={station}>
                                {station}
                              </option>
                            ))}
                            {ward && (
                              <option value={OTHER_STATION}>
                                ⚠ My landmark is not listed above
                              </option>
                            )}
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#64748b]">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* "Other" Landmark Text Input — shown when user selects "not listed" */}
                  {isOtherStation && (
                    <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-sm p-3 space-y-2">
                      <div className="flex items-start gap-2">
                        <HelpCircle className="w-4 h-4 text-[#0B4DB8] shrink-0 mt-0.5" />
                        <p className="text-[11px] text-[#64748b]">
                          No problem — please type the name of your landmark or nearest center below. Our team will verify and record your location.
                        </p>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748b]">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={otherStationText}
                          onChange={(e) => setOtherStationText(e.target.value)}
                          placeholder="e.g. Near Kongowea Market, Buxton, Likoni..."
                          className="ios-input ios-input-icon !pl-11"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Comment / Message - Optional */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0f172a] mb-1.5 flex items-center gap-1.5">
                      <span>Message / Comment</span>
                      <span className="text-[10px] font-normal text-[#64748b]">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-0 pl-3.5 flex items-start pointer-events-none text-[#64748b]">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Any message or additional information for the team..."
                        rows={3}
                        maxLength={1000}
                        className="ios-input ios-input-icon !pl-11 !pt-2.5 resize-none text-xs"
                      />
                    </div>
                    {comment.length > 0 && (
                      <p className="text-[10px] text-[#64748b] mt-1 text-right">
                        {comment.length}/1000
                      </p>
                    )}
                  </div>

                  {/* Commitment Checkbox ("Are you really committed") */}
                  <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-sm p-3.5 transition-all duration-200 hover:border-[#0B4DB8]/40 active:scale-[0.99] select-none">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={isCommitted}
                        onChange={(e) => setIsCommitted(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded-xs text-[#0B4DB8] accent-[#0B4DB8] cursor-pointer"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-[#0f172a] flex items-center gap-1">
                          <span>Are you really committed?</span>
                          <span className="text-red-500">*</span>
                        </span>
                        <p className="text-[11px] text-[#64748b] mt-0.5 leading-snug">
                          Yes, I confirm my voluntary commitment and active dedication to the ground campaign of The New Democrats Youth League Mombasa Chapter (2027).
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Submit CTA */}
                <div className="pt-2">
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.008 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 450, damping: 20 }}
                    className="ios-button-primary cursor-pointer disabled:opacity-60 text-sm py-3 font-semibold shadow-xs hover:shadow-sm"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting Registration...
                      </span>
                    ) : (
                      <>
                        <span>Join as Volunteer</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>

                <p className="text-[10px] text-center text-[#64748b] pt-1">
                  Your data is strictly for identification &amp; tallying &bull; Never shared with third parties.{" "}
                  <Link href="/privacy" className="text-[#0B4DB8] font-semibold underline hover:text-[#083B8F] active:opacity-75 transition-opacity">
                    Privacy Policy &amp; Terms
                  </Link>
                </p>
              </form>
            </motion.div>
          </div>
        )}
      </main>

      {/* Floating Bottom Coordinator Dock */}
      <footer className="max-w-md lg:max-w-lg mx-auto w-full px-3.5 mt-6">
        <div className="bg-white rounded-sm border border-[#e2e8f0] p-1.5 flex items-center justify-around shadow-xs">
          <Link
            href="/"
            className="flex-1 py-2 text-center rounded-sm bg-[#0B4DB8] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-transform duration-150 select-none"
          >
            <User className="w-3.5 h-3.5" />
            Volunteer Form
          </Link>
          <Link
            href="/admin"
            className="flex-1 py-2 text-center rounded-sm text-[#0f172a] hover:bg-[#f1f5f9] active:scale-95 text-xs font-medium flex items-center justify-center gap-1.5 transition-all duration-150 select-none"
          >
            <Shield className="w-3.5 h-3.5 text-[#64748b]" />
            Coordinator Admin
          </Link>
        </div>
        <p className="text-[10px] text-center text-[#64748b] mt-2.5">
          <span>Mombasa County &bull; TND Youth League Mombasa Chapter 2027 &bull; </span>
          <Link href="/privacy" className="text-[#0B4DB8] hover:underline font-semibold active:opacity-75 transition-opacity">
            Privacy Policy &amp; Terms
          </Link>
        </p>
      </footer>
    </div>
  );
}
