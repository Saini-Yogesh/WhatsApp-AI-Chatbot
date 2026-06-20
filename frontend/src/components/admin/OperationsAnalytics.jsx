import React from "react";
import styles from "./AdminDashboard.module.css";
import { 
  GitCommit, 
  Trash2, 
  Edit3, 
  Workflow, 
  Save, 
  XOctagon, 
  Briefcase 
} from "lucide-react";

const OpStatBox = ({ title, value, icon, colorClass }) => {
  return (
    <div style={{
      background: "rgba(30, 41, 59, 0.4)",
      border: "1px solid rgba(255, 255, 255, 0.05)",
      padding: "1rem",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      gap: "1rem"
    }}>
      <div className={`${styles.cardIcon} ${colorClass}`}>{icon}</div>
      <div>
        <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>{title}</div>
        <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#fff", marginTop: "0.25rem" }}>{value.toLocaleString()}</div>
      </div>
    </div>
  );
};

const OperationsAnalytics = ({ operations = {}, loading }) => {
  if (loading) {
    return (
      <div className={styles.card}>
        <div className={styles.skeleton} style={{ width: "200px", height: "20px", marginBottom: "1.5rem" }} />
        <div className={styles.kpiGrid}>
          <div className={styles.skeleton} style={{ height: "70px" }} />
          <div className={styles.skeleton} style={{ height: "70px" }} />
          <div className={styles.skeleton} style={{ height: "70px" }} />
        </div>
      </div>
    );
  }

  // Calculate flow success rate
  const totalFlowAttempts = (operations.flowsSaved || 0) + (operations.flowErrors || 0);
  const flowSuccessRate = totalFlowAttempts > 0 
    ? ((operations.flowsSaved / totalFlowAttempts) * 100).toFixed(1) 
    : "100.0";

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3>Flow Builder Operations</h3>
        <span style={{ 
          fontSize: "0.75rem", 
          background: "rgba(45, 212, 191, 0.1)", 
          color: "#2dd4bf", 
          padding: "0.25rem 0.75rem", 
          borderRadius: "9999px",
          fontWeight: 700
        }}>
          Save Success Rate: {flowSuccessRate}%
        </span>
      </div>
      
      <p style={{ fontSize: "0.8125rem", color: "#64748b", margin: "-0.5rem 0 1.5rem 0" }}>
        Real-time metrics indicating admin interactions with the Flow Builder workspace canvas and chatbot business configurations.
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem"
      }}>
        <OpStatBox
          title="Nodes Created"
          value={operations.nodesAdded || 0}
          icon={<GitCommit size={18} />}
          colorClass={styles.cardIcon}
        />
        <OpStatBox
          title="Nodes Deleted"
          value={operations.nodesDeleted || 0}
          icon={<Trash2 size={18} />}
          colorClass={styles.redIcon}
        />
        <OpStatBox
          title="Nodes Updated"
          value={operations.nodesUpdated || 0}
          icon={<Edit3 size={18} />}
          colorClass={styles.orangeIcon}
        />
        <OpStatBox
          title="Connections Drawn"
          value={operations.nodesConnected || 0}
          icon={<Workflow size={18} />}
          colorClass={styles.purpleIcon}
        />
        <OpStatBox
          title="Flows Saved"
          value={operations.flowsSaved || 0}
          icon={<Save size={18} />}
          colorClass={styles.greenIcon}
        />
        <OpStatBox
          title="Save Failures"
          value={operations.flowErrors || 0}
          icon={<XOctagon size={18} />}
          colorClass={styles.redIcon}
        />
        <OpStatBox
          title="Business Details Updated"
          value={operations.detailsUpdated || 0}
          icon={<Briefcase size={18} />}
          colorClass={styles.purpleIcon}
        />
      </div>
    </div>
  );
};

export default OperationsAnalytics;
