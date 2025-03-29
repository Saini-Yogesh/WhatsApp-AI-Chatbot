import React from "react";
import FlowEditor from "../components/FlowEditter/FlowEditor";
import LeftBar from "../components/LeftBar/LeftBar";
import "../pages/Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <LeftBar />
      <FlowEditor />
    </div>
  );
}
