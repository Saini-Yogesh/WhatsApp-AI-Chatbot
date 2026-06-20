import React from "react";
import styles from "./AdminDashboard.module.css";

const TrafficAnalytics = ({ topRoutes = [], heatmap = [], loading }) => {
  if (loading) {
    return (
      <div className={styles.doubleGrid}>
        <div className={styles.card} style={{ height: "320px" }}>
          <div className={styles.skeleton} style={{ width: "150px", height: "20px", marginBottom: "2rem" }} />
          <div className={styles.skeleton} style={{ width: "100%", height: "200px" }} />
        </div>
        <div className={styles.card} style={{ height: "320px" }}>
          <div className={styles.skeleton} style={{ width: "150px", height: "20px", marginBottom: "2rem" }} />
          <div className={styles.skeleton} style={{ width: "100%", height: "200px" }} />
        </div>
      </div>
    );
  }

  // Calculate heatmap color thresholds
  const counts = heatmap.map(h => h.count);
  const maxCount = counts.length > 0 ? Math.max(...counts) : 0;
  const step = maxCount > 0 ? maxCount / 5 : 1;

  const getCellColorClass = (count) => {
    if (count === 0) return styles.color0;
    const level = Math.min(5, Math.ceil(count / step));
    return styles[`color${level}`];
  };

  // Group heatmap by days for rendering rows
  // Days order: Mon, Tue, Wed, Thu, Fri, Sat, Sun
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className={styles.doubleGrid}>
      {/* Route Traffic Table */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Most Visited Routes</h3>
        </div>
        <div style={{ marginTop: "1rem" }}>
          {topRoutes.length > 0 ? (
            <div className={styles.tableWrapper}>
              <table className={styles.explorerTable}>
                <thead>
                  <tr>
                    <th>Route Path</th>
                    <th style={{ textAlign: "right" }}>Visits</th>
                  </tr>
                </thead>
                <tbody>
                  {topRoutes.map((route, idx) => (
                    <tr key={idx}>
                      <td style={{ fontFamily: "monospace", color: "#38bdf8", fontWeight: 600 }}>{route.route || "/"}</td>
                      <td style={{ textAlign: "right", fontWeight: 700 }}>{route.visits.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={styles.emptyState}>No route visits logged.</p>
          )}
        </div>
      </div>

      {/* GitHub-style Heatmap */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Hourly Activity Heatmap</h3>
        </div>
        <p style={{ fontSize: "0.75rem", color: "#64748b", margin: "0 0 1rem 0" }}>
          Visualizes interaction intensity grouped by hour of the day (horizontal) and day of the week (vertical).
        </p>
        
        {heatmap.length > 0 ? (
          <div>
            <div className={styles.heatmapWrapper}>
              {days.map((day) => {
                const dayCells = heatmap.filter(h => h.day === day);
                // Sort by hour to ensure chronological columns
                dayCells.sort((a, b) => a.hour - b.hour);

                return (
                  <div key={day} className={styles.heatmapRow}>
                    <div className={styles.heatmapLabel}>{day}</div>
                    <div className={styles.heatmapCells}>
                      {dayCells.map((cell, idx) => (
                        <div
                          key={idx}
                          className={`${styles.heatmapCell} ${getCellColorClass(cell.count)}`}
                          title={`${day} ${cell.hour}:00 - ${cell.count} events`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Heatmap Legend */}
            <div className={styles.heatmapLegend}>
              <span>Less</span>
              <div className={`${styles.legendBox} ${styles.color0}`} />
              <div className={`${styles.legendBox} ${styles.color1}`} />
              <div className={`${styles.legendBox} ${styles.color2}`} />
              <div className={`${styles.legendBox} ${styles.color3}`} />
              <div className={`${styles.legendBox} ${styles.color4}`} />
              <div className={`${styles.legendBox} ${styles.color5}`} />
              <span>More</span>
            </div>
          </div>
        ) : (
          <p className={styles.emptyState}>No activity heatmap logs.</p>
        )}
      </div>
    </div>
  );
};

export default TrafficAnalytics;
