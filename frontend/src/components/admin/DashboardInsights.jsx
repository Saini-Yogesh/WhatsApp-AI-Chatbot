import React from "react";
import styles from "./AdminDashboard.module.css";
import { Info, AlertTriangle, TrendingUp, Cpu } from "lucide-react";

const DashboardInsights = ({ kpis = {}, topRoutes = [], errorCenter = {}, loading }) => {
  if (loading) {
    return (
      <div className={styles.card}>
        <div className={styles.skeleton} style={{ width: "150px", height: "20px", marginBottom: "1.5rem" }} />
        <div className={styles.skeleton} style={{ height: "45px", marginBottom: "1rem" }} />
        <div className={styles.skeleton} style={{ height: "45px" }} />
      </div>
    );
  }

  const insights = [];

  // 1. Peak Route Visited Insight
  if (topRoutes.length > 0) {
    insights.push({
      id: "route",
      title: "Most Visited Path",
      text: `The route path "${topRoutes[0].route || "/"}" is currently your most active page, recording ${topRoutes[0].visits.toLocaleString()} entry logs.`,
      icon: <Cpu size={18} />,
      iconClass: styles.cardIcon
    });
  }

  // 2. Error rate warning
  const rate = errorCenter.rate || 0;
  if (rate > 5) {
    insights.push({
      id: "error",
      title: "Elevated Error Rate Detected",
      text: `An anomaly warning: system error rate is at ${rate}%. This exceeds the recommended 5% threshold. Please check the logs explorer.`,
      icon: <AlertTriangle size={18} />,
      iconClass: styles.redIcon
    });
  } else {
    insights.push({
      id: "health",
      title: "System Performance Optimal",
      text: `Platform logs show an error rate of ${rate}%, confirming chatbot configurations and saving routes are performing within normal parameters.`,
      icon: <Info size={18} />,
      iconClass: styles.greenIcon
    });
  }

  // 3. Peak Hour Traffic Insight
  const activeHour = kpis.mostActiveHour;
  if (activeHour && activeHour !== "N/A") {
    insights.push({
      id: "hour",
      title: "Peak Usage Hour Captured",
      text: `Activity peaked at ${activeHour} today. Scheduling maintenance and system updates outside this window is recommended.`,
      icon: <TrendingUp size={18} />,
      iconClass: styles.purpleIcon
    });
  }

  // 4. Admin updates insight
  const adminToday = kpis.adminActionsToday?.value || 0;
  if (adminToday > 0) {
    insights.push({
      id: "admin",
      title: "Recent Administrative Auditing",
      text: `${adminToday} admin actions occurred today. Ensure these changes to logs or flows were authorized operations.`,
      icon: <Info size={18} />,
      iconClass: styles.orangeIcon
    });
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3>Dashboard Insights</h3>
      </div>
      
      <p style={{ fontSize: "0.8125rem", color: "#64748b", margin: "-0.5rem 0 1.5rem 0" }}>
        Automatically generated operation suggestions and indicators based on live event analytics.
      </p>

      <div className={styles.insightsList}>
        {insights.map((ins) => (
          <div key={ins.id} className={styles.insightCard}>
            <div className={`${styles.cardIcon} ${ins.iconClass}`} style={{ marginTop: "0.25rem" }}>
              {ins.icon}
            </div>
            <div className={styles.insightText}>
              <h4 style={{ color: "#ffffff" }}>{ins.title}</h4>
              <p>{ins.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardInsights;
