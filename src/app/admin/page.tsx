"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Shield,
  Search,
  Filter,
  Download,
  Trash2,
  CheckCircle,
  Phone,
  User,
  MapPin,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  X,
  ExternalLink,
  ChevronRight,
  Vote,
  Unlock,
  Lock,
  FileText,
  Printer,
  Table as TableIcon,
  ChevronDown,
  LayoutGrid,
  List,
  LogOut,
} from "lucide-react";
import { mombasaWards, mombasaConstituencies, getWardsByConstituency } from "@/constants/mombasa-wards";
import { ApiResponse, Volunteer, VolunteerStats } from "@/types";
import {
  exportToPdf,
  exportToCsv,
  exportToWord,
  openPrintDialog,
} from "@/lib/export-utils";

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [stats, setStats] = useState<VolunteerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("ALL");
  const [selectedWard, setSelectedWard] = useState("ALL");
  const [selectedStation, setSelectedStation] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Volunteer | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");

  // Check initial session or default unlock for development convenience
  useEffect(() => {
    const saved = localStorage.getItem("mombasa_admin_auth");
    if (saved === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passcode.trim();
    if (clean === "@tnd2027" || clean.toLowerCase() === "@tnd2027") {
      setIsAuthenticated(true);
      localStorage.setItem("mombasa_admin_auth", "true");
      setAuthError("");
    } else {
      setAuthError("Incorrect coordinator passcode.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode("");
    localStorage.removeItem("mombasa_admin_auth");
  };

  // Load volunteers & stats
  const fetchData = async () => {
    setRefreshing(true);
    try {
      const [volRes, statsRes] = await Promise.all([
        fetch("/api/v1/volunteers"),
        fetch("/api/v1/volunteers/stats"),
      ]);

      const volJson: ApiResponse<Volunteer[]> = await volRes.json();
      const statsJson: ApiResponse<VolunteerStats> = await statsRes.json();

      if (volJson.success && volJson.data) {
        setVolunteers(volJson.data);
      }
      if (statsJson.success && statsJson.data) {
        setStats(statsJson.data);
      }
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Available wards based on chosen constituency
  const availableWardsForFilter = useMemo(() => {
    if (selectedConstituency === "ALL") {
      return mombasaWards;
    }
    return getWardsByConstituency(selectedConstituency);
  }, [selectedConstituency]);

  // Available stations based on chosen ward & constituency
  const availableStationsForFilter = useMemo(() => {
    if (selectedWard !== "ALL") {
      const wardObj = mombasaWards.find((w) => w.ward === selectedWard);
      return wardObj ? wardObj.pollingStations : [];
    }
    if (selectedConstituency !== "ALL") {
      return getWardsByConstituency(selectedConstituency).flatMap((w) => w.pollingStations);
    }
    return mombasaWards.flatMap((w) => w.pollingStations);
  }, [selectedConstituency, selectedWard]);

  // Client-side filtering
  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((item) => {
      if (selectedConstituency !== "ALL" && item.constituency !== selectedConstituency) return false;
      if (selectedWard !== "ALL" && item.ward !== selectedWard) return false;
      if (selectedStation !== "ALL" && item.pollingStation !== selectedStation) return false;
      if (selectedStatus !== "ALL" && item.status !== selectedStatus) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesName = item.fullName.toLowerCase().includes(q);
        const matchesId = (item.idNumber || "").toLowerCase().includes(q);
        const matchesPhone = item.phoneNumber.toLowerCase().includes(q);
        const matchesConstituency = (item.constituency || "").toLowerCase().includes(q);
        const matchesWard = item.ward.toLowerCase().includes(q);
        const matchesStation = item.pollingStation.toLowerCase().includes(q);
        const matchesOccupation = (item.occupation || "").toLowerCase().includes(q);
        const matchesEducation = (item.educationLevel || "").toLowerCase().includes(q);
        const matchesRole = (item.volunteerRole || "").toLowerCase().includes(q);
        if (
          !matchesName &&
          !matchesId &&
          !matchesPhone &&
          !matchesConstituency &&
          !matchesWard &&
          !matchesStation &&
          !matchesOccupation &&
          !matchesEducation &&
          !matchesRole
        ) {
          return false;
        }
      }
      return true;
    });
  }, [volunteers, selectedConstituency, selectedWard, selectedStation, selectedStatus, search]);

  // Toggle status
  const handleToggleStatus = async (volunteer: Volunteer) => {
    const nextStatus = volunteer.status === "verified" ? "active" : "verified";
    try {
      const res = await fetch(`/api/v1/volunteers/${volunteer._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data: ApiResponse<Volunteer> = await res.json();
      if (data.success && data.data) {
        setVolunteers((prev) =>
          prev.map((v) => (v._id === volunteer._id ? data.data! : v))
        );
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  // Delete volunteer
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/v1/volunteers/${deleteTarget._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setVolunteers((prev) => prev.filter((v) => v._id !== deleteTarget._id));
        setDeleteTarget(null);
      }
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setActionLoading(false);
    }
  };

  // If not authenticated, show sleek iOS passcode screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-100/60 via-[#f8fafc] to-white text-[#0f172a] flex items-center justify-center p-4 selection:bg-[#0B4DB8]/15 selection:text-[#0B4DB8]">
        <div className="w-full max-w-[370px] bg-white rounded-2xl border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-7 animate-in fade-in duration-200">
          {/* Header & Logo */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-3.5">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center overflow-hidden p-1">
                <img
                  src="/images/tnd-logo.jpg"
                  alt="TND Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0B4DB8] text-white flex items-center justify-center shadow-xs ring-2 ring-white">
                <Lock className="w-2.5 h-2.5" />
              </div>
            </div>

            <span className="text-[10px] font-semibold text-[#0B4DB8] tracking-widest uppercase mb-1">
              TND Youth League &bull; Mombasa
            </span>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Coordinator Console
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-[260px] leading-relaxed">
              Protected administrative access to Mombasa County volunteer rosters and field operations.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleUnlock} className="space-y-3.5">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (authError) setAuthError("");
                }}
                placeholder="••••••••"
                className="w-full text-center text-lg tracking-[0.35em] font-mono py-3 px-4 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#0B4DB8] rounded-xl outline-none transition-all duration-200 focus:ring-4 focus:ring-[#0B4DB8]/10 text-slate-900 placeholder:tracking-normal placeholder:font-sans placeholder:text-slate-400 placeholder:text-sm"
                autoFocus
              />
            </div>

            {authError && (
              <div className="text-xs text-[#E51A24] bg-[#E51A24]/8 border border-[#E51A24]/20 py-2 px-3 rounded-lg text-center font-medium animate-in fade-in duration-150">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#0B4DB8] hover:bg-[#083B8F] active:scale-[0.98] text-white text-xs font-semibold tracking-wide transition-all duration-150 flex items-center justify-center gap-2 shadow-xs select-none cursor-pointer"
            >
              <span>Unlock Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Clean Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link
              href="/"
              className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volunteer Form</span>
            </Link>
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Shield className="w-3 h-3 text-[#0B4DB8]" />
              <span>2027 Roster</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex flex-col selection:bg-[#0B4DB8]/15 selection:text-[#0B4DB8] pb-16">
      {/* Top iOS Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#e2e8f0] px-4 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Brand & Clean Title */}
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              href="/"
              className="p-1.5 -ml-1 rounded-lg text-[#64748b] hover:text-[#0f172a] hover:bg-slate-100 transition-colors shrink-0"
              title="Return to Volunteer Form"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-7 h-7 rounded-md border border-slate-200/80 shrink-0 bg-white p-0.5 shadow-2xs">
              <img
                src="/images/tnd-logo.jpg"
                alt="TND"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-[#0f172a] truncate leading-tight">
                Coordinator Command
              </h1>
              <p className="text-[11px] text-[#64748b] truncate leading-none mt-0.5">
                Mombasa County Chapter
              </p>
            </div>
          </div>

          {/* Right: Actions (Export + Lean Logout) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Export Menu (PDF, CSV, Word, Print) */}
            <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setShowExportMenu((prev) => !prev)}
              className="py-1.5 px-3 rounded-lg bg-[#0B4DB8] hover:bg-[#083B8F] active:scale-95 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs select-none cursor-pointer"
              title="Export volunteer roster"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${
                  showExportMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {showExportMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-[0_12px_36px_rgba(0,0,0,0.14),0_4px_12px_rgba(0,0,0,0.06)] border border-slate-200/90 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Export Roster
                    </p>
                    <span className="text-[10px] font-bold text-[#0B4DB8] bg-[#0B4DB8]/10 px-1.5 py-0.5 rounded">
                      {filteredVolunteers.length} records
                    </span>
                  </div>

                  {/* Option 1: PDF Document (Vector landscape layout) */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowExportMenu(false);
                      exportToPdf(filteredVolunteers, {
                        constituency: selectedConstituency,
                        ward: selectedWard,
                        pollingStation: selectedStation,
                      });
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-800">PDF Document</span>
                        <span className="text-[8.5px] font-bold px-1.5 py-0.2 bg-red-100 text-red-700 rounded uppercase">
                          .pdf
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">
                        Clean vector landscape layout
                      </p>
                    </div>
                  </button>

                  {/* Option 2: Excel / CSV Spreadsheet */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowExportMenu(false);
                      exportToCsv(filteredVolunteers, {
                        constituency: selectedConstituency,
                        ward: selectedWard,
                        pollingStation: selectedStation,
                      });
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <TableIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-800">Excel / CSV</span>
                        <span className="text-[8.5px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-700 rounded uppercase">
                          .csv
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">
                        UTF-8 spreadsheet for Excel & Sheets
                      </p>
                    </div>
                  </button>

                  {/* Option 3: Word Document */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowExportMenu(false);
                      exportToWord(filteredVolunteers, {
                        constituency: selectedConstituency,
                        ward: selectedWard,
                        pollingStation: selectedStation,
                      });
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0B4DB8] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-800">Word Document</span>
                        <span className="text-[8.5px] font-bold px-1.5 py-0.2 bg-blue-100 text-[#0B4DB8] rounded uppercase">
                          .doc
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">
                        Fixed-grid office document
                      </p>
                    </div>
                  </button>

                  {/* Option 4: Print / Save as PDF dialog */}
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    type="button"
                    onClick={() => {
                      setShowExportMenu(false);
                      openPrintDialog(filteredVolunteers, {
                        constituency: selectedConstituency,
                        ward: selectedWard,
                        pollingStation: selectedStation,
                      });
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Printer className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-semibold text-slate-800">Print / Save PDF</span>
                      <p className="text-[10px] text-slate-400 truncate">
                        Native print sheet on mobile & PC
                      </p>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Lean Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 active:scale-95 transition-all text-xs font-medium flex items-center gap-1.5 cursor-pointer select-none"
            title="Log out and lock console"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto w-full px-4 pt-3 flex-1 space-y-3.5">
        {/* KPI Strip: Smooth horizontal swipe on mobile, clean grid on desktop */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1 sm:grid sm:grid-cols-4 lg:grid-cols-7">
          <div className="ios-card p-2.5 sm:p-3 shrink-0 min-w-[105px] sm:min-w-0 sm:col-span-1 border-[#e2e8f0]">
            <p className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider">
              Total
            </p>
            <p className="text-lg sm:text-xl font-bold text-[#0f172a] mt-0.5">
              {volunteers.length}
            </p>
            <p className="text-[10px] text-[#0B4DB8] mt-0.5 flex items-center gap-1 font-medium">
              <CheckCircle className="w-3 h-3" />
              {volunteers.filter((v) => v.status === "verified").length} Verified
            </p>
          </div>

          {mombasaConstituencies.map((c) => {
            const count = volunteers.filter((v) => (v.constituency || "") === c).length;
            const wardsInC = getWardsByConstituency(c);
            const isSelected = selectedConstituency === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setSelectedConstituency(isSelected ? "ALL" : c);
                  setSelectedWard("ALL");
                  setSelectedStation("ALL");
                }}
                className={`ios-card p-2.5 sm:p-3 shrink-0 min-w-[105px] sm:min-w-0 text-left transition-all cursor-pointer border-[#e2e8f0] select-none ${
                  isSelected ? "ring-2 ring-[#0B4DB8] bg-[#0B4DB8]/5" : "hover:border-[#0B4DB8]/40 active:scale-95"
                }`}
              >
                <p className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider truncate">
                  {c}
                </p>
                <p className="text-lg sm:text-xl font-bold text-[#0f172a] mt-0.5">
                  {count}
                </p>
                <p className="text-[10px] text-[#64748b] mt-0.5">
                  {wardsInC.length} wards
                </p>
              </button>
            );
          })}
        </div>

        {/* Filter & Search Bar */}
        <div className="ios-card p-4 space-y-3 border-[#e2e8f0]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {/* Search Input */}
            <div className="relative lg:col-span-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748b]">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search volunteer..."
                className="ios-input ios-input-icon !pl-10 text-xs w-full"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#64748b] hover:text-[#0f172a]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Constituency Selector */}
            <select
              value={selectedConstituency}
              onChange={(e) => {
                setSelectedConstituency(e.target.value);
                setSelectedWard("ALL");
                setSelectedStation("ALL");
              }}
              className="ios-input text-xs bg-white cursor-pointer w-full"
            >
              <option value="ALL">All Constituencies (6)</option>
              {mombasaConstituencies.map((c) => (
                <option key={c} value={c}>
                  {c} Constituency
                </option>
              ))}
            </select>

            {/* Ward Selector */}
            <select
              value={selectedWard}
              onChange={(e) => {
                setSelectedWard(e.target.value);
                setSelectedStation("ALL");
              }}
              className="ios-input text-xs bg-white cursor-pointer w-full"
            >
              <option value="ALL">
                {selectedConstituency === "ALL"
                  ? `All Wards (${mombasaWards.length})`
                  : `All in ${selectedConstituency}`}
              </option>
              {availableWardsForFilter.map((w) => (
                <option key={w.ward} value={w.ward}>
                  {w.ward} Ward
                </option>
              ))}
            </select>

            {/* Station / Landmark Selector */}
            <select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              className="ios-input text-xs bg-white cursor-pointer w-full"
            >
              <option value="ALL">All Landmarks</option>
              {availableStationsForFilter.map((station) => (
                <option key={station} value={station}>
                  {station}
                </option>
              ))}
            </select>

            {/* Status Selector */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="ios-input text-xs bg-white cursor-pointer w-full"
            >
              <option value="ALL">All Status</option>
              <option value="active">Active</option>
              <option value="verified">Verified</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#64748b] pt-1.5 border-t border-[#e2e8f0]">
            <div className="flex items-center gap-2">
              <span>
                Showing <strong className="text-[#0f172a]">{filteredVolunteers.length}</strong> of {volunteers.length} volunteers
                {selectedConstituency !== "ALL" && (
                  <span className="ml-1 text-[#0B4DB8] font-semibold">in {selectedConstituency}</span>
                )}
              </span>

              {(selectedConstituency !== "ALL" || selectedWard !== "ALL" || selectedStation !== "ALL" || selectedStatus !== "ALL" || search) && (
                <button
                  onClick={() => {
                    setSelectedConstituency("ALL");
                    setSelectedWard("ALL");
                    setSelectedStation("ALL");
                    setSelectedStatus("ALL");
                    setSearch("");
                  }}
                  className="text-[#0B4DB8] hover:underline font-semibold text-[11px] cursor-pointer"
                >
                  Reset filters
                </button>
              )}
            </div>

            {/* View Mode Toggle: Cards vs List */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all cursor-pointer select-none ${
                  viewMode === "cards"
                    ? "bg-white text-[#0B4DB8] shadow-2xs font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Current Card View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="text-[11px]">Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all cursor-pointer select-none ${
                  viewMode === "list"
                    ? "bg-white text-[#0B4DB8] shadow-2xs font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Compact List View"
              >
                <List className="w-3.5 h-3.5" />
                <span className="text-[11px]">List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Volunteers List (Responsive Cards for mobile, Table for wide screens) */}
        {loading ? (
          <div className="ios-card p-12 text-center text-[#64748b] border-[#e2e8f0]">
            <div className="w-8 h-8 border-2 border-[#0B4DB8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading volunteer records...</p>
          </div>
        ) : filteredVolunteers.length === 0 ? (
          <div className="ios-card p-10 text-center border-[#e2e8f0]">
            <User className="w-10 h-10 text-[#64748b] mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-[#0f172a]">No volunteers found</p>
            <p className="text-xs text-[#64748b] mt-1">
              Try adjusting your search query or filter selection.
            </p>
          </div>
        ) : viewMode === "list" ? (
          /* List View: High-density compact view on mobile & desktop */
          <div className="space-y-3">
            {/* Mobile Compact Rows */}
            <div className="space-y-1.5 sm:hidden">
              {filteredVolunteers.map((vol) => (
                <div
                  key={vol._id}
                  className="ios-card p-3 border-[#e2e8f0] flex items-center justify-between gap-2.5 hover:border-[#0B4DB8]/30 transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-[#0f172a] truncate">
                        {vol.fullName}
                      </span>
                      {vol.idNumber && (
                        <span className="text-[9px] font-mono bg-slate-100 text-slate-600 px-1 py-0.2 rounded shrink-0">
                          ID: {vol.idNumber}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-[#64748b] mt-0.5 truncate">
                      {vol.constituency && (
                        <span className="font-semibold text-[#0B4DB8]">{vol.constituency} &bull;</span>
                      )}
                      <span className="font-medium text-[#0f172a]">{vol.ward}</span>
                      <span>&bull;</span>
                      <span className="truncate">{vol.pollingStation}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <a
                        href={`tel:${vol.phoneNumber}`}
                        className="text-[10px] font-mono font-semibold text-[#0B4DB8] hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-2.5 h-2.5" />
                        {vol.phoneNumber}
                      </a>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#0B4DB8]/10 text-[#0B4DB8] font-medium">
                        {vol.volunteerRole || "Mobilizer"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <button
                      onClick={() => handleToggleStatus(vol)}
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors cursor-pointer select-none ${
                        vol.status === "verified"
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                      title="Toggle verification"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          vol.status === "verified" ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      <span className="capitalize">{vol.status}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <a
                        href={`https://wa.me/${vol.phoneNumber.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 rounded text-[#0B4DB8] hover:bg-[#0B4DB8]/10 transition-colors"
                        title="WhatsApp"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => setDeleteTarget(vol)}
                        className="p-1 rounded text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete volunteer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block ios-card overflow-hidden border-[#e2e8f0]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#64748b] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-4 py-3">Volunteer</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">DOB</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Constituency</th>
                    <th className="px-4 py-3">Ward</th>
                    <th className="px-4 py-3">Landmark</th>
                    <th className="px-4 py-3">Kazi</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                  {filteredVolunteers.map((vol) => (
                    <tr key={vol._id} className="hover:bg-[#f8fafc]/80 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-semibold text-[#0f172a]">{vol.fullName}</p>
                          {vol.idNumber && (
                            <span className="text-[10px] font-mono bg-[#f1f5f9] text-[#0f172a] px-1.5 py-0.2 rounded-xs border border-[#e2e8f0]" title="National ID">
                              ID: {vol.idNumber}
                            </span>
                          )}
                        </div>
                        {vol.notes && (
                          <p className="text-[10px] text-[#64748b] italic truncate max-w-xs">
                            {vol.notes}
                          </p>
                        )}
                        {vol.comment && (
                          <p className="text-[10px] text-[#0B4DB8] truncate max-w-xs">
                            💬 {vol.comment}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-[#0f172a]">
                        <a
                          href={`tel:${vol.phoneNumber}`}
                          className="hover:text-[#0B4DB8] hover:underline"
                        >
                          {vol.phoneNumber}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-[#64748b] whitespace-nowrap">
                        {vol.dateOfBirth
                          ? new Date(vol.dateOfBirth).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                          : <span className="text-[#94a3b8]">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] font-semibold bg-[#0B4DB8]/10 text-[#0B4DB8] px-2 py-0.5 rounded-sm whitespace-nowrap">
                          {vol.volunteerRole || "Mobilizer"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#0B4DB8] whitespace-nowrap">
                        {vol.constituency || <span className="text-[#94a3b8]">—</span>}
                      </td>
                      <td className="px-4 py-3 text-[#0f172a] font-medium whitespace-nowrap">{vol.ward}</td>
                      <td className="px-4 py-3 text-[#64748b]">
                        {vol.pollingStation}
                        {vol.isOtherStation && (
                          <span className="ml-1 text-[10px] text-[#0B4DB8] font-semibold">(Other)</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[#64748b]">
                        {vol.occupation || <span className="text-[#94a3b8]">—</span>}
                        {vol.educationLevel && (
                          <span className="block text-[10px] text-[#0B4DB8]">{vol.educationLevel}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleStatus(vol)}
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border cursor-pointer transition-all ${
                            vol.status === "verified"
                              ? "bg-[#0B4DB8]/10 text-[#0B4DB8] border-[#0B4DB8]/30 hover:bg-[#0B4DB8]/20"
                              : "bg-[#f8fafc] text-[#64748b] border-[#e2e8f0] hover:bg-[#e2e8f0]"
                          }`}
                          title="Click to toggle status"
                        >
                          {vol.status}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <a
                          href={`https://wa.me/${vol.phoneNumber.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#0B4DB8] hover:underline font-semibold"
                        >
                          WhatsApp
                        </a>
                        <button
                          onClick={() => setDeleteTarget(vol)}
                          className="text-[#64748b] hover:text-red-600 p-1 rounded cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Cards View: Current detailed cards view */
          <div className="space-y-3">
            {/* Mobile Cards (Shown on small screens) */}
            <div className="space-y-2.5 sm:hidden">
              {filteredVolunteers.map((vol) => (
                <div
                  key={vol._id}
                  className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2.5 transition-all"
                >
                  {/* Top Row: Name, ID, and Status Toggle */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-semibold text-slate-900 tracking-tight">
                          {vol.fullName}
                        </h4>
                        {vol.idNumber && (
                          <span className="text-[11px] font-mono text-slate-500">
                            ID {vol.idNumber}
                          </span>
                        )}
                      </div>

                      {/* Location & Role on one cohesive line */}
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                        <span className="font-medium text-[#0B4DB8]">
                          {vol.volunteerRole || "Mobilizer"}
                        </span>
                        <span className="text-slate-300">&bull;</span>
                        <span className="truncate">
                          {vol.constituency ? `${vol.constituency}, ` : ""}{vol.ward} &bull; {vol.pollingStation}
                        </span>
                      </p>
                    </div>

                    {/* Lean Status Toggle Pill */}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(vol)}
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer select-none shrink-0 ${
                        vol.status === "verified"
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                      }`}
                      title="Tap to toggle status"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          vol.status === "verified" ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      <span className="capitalize">{vol.status}</span>
                    </button>
                  </div>

                  {/* Comment or Note (Typographic quote with subtle left rule, zero colored boxes) */}
                  {(vol.comment || vol.notes) && (
                    <div className="border-l-2 border-slate-200 pl-2.5 py-0.5 text-xs text-slate-600 italic">
                      {vol.comment ? `“${vol.comment}”` : `“${vol.notes}”`}
                    </div>
                  )}

                  {/* Secondary Details: Clean inline text without noisy 'Kazi' headings */}
                  {(vol.occupation || vol.educationLevel || vol.dateOfBirth) && (
                    <p className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
                      {vol.dateOfBirth && (
                        <span title="Date of Birth">
                          {new Date(vol.dateOfBirth).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      )}
                      {vol.dateOfBirth && (vol.occupation || vol.educationLevel) && (
                        <span className="text-slate-300">&bull;</span>
                      )}
                      {vol.occupation && <span>{vol.occupation}</span>}
                      {vol.occupation && vol.educationLevel && (
                        <span className="text-slate-300">&bull;</span>
                      )}
                      {vol.educationLevel && <span>{vol.educationLevel}</span>}
                    </p>
                  )}

                  {/* Action Bar: Lean tactile actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${vol.phoneNumber}`}
                        className="px-2.5 py-1 rounded-md text-slate-700 hover:text-[#0B4DB8] hover:bg-slate-50 font-medium flex items-center gap-1.5 border border-slate-200 transition-colors"
                      >
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>Call</span>
                      </a>
                      <a
                        href={`https://wa.me/${vol.phoneNumber.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-md text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/50 font-medium flex items-center gap-1.5 border border-slate-200 transition-colors"
                      >
                        <span className="text-emerald-600 font-bold text-[10px]">WA</span>
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(vol)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                      title="Delete volunteer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (Shown on sm+ screens) */}
            <div className="hidden sm:block ios-card overflow-hidden border-[#e2e8f0]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#64748b] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-4 py-3">Volunteer</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">DOB</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Constituency</th>
                    <th className="px-4 py-3">Ward</th>
                    <th className="px-4 py-3">Landmark</th>
                    <th className="px-4 py-3">Kazi</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                  {filteredVolunteers.map((vol) => (
                    <tr key={vol._id} className="hover:bg-[#f8fafc]/80 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-semibold text-[#0f172a]">{vol.fullName}</p>
                          {vol.idNumber && (
                            <span className="text-[10px] font-mono bg-[#f1f5f9] text-[#0f172a] px-1.5 py-0.2 rounded-xs border border-[#e2e8f0]" title="National ID">
                              ID: {vol.idNumber}
                            </span>
                          )}
                        </div>
                        {vol.notes && (
                          <p className="text-[10px] text-[#64748b] italic truncate max-w-xs">
                            {vol.notes}
                          </p>
                        )}
                        {vol.comment && (
                          <p className="text-[10px] text-[#0B4DB8] truncate max-w-xs">
                            💬 {vol.comment}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-[#0f172a]">
                        <a
                          href={`tel:${vol.phoneNumber}`}
                          className="hover:text-[#0B4DB8] hover:underline"
                        >
                          {vol.phoneNumber}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-[#64748b] whitespace-nowrap">
                        {vol.dateOfBirth
                          ? new Date(vol.dateOfBirth).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                          : <span className="text-[#94a3b8]">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] font-semibold bg-[#0B4DB8]/10 text-[#0B4DB8] px-2 py-0.5 rounded-sm whitespace-nowrap">
                          {vol.volunteerRole || "Mobilizer"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#0B4DB8] whitespace-nowrap">
                        {vol.constituency || <span className="text-[#94a3b8]">—</span>}
                      </td>
                      <td className="px-4 py-3 text-[#0f172a] font-medium whitespace-nowrap">{vol.ward}</td>
                      <td className="px-4 py-3 text-[#64748b]">
                        {vol.pollingStation}
                        {vol.isOtherStation && (
                          <span className="ml-1 text-[10px] text-[#0B4DB8] font-semibold">(Other)</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[#64748b]">
                        {vol.occupation || <span className="text-[#94a3b8]">—</span>}
                        {vol.educationLevel && (
                          <span className="block text-[10px] text-[#0B4DB8]">{vol.educationLevel}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleStatus(vol)}
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border cursor-pointer transition-all ${
                            vol.status === "verified"
                              ? "bg-[#0B4DB8]/10 text-[#0B4DB8] border-[#0B4DB8]/30 hover:bg-[#0B4DB8]/20"
                              : "bg-[#f8fafc] text-[#64748b] border-[#e2e8f0] hover:bg-[#e2e8f0]"
                          }`}
                          title="Click to toggle status"
                        >
                          {vol.status}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <a
                          href={`https://wa.me/${vol.phoneNumber.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#0B4DB8] hover:underline font-semibold"
                        >
                          WhatsApp
                        </a>
                        <button
                          onClick={() => setDeleteTarget(vol)}
                          className="text-[#64748b] hover:text-red-600 p-1 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Discrete Admin Footer */}
        <div className="pt-6 pb-2 text-xs text-[#64748b] flex items-center justify-between border-t border-[#e2e8f0]/60">
          <Link href="/" className="hover:text-[#0f172a] transition-colors flex items-center gap-1 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volunteer Form</span>
          </Link>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer text-[11px] flex items-center gap-1.5"
            title="Log out and lock console"
          >
            <LogOut className="w-3 h-3" />
            <span>Logout / Lock Console</span>
          </button>
        </div>
      </main>

      {/* Confirmation Modal for Delete */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="ios-card max-w-xs w-full p-5 text-center animate-in zoom-in-95 border-[#e2e8f0]">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0f172a]">Remove Volunteer?</h3>
            <p className="text-xs text-[#64748b] mt-1 mb-5">
              Are you sure you want to remove{" "}
              <strong className="text-[#0f172a]">{deleteTarget.fullName}</strong> ({deleteTarget.pollingStation})?
            </p>

            <div className="space-y-2">
              <button
                onClick={handleConfirmDelete}
                disabled={actionLoading}
                className="w-full bg-red-600 text-white font-semibold py-2.5 rounded-xl active:scale-98 transition-all text-xs disabled:opacity-50"
              >
                {actionLoading ? "Removing..." : "Yes, Remove"}
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="ios-button-secondary w-full text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
