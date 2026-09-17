"use client";

import React, { useEffect, useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  UserX,
  Globe,
  RefreshCw,
  Trash2,
  Download,
  AlertTriangle,
  Lock,
  Server,
  Clock,
  Laptop,
} from "lucide-react";

interface AuditLogEntry {
  id: string;
  actorId: string | null;
  action: string;
  targetType: string;
  targetId: string | null;
  metadata: string | null;
  createdAt: string;
}

interface SecurityStats {
  totalLogins: number;
  failedAttempts: number;
  blockedAttempts: number;
  uniqueIps: number;
}

export default function SecurityPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [stats, setStats] = useState<SecurityStats>({
    totalLogins: 0,
    failedAttempts: 0,
    blockedAttempts: 0,
    uniqueIps: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [filterAction, setFilterAction] = useState<string>("ALL");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/logs");
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
        setStats(
          data.stats || {
            totalLogins: 0,
            failedAttempts: 0,
            blockedAttempts: 0,
            uniqueIps: 0,
          }
        );
      }
    } catch (err) {
      console.error("Failed to load audit logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleClearLogs = async () => {
    if (!window.confirm("Are you sure you want to clear all security and authentication logs?")) {
      return;
    }
    setIsClearing(true);
    try {
      const res = await fetch("/api/v1/auth/logs", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchLogs();
      }
    } catch (err) {
      console.error("Failed to clear logs", err);
    } finally {
      setIsClearing(false);
    }
  };

  const handleExportCSV = () => {
    if (!logs.length) return;

    const headers = ["ID", "Timestamp", "Action", "Actor/Email", "Client IP", "Details"];
    const rows = logs.map((log) => {
      let details = "";
      try {
        const meta = log.metadata ? JSON.parse(log.metadata) : {};
        details = meta.reason || meta.userAgent || "";
      } catch {
        details = log.metadata || "";
      }
      return [
        `"${log.id}"`,
        `"${new Date(log.createdAt).toLocaleString()}"`,
        `"${log.action}"`,
        `"${log.actorId || "N/A"}"`,
        `"${log.targetId || "N/A"}"`,
        `"${details.replace(/"/g, '""')}"`,
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hitfact_security_audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLogs = logs.filter((log) => {
    if (filterAction === "ALL") return true;
    return log.action === filterAction;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-zinc-700/50 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            Active Hacker & Brute-Force Shield Enabled
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-headline tracking-tight">
            Security & Access Logs
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl">
            Real-time tracking of staff logins, IP addresses, failed brute-force attacks, and automatic 15-minute rate-limit lockouts.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg border border-zinc-600 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={handleExportCSV}
            disabled={!logs.length}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-red hover:bg-brand-redDark text-white text-xs font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Successful Logins */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Total Logins</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-headline">
              {stats.totalLogins}
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Authorized</span>
          </div>
        </div>

        {/* Failed Login Attempts */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Failed Attempts</span>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-headline">
              {stats.failedAttempts}
            </span>
            <span className="text-xs font-medium text-red-600 dark:text-red-400">Rejected</span>
          </div>
        </div>

        {/* Blocked Brute-Force Attacks */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Shield Lockouts</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-headline">
              {stats.blockedAttempts}
            </span>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">IPs Locked</span>
          </div>
        </div>

        {/* Unique IP Addresses */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Unique IPs</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-headline">
              {stats.uniqueIps}
            </span>
            <span className="text-xs font-medium text-sky-600 dark:text-sky-400">Tracked</span>
          </div>
        </div>
      </div>

      {/* Security Protection Rules Summary */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-500" />
          Active Security Safeguards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-600 dark:text-zinc-400">
          <div className="p-3 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-1">
            <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-brand-red" />
              Zero Client-Side Exposure
            </div>
            <p>Admin credentials are encrypted and verified exclusively on the server. No passwords or secret keys exist in browser code.</p>
          </div>
          <div className="p-3 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-1">
            <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              15-Min Brute-Force Rate Limiter
            </div>
            <p>If any IP attempts 5 invalid passwords within 15 minutes, requests are immediately rejected with HTTP 429 Lockout.</p>
          </div>
          <div className="p-3 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-1">
            <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" />
              Audit Log Traceability
            </div>
            <p>Every login attempt, device fingerprint, and IP is permanently logged into SQLite/PostgreSQL audit logs.</p>
          </div>
        </div>
      </div>

      {/* Logs Table Section */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs overflow-hidden">
        {/* Table Filter Toolbar */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Filter:</span>
            <div className="inline-flex rounded-lg border border-zinc-200 dark:border-zinc-800 p-0.5 bg-zinc-50 dark:bg-zinc-950 text-xs">
              <button
                onClick={() => setFilterAction("ALL")}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  filterAction === "ALL"
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                All ({logs.length})
              </button>
              <button
                onClick={() => setFilterAction("LOGIN_SUCCESS")}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  filterAction === "LOGIN_SUCCESS"
                    ? "bg-emerald-500 text-white shadow-xs"
                    : "text-zinc-500 hover:text-emerald-500"
                }`}
              >
                Success ({stats.totalLogins})
              </button>
              <button
                onClick={() => setFilterAction("LOGIN_FAILED")}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  filterAction === "LOGIN_FAILED"
                    ? "bg-red-500 text-white shadow-xs"
                    : "text-zinc-500 hover:text-red-500"
                }`}
              >
                Failed ({stats.failedAttempts})
              </button>
              <button
                onClick={() => setFilterAction("LOGIN_BLOCKED")}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  filterAction === "LOGIN_BLOCKED"
                    ? "bg-amber-500 text-white shadow-xs"
                    : "text-zinc-500 hover:text-amber-500"
                }`}
              >
                Blocked ({stats.blockedAttempts})
              </button>
            </div>
          </div>

          {logs.length > 0 && (
            <button
              onClick={handleClearLogs}
              disabled={isClearing}
              className="inline-flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 hover:underline disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isClearing ? "Clearing..." : "Clear Security Logs"}
            </button>
          )}
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Event Status</th>
                <th className="py-3 px-4">Staff Account</th>
                <th className="py-3 px-4">Client IP</th>
                <th className="py-3 px-4">Device & Browser</th>
                <th className="py-3 px-4">Details / Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-brand-red" />
                    Loading security audit logs...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-50" />
                    No security events matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  let meta: any = {};
                  try {
                    meta = log.metadata ? JSON.parse(log.metadata) : {};
                  } catch {
                    meta = {};
                  }

                  const isSuccess = log.action === "LOGIN_SUCCESS";
                  const isBlocked = log.action === "LOGIN_BLOCKED";
                  const isFailed = log.action === "LOGIN_FAILED";

                  return (
                    <tr key={log.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isSuccess && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            <ShieldCheck className="w-3 h-3" />
                            SUCCESS
                          </span>
                        )}
                        {isFailed && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                            <UserX className="w-3 h-3" />
                            FAILED
                          </span>
                        )}
                        {isBlocked && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                            <AlertTriangle className="w-3 h-3" />
                            BLOCKED (429)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-zinc-900 dark:text-white">
                        {log.actorId || "Unknown"}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
                        {log.targetId || "127.0.0.1"}
                      </td>
                      <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400 max-w-xs truncate" title={meta.userAgent || "Unknown Device"}>
                        <div className="flex items-center gap-1.5">
                          <Laptop className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                          <span className="truncate">{meta.userAgent || "Unknown Device"}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-zinc-500 dark:text-zinc-400 max-w-xs truncate">
                        {meta.reason || (isSuccess ? "Authenticated via Server Shield" : "—")}
                        {meta.failureCount && ` (${meta.failureCount} recent failed attempts)`}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
