import React, { useEffect } from "react";
import FlowEditor from "../components/FlowEditter/FlowEditor";
import LeftBar from "../components/LeftBar/LeftBar";
import { logActivity } from "../utils/logger";
import "../pages/Trial.css";

const flow_id = process.env.REACT_APP_FLOW_ID;
const business_id = process.env.REACT_APP_BUSINESS_ID;

export default function Trial() {
  useEffect(() => {
    logActivity("TRIAL_PAGE_ACCESSED");
    document.title = "Trial Playground | Visual Chatbot Workspace | WhatsAppFlows";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Experiment with our no-code drag-and-drop workspace. Sketch question paths, link greeting nodes, and preview conversation routes instantly.");
    }
  }, []);

  return (
    <div className="home-container">
      <LeftBar flow_id={flow_id} business_id={business_id} />
      <FlowEditor flow_id={flow_id} business_id={business_id} />
    </div>
  );
}
