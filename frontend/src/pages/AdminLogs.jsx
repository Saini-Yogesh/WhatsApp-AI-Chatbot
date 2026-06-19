import React, { useEffect, useState } from "react";
import "./AdminLogs.css";
import {
  Activity,
  CalendarDays,
  TrendingUp,
  RefreshCw,
  Lock,
} from "lucide-react";

const AdminLogs = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [logs, setLogs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchData = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const [logsRes, analyticsRes] = await Promise.all([
        fetch(`http://localhost:7000/api/logs?page=${pageNumber}&limit=20`),
        fetch(`http://localhost:7000/api/logs/analytics`),
      ]);

      const logsData = await logsRes.json();
      const analyticsData = await analyticsRes.json();

      if (logsData.success) {
        setLogs(logsData.logs);
        setTotalPages(logsData.totalPages);
        setPage(logsData.currentPage);
      }
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
    if (isAuthenticated) {
      fetchData(page);
    }
    // eslint-disable-next-line
  }, [page, isAuthenticated]);

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
          onClick={() => fetchData(page)}
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

      <div className="main-content-grid">
        <div className="logs-section">
          <h2>Recent Logs</h2>
          <div className="table-container">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Action</th>
                  <th>Path</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <tr key={log._id}>
                      <td className="time-cell">
                        {new Date(log.timestamp).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td>
                        <span className="badge">{log.action}</span>
                      </td>
                      <td className="path-cell">{log.path}</td>
                      <td className="details-cell">
                        <pre>{JSON.stringify(log.details, null, 2)}</pre>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      No logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Previous
            </button>
            <span>
              Page {page} of {totalPages || 1}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>

        <div className="top-operations-section">
          <h2>Top 10 Operations</h2>
          <div className="top-ops-list">
            <div className="op-header">
              <span className="op-rank">#</span>
              <span className="op-name">Operation</span>
              <span className="op-count-label">Today</span>
              <span className="op-count-label">Total</span>
            </div>
            {analytics?.topOperations?.map((op, index) => (
              <div key={op.action} className="op-item">
                <span className="op-rank">{index + 1}</span>
                <span className="op-name">{op.action}</span>
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
