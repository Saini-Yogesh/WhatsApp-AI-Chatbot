import React, { useState, useEffect } from "react";
import styles from "./AdminDashboard.module.css";
import { AlertCircle, ShieldAlert, CheckCircle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const ErrorMonitor = ({ errorCenter = {}, loading }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading) {
    return (
      <div className={styles.card}>
        <div className={styles.skeleton} style={{ width: "200px", height: "20px", marginBottom: "1.5rem" }} />
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <div className={styles.skeleton} style={{ flex: 1, height: "80px" }} />
          <div className={styles.skeleton} style={{ flex: 1, height: "80px" }} />
        </div>
      </div>
    );
  }

  const { totalToday = 0, totalWeek = 0, rate = 0, types = [] } = errorCenter;

  const getStatusAlert = () => {
    if (rate > 10) {
      return (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          color: "#f87171",
          padding: "1rem",
          borderRadius: "12px",
          marginBottom: "1.5rem"
        }}>
          <ShieldAlert size={24} />
          <div>
            <h4 style={{ margin: 0, fontWeight: 700, fontSize: "0.875rem" }}>CRITICAL ERROR LEVEL</h4>
            <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", color: "#fca5a5" }}>
              The system error rate is currently at {rate}%. Check the log explorer for flow saving/loading issues or database API connection spikes.
            </p>
          </div>
        </div>
      );
    } else if (rate > 0) {
      return (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          background: "rgba(245, 158, 11, 0.1)",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          color: "#fbbf24",
          padding: "1rem",
          borderRadius: "12px",
          marginBottom: "1.5rem"
        }}>
          <AlertCircle size={24} />
          <div>
            <h4 style={{ margin: 0, fontWeight: 700, fontSize: "0.875rem" }}>WARNING: ERROR SPIKES LOGGED</h4>
            <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", color: "#fde047" }}>
              Minor issues detected. The error rate is {rate}%. Mostly related to saving flows or fetching configurations.
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          background: "rgba(16, 185, 129, 0.1)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          color: "#34d399",
          padding: "1rem",
          borderRadius: "12px",
          marginBottom: "1.5rem"
        }}>
          <CheckCircle size={24} />
          <div>
            <h4 style={{ margin: 0, fontWeight: 700, fontSize: "0.875rem" }}>ALL SYSTEMS OPERATIONAL</h4>
            <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", color: "#a7f3d0" }}>
              The system error rate is at 0%. Chatbot node creation and flow editor saving operations are operating smoothly.
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3>System Error Monitoring</h3>
        <span style={{
          fontSize: "0.75rem",
          color: rate > 10 ? "#ef4444" : rate > 0 ? "#f59e0b" : "#10b981",
          fontWeight: 700
        }}>
          Global Error Rate: {rate}%
        </span>
      </div>

      <p style={{ fontSize: "0.8125rem", color: "#64748b", margin: "-0.5rem 0 1.5rem 0" }}>
        Live system tracking filtering for runtime anomalies and API endpoint database errors.
      </p>

      {getStatusAlert()}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Error KPIs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{
            background: "rgba(30, 41, 59, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.03)",
            padding: "1rem",
            borderRadius: "12px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>ERRORS TODAY</div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: totalToday > 0 ? "#f43f5e" : "#e2e8f0", marginTop: "0.25rem" }}>
              {totalToday}
            </div>
          </div>

          <div style={{
            background: "rgba(30, 41, 59, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.03)",
            padding: "1rem",
            borderRadius: "12px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>TOTAL ERRORS IN RANGE</div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: totalWeek > 0 ? "#f43f5e" : "#e2e8f0", marginTop: "0.25rem" }}>
              {totalWeek}
            </div>
          </div>
        </div>

        {/* Error Types Chart */}
        <div>
          <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.8125rem", color: "#94a3b8" }}>Errors by Action Type</h4>
          {mounted && types.length > 0 ? (
            <div style={{ width: "100%", height: 130 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={types} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis 
                    type="category" 
                    dataKey="type" 
                    stroke="#64748b" 
                    fontSize={9} 
                    tickLine={false} 
                    axisLine={false}
                    width={110}
                  />
                  <Tooltip cursor={false} />
                  <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : types.length > 0 ? (
            <div className={styles.skeleton} style={{ width: "100%", height: 130 }} />
          ) : (
            <div style={{
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px dashed rgba(255,255,255,0.05)",
              borderRadius: "12px",
              color: "#64748b",
              fontSize: "0.75rem"
            }}>
              No errors logged in this range.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMonitor;
