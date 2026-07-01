import React, { useState, useEffect } from "react";
import { Zap, Bot, MessageSquare, UserCheck, User } from "lucide-react";
import "./FlowAnimation.css";

export default function FlowAnimation() {
  const [activeStep, setActiveStep] = useState(0); // Steps: 0 to 7
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        const next = (prev + 1) % 8;
        
        // Trigger typing delays for bot/agent messages
        if (next === 1 || next === 3 || next === 5 || next === 7) {
          setTyping(true);
          setTimeout(() => setTyping(false), 600);
        }
        
        return next;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-visual">
      <div className="mock-canvas-wrapper">
        <div className="mock-canvas">
        <div className="mock-canvas-header">
          <div className="dot red"></div>
          <div className="dot yellow"></div>
          <div className="dot green"></div>
          <span className="mock-title">interactive_simulator.json</span>
          <div className="live-badge">
            <span className="live-dot animate-ping"></span>
            <span>SIMULATOR</span>
          </div>
        </div>
        
        <div className="mock-canvas-body">
          {/* LEFT COLUMN: VISUAL FLOW WORKSPACE */}
          <div className="mock-canvas-workspace">
            {/* Node 1: Trigger */}
            <div className={`mock-node node-trigger ${activeStep === 0 || activeStep === 4 ? "node-active" : ""}`}>
              <div className="node-header">
                <Zap size={11} className="node-icon" /> Trigger
              </div>
              <div className="node-body">
                <p className="node-text">Keyword: <strong>"Hi"</strong></p>
              </div>
              <div className="node-port port-bottom"></div>
            </div>

            {/* Node 2: Welcome Bot (AI Menu) */}
            <div className={`mock-node node-menu ${
              [1, 2, 5, 6].includes(activeStep) ? "node-active" : ""
            }`}>
              <div className="node-port port-top"></div>
              <div className="node-header">
                <Bot size={11} className="node-icon" /> Welcome Bot
              </div>
              <div className="node-body">
                <div className={`node-option ${activeStep === 2 ? "selected" : ""}`}>
                  1. View Products
                </div>
                <div className={`node-option ${activeStep === 6 ? "selected" : ""}`}>
                  2. Talk to Support
                </div>
              </div>
              <div className="node-port port-bottom-left"></div>
              <div className="node-port port-bottom-right"></div>
            </div>

            {/* SVG Connecting Curves */}
            <svg className="mock-connections">
              {/* Trigger Out -> Welcome Bot In */}
              <path 
                d="M 65 65 C 65 85, 75 90, 75 110" 
                fill="none" 
                stroke={[1, 2, 3, 5, 6, 7].includes(activeStep) ? "#25d366" : "rgba(255, 255, 255, 0.08)"} 
                strokeWidth="2" 
                className={[1, 2, 5, 6].includes(activeStep) ? "cable-active" : ""}
              />
              {/* Welcome Bot (Option 1) -> Send Catalog */}
              <path 
                d="M 42 200 C 42 215, 65 225, 65 240" 
                fill="none" 
                stroke={activeStep === 3 ? "#25d366" : "rgba(255, 255, 255, 0.08)"} 
                strokeWidth="2" 
                className={activeStep === 3 ? "cable-active" : ""}
              />
              {/* Welcome Bot (Option 2) -> Human Handoff */}
              <path 
                d="M 108 200 C 108 215, 197.5 225, 197.5 240" 
                fill="none" 
                stroke={activeStep === 7 ? "#25d366" : "rgba(255, 255, 255, 0.08)"} 
                strokeWidth="2" 
                className={activeStep === 7 ? "cable-active" : ""}
              />
            </svg>

            {/* Node 3: Send Catalog */}
            <div className={`mock-node node-catalog ${activeStep === 3 ? "node-active" : ""}`}>
              <div className="node-port port-top"></div>
              <div className="node-header">
                <MessageSquare size={11} className="node-icon" /> Send Products
              </div>
              <div className="node-body">
                <p className="node-text">Send: <strong>Product List</strong></p>
              </div>
            </div>

            {/* Node 4: Human Handoff */}
            <div className={`mock-node node-support ${activeStep === 7 ? "node-active" : ""}`}>
              <div className="node-port port-top"></div>
              <div className="node-header">
                <UserCheck size={11} className="node-icon animate-pulse-green" /> Talk to Agent
              </div>
              <div className="node-body">
                <p className="node-text">Route to: <strong>Sarah</strong></p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SMARTPHONE CHAT SCREEN */}
          <div className="mock-mobile">
            <div className="mobile-header">
              <div className="camera"></div>
              <div className="mobile-title">
                <div className="avatar">W</div>
                <div>
                  <div className="name">Preview Chat</div>
                  <div className="status">Online</div>
                </div>
              </div>
            </div>
            <div className="mobile-chat">
              {/* BRANCH A: VIEW CATALOG PATH */}
              {activeStep === 0 && (
                <div className="bubble bubble-user">
                  <span>
                    <User size={10} className="bubble-inline-icon" /> Hi!
                  </span>
                </div>
              )}

              {activeStep >= 1 && activeStep <= 3 && (
                <>
                  <div className="bubble bubble-user">
                    <span>
                      <User size={10} className="bubble-inline-icon" /> Hi!
                    </span>
                  </div>
                  <div className="bubble bubble-bot">
                    <span>
                      <Bot size={10} className="bubble-inline-icon-bot" /> Welcome! 🟢 How can we help you?
                    </span>
                    <div className="bubble-menu-opt">1. View Products</div>
                    <div className="bubble-menu-opt">2. Talk to Support</div>
                  </div>
                </>
              )}

              {activeStep >= 2 && activeStep <= 3 && (
                <div className="bubble bubble-user">
                  <span>
                    <User size={10} className="bubble-inline-icon" /> 1
                  </span>
                </div>
              )}

              {activeStep === 3 && (
                <div className="bubble bubble-bot">
                  <span>
                    <Bot size={10} className="bubble-inline-icon-bot" /> Loading products... 📦 Here are our top bikes!
                  </span>
                </div>
              )}

              {/* BRANCH B: HUMAN SUPPORT PATH */}
              {activeStep === 4 && (
                <div className="bubble bubble-user">
                  <span>
                    <User size={10} className="bubble-inline-icon" /> Hi
                  </span>
                </div>
              )}

              {activeStep >= 5 && activeStep <= 7 && (
                <>
                  <div className="bubble bubble-user">
                    <span>
                      <User size={10} className="bubble-inline-icon" /> Hi
                    </span>
                  </div>
                  <div className="bubble bubble-bot">
                    <span>
                      <Bot size={10} className="bubble-inline-icon-bot" /> Welcome! 🟢 How can we help you?
                    </span>
                    <div className="bubble-menu-opt">1. View Products</div>
                    <div className="bubble-menu-opt">2. Talk to Support</div>
                  </div>
                </>
              )}

              {activeStep >= 6 && activeStep <= 7 && (
                <div className="bubble bubble-user">
                  <span>
                    <User size={10} className="bubble-inline-icon" /> 2
                  </span>
                </div>
              )}

              {activeStep === 7 && (
                <div className="bubble bubble-agent">
                  <span>
                    <UserCheck size={10} className="bubble-inline-icon-agent" /> Hi! This is Sarah from Support. How can I help you?
                  </span>
                </div>
              )}

              {/* Typing indicator bubble */}
              {typing && (
                <div className="bubble bubble-bot bubble-typing">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
