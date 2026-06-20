import React, { useState, useEffect } from "react";
import styles from "./AdminDashboard.module.css";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from "recharts";

const COLORS = ["#38bdf8", "#2dd4bf", "#a855f7", "#ef4444", "#f59e0b"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#0f172a",
        border: "1px solid #334155",
        padding: "0.75rem",
        borderRadius: "8px",
        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.5)"
      }}>
        <p style={{ margin: 0, fontWeight: 700, color: "#fff", fontSize: "0.875rem" }}>{label}</p>
        {payload.map((pld, idx) => (
          <p key={idx} style={{ margin: "0.25rem 0 0 0", color: pld.color || pld.fill, fontSize: "0.75rem", fontWeight: 600 }}>
            {pld.name}: {pld.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const EventCharts = ({ overTime = [], distribution = [], topEvents = [], loading }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading || !mounted) {
    return (
      <div className={styles.chartsGrid}>
        <div className={styles.card} style={{ height: "360px" }}>
          <div className={styles.skeleton} style={{ width: "150px", height: "20px", marginBottom: "2rem" }} />
          <div className={styles.skeleton} style={{ width: "100%", height: "240px" }} />
        </div>
        <div className={styles.card} style={{ height: "360px" }}>
          <div className={styles.skeleton} style={{ width: "150px", height: "20px", marginBottom: "2rem" }} />
          <div className={styles.skeleton} style={{ width: "100%", height: "240px" }} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chartsGrid}>
        {/* Events Over Time Area Chart */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Events Over Time</h3>
          </div>
          <div style={{ width: "100%", height: 300, marginTop: "1rem" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="label" 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  name="Total Events" 
                  stroke="#38bdf8" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="unique" 
                  name="Unique Types" 
                  stroke="#2dd4bf" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorUnique)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Event Category Distribution Pie/Donut Chart */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Event Distribution</h3>
          </div>
          <div style={{ width: "100%", height: 300, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            {distribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconSize={10} 
                    iconType="circle"
                    formatter={(value) => <span style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: 600 }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className={styles.emptyState}>No data distributed yet.</p>
            )}
          </div>
        </div>
      </div>

  );
};

export const TopEventsBarChart = ({ topEvents = [], loading }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading || !mounted) {
    return (
      <div className={styles.card} style={{ height: "340px" }}>
        <div className={styles.skeleton} style={{ width: "150px", height: "20px", marginBottom: "2rem" }} />
        <div className={styles.skeleton} style={{ width: "100%", height: "240px" }} />
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3>Top Events (Frequency)</h3>
      </div>
      <div style={{ width: "100%", height: 300, marginTop: "1rem" }}>
        {topEvents.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topEvents} layout="vertical" margin={{ top: 0, right: 10, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis 
                type="number" 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                type="category" 
                dataKey="action" 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                width={150}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Triggers" radius={[0, 4, 4, 0]}>
                {topEvents.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className={styles.emptyState}>No events triggered.</p>
        )}
      </div>
    </div>
  );
};

export default EventCharts;
