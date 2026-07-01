import React, { useEffect, useState } from "react";
import FlowEditor from "../components/FlowEditter/FlowEditor";
import LeftBar from "../components/LeftBar/LeftBar";
import { logActivity } from "../utils/logger";
import "../pages/Trial.css";

const flow_id = process.env.REACT_APP_FLOW_ID;
const business_id = process.env.REACT_APP_BUSINESS_ID;

export default function Trial() {
  const [activeTab, setActiveTab] = useState("details"); // "details" or "canvas"

  useEffect(() => {
    logActivity("TRIAL_PAGE_ACCESSED");
    document.title = "Trial Playground | Visual Chatbot Workspace | WhatsAppFlows";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Experiment with our no-code drag-and-drop workspace. Sketch question paths, link greeting nodes, and preview conversation routes instantly.");
    }
  }, []);

  return (
    <div className="trial-wrapper">
      {/* Mobile-only tab switcher */}
      <div className="trial-tabs">
        <button 
          className={`tab-btn ${activeTab === "details" ? "active" : ""}`}
          onClick={() => setActiveTab("details")}
        >
          ChatBot Details
        </button>
        <button 
          className={`tab-btn ${activeTab === "canvas" ? "active" : ""}`}
          onClick={() => setActiveTab("canvas")}
        >
          Sketch Flow Canvas
        </button>
      </div>

      <div className="home-container">
        <div className={`tab-panel ${activeTab === "details" ? "active-panel" : "hidden-panel"}`}>
          <LeftBar flow_id={flow_id} business_id={business_id} />
        </div>
        <div className={`tab-panel ${activeTab === "canvas" ? "active-panel" : "hidden-panel"}`}>
          <FlowEditor flow_id={flow_id} business_id={business_id} />
        </div>
      </div>
    </div>
  );
}
