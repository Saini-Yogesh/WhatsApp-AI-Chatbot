import React from "react";
import styles from "./AdminDashboard.module.css";
import { 
  Activity, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  Flame, 
  TrendingUp, 
  TrendingDown, 
  Minus 
} from "lucide-react";

const KPICard = ({ title, value, priorValue, showComparison = true, icon, iconType, loading }) => {
  if (loading) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={`${styles.skeleton}`} style={{ width: "100px", height: "16px" }} />
          <div className={`${styles.skeleton}`} style={{ width: "32px", height: "32px", borderRadius: "8px" }} />
        </div>
        <div className={styles.cardContent}>
          <div className={`${styles.skeleton}`} style={{ width: "60%", height: "32px", margin: "8px 0" }} />
          <div className={`${styles.skeleton}`} style={{ width: "40%", height: "14px" }} />
        </div>
      </div>
    );
  }

  // Calculate percentage change
  let change = 0;
  let status = "neutral";
  if (showComparison && priorValue !== undefined) {
    if (priorValue === 0) {
      change = value > 0 ? 100 : 0;
    } else {
      change = Math.round(((value - priorValue) / priorValue) * 100);
    }
    status = change > 0 ? "up" : change < 0 ? "down" : "neutral";
  }

  const renderTrend = () => {
    if (!showComparison || priorValue === undefined) return null;
    if (status === "up") {
      return (
        <span className={`${styles.cardFooter} ${styles.trendUp}`}>
          <TrendingUp size={14} /> +{change}% vs yesterday
        </span>
      );
    } else if (status === "down") {
      return (
        <span className={`${styles.cardFooter} ${styles.trendDown}`}>
          <TrendingDown size={14} /> {change}% vs yesterday
        </span>
      );
    } else {
      return (
        <span className={`${styles.cardFooter} ${styles.trendNeutral}`}>
          <Minus size={14} /> 0% vs yesterday
        </span>
      );
    }
  };

  const getIconClass = () => {
    switch (iconType) {
      case "green": return styles.greenIcon;
      case "purple": return styles.purpleIcon;
      case "red": return styles.redIcon;
      case "orange": return styles.orangeIcon;
      default: return styles.cardIcon;
    }
  };

  const isLongText = typeof value === "string" && value.length > 10;
  const valueStyle = isLongText 
    ? { 
        fontSize: value.length > 20 ? "0.95rem" : "1.2rem", 
        overflow: "hidden", 
        textOverflow: "ellipsis", 
        whiteSpace: "nowrap",
        lineHeight: "1.4"
      } 
    : {};

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3>{title}</h3>
        <div className={`${styles.cardIcon} ${getIconClass()}`}>{icon}</div>
      </div>
      <div className={styles.cardContent}>
        <h2 style={valueStyle} title={isLongText ? value : undefined}>
          {value !== undefined ? value.toLocaleString() : "0"}
        </h2>
        {renderTrend()}
      </div>
    </div>
  );
};

const DashboardOverview = ({ kpis, loading }) => {
  return (
    <div className={styles.kpiGrid}>
      <KPICard
        title="Events Today"
        value={kpis?.totalEventsToday?.value}
        priorValue={kpis?.totalEventsToday?.priorValue}
        icon={<Activity size={20} />}
        loading={loading}
      />
      <KPICard
        title="Events Yesterday"
        value={kpis?.totalEventsYesterday?.value}
        priorValue={kpis?.totalEventsYesterday?.priorValue}
        icon={<Calendar size={20} />}
        iconType="purple"
        loading={loading}
      />
      <KPICard
        title="Events This Week"
        value={kpis?.totalEventsThisWeek?.value}
        priorValue={kpis?.totalEventsThisWeek?.priorValue}
        icon={<Calendar size={20} />}
        iconType="purple"
        loading={loading}
      />
      <KPICard
        title="Events Last 24 Hours"
        value={kpis?.eventsLast24h?.value}
        showComparison={false}
        icon={<Clock size={20} />}
        loading={loading}
      />
      <KPICard
        title="Most Active Hour"
        value={kpis?.mostActiveHour}
        showComparison={false}
        icon={<Clock size={20} />}
        iconType="green"
        loading={loading}
      />
      <KPICard
        title="Most Triggered Event"
        value={kpis?.mostTriggeredEvent}
        showComparison={false}
        icon={<Flame size={20} />}
        iconType="orange"
        loading={loading}
      />
      <KPICard
        title="Errors Today"
        value={kpis?.errorsToday?.value}
        priorValue={kpis?.errorsToday?.priorValue}
        icon={<AlertTriangle size={20} />}
        iconType="red"
        loading={loading}
      />
      <KPICard
        title="Admin Actions Today"
        value={kpis?.adminActionsToday?.value}
        priorValue={kpis?.adminActionsToday?.priorValue}
        icon={<ShieldAlert size={20} />}
        iconType="orange"
        loading={loading}
      />
    </div>
  );
};

export default DashboardOverview;
