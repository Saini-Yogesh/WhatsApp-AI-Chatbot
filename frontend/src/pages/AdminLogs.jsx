import React, { useEffect, useState } from "react";
import "./AdminLogs.css";
import {
  Activity,
  CalendarDays,
  TrendingUp,
  RefreshCw,
  Lock,
} from "lucide-react";
import { logActivity } from "../utils/logger";

const AdminLogs = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const analyticsRes = await fetch(`http://localhost:7000/api/logs/analytics`);
      const analyticsData = await analyticsRes.json();

      if (analyticsData.success) {
        setAnalytics(analyticsData);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError("");
    try {
      const res = await fetch("http://localhost:7000/api/logs/verify-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
      } else {
        // Redirect to home and replace history if password is wrong
        window.location.replace("/");
      }
    } catch (err) {
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
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-icon">
            <Lock size={32} />
          </div>
          <h2>Admin Access</h2>
          <p>Please enter the password to view logs.</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {loginError && <p className="login-error">{loginError}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Activity Dashboard</h1>
          <p>Monitor your chatbot's performance and user interactions</p>
        </div>
        <button
          className="refresh-btn"
          onClick={() => fetchData()}
          disabled={loading}
        >
          <RefreshCw className={loading ? "spin" : ""} size={18} /> Refresh Data
        </button>
      </div>

      {analytics && (
        <div className="analytics-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <Activity size={24} />
            </div>
            <div className="stat-info">
              <h3>Today's Activity</h3>
              <h2>{analytics.todayCount}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <CalendarDays size={24} />
            </div>
            <div className="stat-info">
              <h3>Yesterday's Activity</h3>
              <h2>{analytics.yesterdayCount}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <h3>Top Operation</h3>
              <h2>{analytics.topOperations?.[0]?.action || "N/A"}</h2>
            </div>
          </div>
        </div>
      )}

      <div className="main-content-grid" style={{ display: 'block' }}>

        <div className="top-operations-section">
          <h2>All Operations</h2>
          <div className="top-ops-list">
            <div className="op-header" style={{ gridTemplateColumns: '50px 2fr 1fr 100px 100px' }}>
              <span className="op-rank">#</span>
              <span className="op-name">Operation</span>
              <span className="op-name">Path</span>
              <span className="op-count-label">Today</span>
              <span className="op-count-label">Total</span>
            </div>
            {analytics?.topOperations?.map((op, index) => (
              <div key={`${op.action}-${op.path}`} className="op-item" style={{ gridTemplateColumns: '50px 2fr 1fr 100px 100px' }}>
                <span className="op-rank">{index + 1}</span>
                <span className="op-name">{op.action}</span>
                <span className="op-name">{op.path}</span>
                <span className="op-count today">{op.todayCount}</span>
                <span className="op-count total">{op.totalCount}</span>
              </div>
            ))}
            {!analytics?.topOperations?.length && (
              <p className="empty-state">No operations yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogs;
