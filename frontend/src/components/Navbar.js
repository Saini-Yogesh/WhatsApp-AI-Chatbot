import React, { useState } from "react";
import { Link, useRouter } from "./Router";
import { MessageSquare, Play, BookOpen, MessageCircle, Menu, X } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const { path } = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Don't show Navbar when inside the builder workspace/trial if we want a clean full-screen canvas,
  // OR show a compact header inside the canvas.
  // Let's show a sleek slim header on the trial page but support full navigation!
  const isTrial = path === "/trial";

  return (
    <nav className={`navbar ${isTrial ? "navbar-trial" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <MessageCircle className="logo-icon animate-pulse" size={26} />
          <span className="logo-text">
            WhatsApp<span className="logo-accent">Flows</span>
          </span>
        </Link>

        {/* Mobile menu toggle */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links */}
        <div className={`navbar-links ${isOpen ? "active" : ""}`}>
          <Link
            to="/"
            className="navbar-link"
            activeClassName="active"
            onClick={() => setIsOpen(false)}
          >
            <MessageSquare size={16} className="link-icon" />
            <span>Home</span>
          </Link>
          <Link
            to="/trial"
            className="navbar-link navbar-link-highlight btn-glow-border nav-glow"
            activeClassName="active"
            onClick={() => setIsOpen(false)}
          >
            <span className="btn-glow-inner">
              <Play size={16} className="link-icon" />
              <span>Trial Workspace</span>
            </span>
          </Link>
          <Link
            to="/docs"
            className="navbar-link"
            activeClassName="active"
            onClick={() => setIsOpen(false)}
          >
            <BookOpen size={16} className="link-icon" />
            <span>Setup & Guides</span>
          </Link>
          <Link
            to="/contact"
            className="navbar-link contact-button"
            activeClassName="active"
            onClick={() => setIsOpen(false)}
          >
            <span>Get WhatsApp API</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
