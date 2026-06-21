import React, { useEffect, useState } from "react";
import styles from "../components/admin/AdminDashboard.module.css";
import { Lock, RefreshCw, Moon, Sun } from "lucide-react";
import { logActivity } from "../utils/logger";
import { toast } from "react-hot-toast";

// Import custom dashboard sub-components
import DashboardOverview from "../components/admin/DashboardOverview";
import EventCharts, { TopEventsBarChart } from "../components/admin/EventCharts";
import TrafficAnalytics from "../components/admin/TrafficAnalytics";
import OperationsAnalytics from "../components/admin/OperationsAnalytics";
import ErrorMonitor from "../components/admin/ErrorMonitor";
import DashboardInsights from "../components/admin/DashboardInsights";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:7000";

const AdminLogs = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [range, setRange] = useState("7d");
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchData = async (isManual = false) => {
    setLoading(true);
    try {
      const analyticsRes = await fetch(`${BASE_URL}/api/logs/analytics?range=${range}`);
      const analyticsData = await analyticsRes.json();

      if (analyticsData.success) {
        setAnalytics(analyticsData);
        if (isManual === true) {
          toast.success("Dashboard data refreshed successfully!");
        }
      } else {
        if (isManual === true) {
          toast.error(analyticsData.error || "Failed to refresh dashboard data.");
        }
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      if (isManual === true) {
        toast.error("Failed to refresh dashboard data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/logs/verify-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        toast.success("Welcome back, Admin!");
      } else {
        localStorage.setItem("toast_error_message", data.error || "Access Denied: Incorrect Password!");
        window.location.replace("/");
      }
    } catch (err) {
      localStorage.setItem("toast_error_message", err.message || "Failed to verify admin password.");
      window.location.replace("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    logActivity("ADMIN_LOGS_ACCESSED");
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
    // eslint-disable-next-line
  }, [isAuthenticated, range]);

  if (!isAuthenticated) {
    return (
      <div className={styles.dashboardContainer} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          background: "rgba(30, 41, 59, 0.7)",
          backdropFilter: "blur(10px)",
          border: "1px solid #334155",
          borderRadius: "12px",
          padding: "3rem",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        }}>
          <div style={{
            backgroundColor: "rgba(45, 212, 191, 0.1)",
            color: "#2dd4bf",
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem auto"
          }}>
            <Lock size={32} />
          </div>
          <h2 style={{ color: "#fff", margin: "0 0 0.5rem 0", fontSize: "1.5rem" }}>Admin Access</h2>
          <p style={{ color: "#94a3b8", margin: "0 0 2rem 0", fontSize: "0.875rem" }}>Please enter the password to view logs.</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              autoFocus
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "1rem",
                boxSizing: "border-box",
                marginBottom: "1rem",
                outline: "none"
              }}
            />
            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: "#2dd4bf",
                color: "#0f172a",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              {loading ? "Verifying..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.dashboardContainer} ${!darkMode ? styles.lightMode : ""}`}>
      {/* Header controls */}
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <h1>Activity Dashboard</h1>
          <p>Monitor your chatbot's performance, operations, and anomalies</p>
        </div>
        <div className={styles.controls}>
          {/* Time range selection */}
          <select 
            className={styles.selectRange} 
            value={range} 
            onChange={(e) => setRange(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>

          {/* Theme toggler */}
          <button className={styles.themeBtn} onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Manual refresh button */}
          <button
            className={styles.actionBtn}
            onClick={() => fetchData(true)}
            disabled={loading}
          >
            <RefreshCw className={loading ? styles.spin : ""} size={16} /> Refresh
          </button>
        </div>
      </header>

      <div className={styles.dashboardGrid}>
        {/* Row 1: KPI Overview Cards */}
        <DashboardOverview kpis={analytics?.kpis} loading={loading} />

        {/* Two-Column Masonry Dashboard Grid */}
        <div className={styles.chartsGrid}>
          {/* Left Column (2fr) - Event Charts, Traffic Heatmap, and Operations Stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <EventCharts 
              overTime={analytics?.overTime} 
              distribution={analytics?.distribution} 
              loading={loading} 
            />
            <TrafficAnalytics 
              topRoutes={analytics?.topRoutes} 
              heatmap={analytics?.heatmap} 
              loading={loading} 
            />
            <OperationsAnalytics operations={analytics?.operations} loading={loading} />
          </div>

          {/* Right Column (1fr) - Live Insights and System Errors */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <DashboardInsights 
              kpis={analytics?.kpis} 
              topRoutes={analytics?.topRoutes} 
              errorCenter={analytics?.errorCenter}
              loading={loading} 
            />
            <ErrorMonitor errorCenter={analytics?.errorCenter} loading={loading} />
          </div>
        </div>

        {/* Full-Width Bottom Section: Top Events */}
        <div style={{ width: "100%", marginTop: "1.5rem" }}>
          <TopEventsBarChart topEvents={analytics?.topEvents} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default AdminLogs;
