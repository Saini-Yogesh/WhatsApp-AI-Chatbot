import React from "react";
import FlowEditor from "../components/FlowEditter/FlowEditor";
import LeftBar from "../components/LeftBar/LeftBar";
import "../pages/Home.css";

const flow_id = process.env.REACT_APP_FLOW_ID;
const business_id = process.env.REACT_APP_BUSINESS_ID;

export default function Home() {
  return (
    <div className="home-container">
      <LeftBar flow_id={flow_id} business_id={business_id} />
      <FlowEditor flow_id={flow_id} business_id={business_id} />
    </div>
  );
}
