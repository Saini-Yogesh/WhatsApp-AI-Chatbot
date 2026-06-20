import React, { useEffect } from "react";
import FlowEditor from "../components/FlowEditter/FlowEditor";
import LeftBar from "../components/LeftBar/LeftBar";
import { logActivity } from "../utils/logger";
import "../pages/Home.css";

const flow_id = process.env.REACT_APP_FLOW_ID;
const business_id = process.env.REACT_APP_BUSINESS_ID;

export default function Home() {
  useEffect(() => {
    logActivity("HOME_PAGE_ACCESSED");
  }, []);

  return (
    <div className="home-container">
      <LeftBar flow_id={flow_id} business_id={business_id} />
      <FlowEditor flow_id={flow_id} business_id={business_id} />
    </div>
  );
}
