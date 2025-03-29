import React from "react";
import FlowEditor from "../components/FlowEditter/FlowEditor";
import LeftBar from "../components/LeftBar/LeftBar";
import "../pages/Home.css";

const FLOW_ID = "67e82de939b64bf75627f4ad"
const BUSINESS_ID = "67e81d1ca90b3e881fb6b2d5"

export default function Home() {
  return (
    <div className="home-container">
      <LeftBar flow_id={FLOW_ID} business_id={BUSINESS_ID} />
      <FlowEditor flow_id={FLOW_ID} business_id={BUSINESS_ID} />
    </div>
  );
}
