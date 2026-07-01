import React, { useEffect, useState } from "react";
import { 
  MessageCircle, 
  Layers, 
  Code, 
  ExternalLink,
  Clipboard,
  Check
} from "lucide-react";
import { logActivity } from "../utils/logger";
import "./Docs.css";

export default function Docs() {
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    logActivity("DOCS_PAGE_ACCESSED");
    document.title = "Meta Webhook Developer Guide & API Setup | WhatsAppFlows";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Step-by-step developer tutorial for connecting visual chatbot flows to Meta WhatsApp Business Cloud API. Setup secure webhooks, verification tokens, and message payloads.");
    }
  }, []);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const extensionCode1 = `// 1. Create your page file (e.g., src/pages/About.js)
import React from 'react';
import './About.css'; // Optional custom page styling

export default function About() {
  return (
    <div className="about-page">
      <h1>About Us</h1>
      <p>This is a new custom page added to our application.</p>
    </div>
  );
}`;

  const extensionCode2 = `// 2. Open src/App.js and import your new page
import About from "./pages/About";

// 3. Inside src/App.js, update the Route switch logic:
if (path === "/") return <Home />;
if (path === "/trial") return <Trial />;
if (path === "/adminlogs") return <AdminLogs />;
if (path === "/docs") return <Docs />;
if (path === "/contact") return <Contact />;
if (path === "/about") return <About />; // <-- ADD YOUR NEW PAGE ROUTE HERE!`;

  const extensionCode3 = `// 4. Update src/components/Navbar.js to include a link to your new page
<Link
  to="/about"
  className="navbar-link"
  activeClassName="active"
  onClick={() => setIsOpen(false)}
>
  <span>About Us</span>
</Link>`;

  const securityCode = `// Node.js Webhook Signature Validation (Express)
const crypto = require("crypto");

function verifyWhatsAppSignature(req, res, buf, encoding) {
  const signature = req.headers["x-hub-signature-256"];
  if (!signature) return;

  const elements = signature.split("=");
  const signatureHash = elements[1];
  const expectedHash = crypto
    .createHmac("sha256", process.env.APP_SECRET)
    .update(buf)
    .digest("hex");

  if (signatureHash !== expectedHash) {
    throw new Error("Invalid signature: hash verification failed.");
  }
}

// Register as body parser middleware
app.use(bodyParser.json({ verify: verifyWhatsAppSignature }));`;

  const jsonSchemaCode = `{
  "flowId": "flow_abc123",
  "businessName": "Acme Bikes",
  "nodes": [
    {
      "id": "node_1",
      "type": "custom",
      "data": {
        "label": "Welcome! What type of bike do you need?",
        "responses": ["Mountain", "Road"]
      },
      "position": { "x": 100, "y": 150 }
    }
  ],
  "edges": [
    {
      "id": "edge_1",
      "source": "node_1",
      "sourceHandle": "response-0",
      "target": "node_2"
    }
  ]
}`;

  return (
    <div className="docs-page">
      {/* HEADER HERO */}
      <header className="docs-hero">
        <div className="docs-container">
          <span className="docs-badge">Developer Docs</span>
          <h1>Configuration & Extension Guides</h1>
          <p>Learn how to connect this flow builder with a live WhatsApp account, and discover how to easily scale this codebase to 5+ pages.</p>
        </div>
      </header>

      {/* DOCUMENTATION BODY */}
      <main className="docs-main docs-container">
        <div className="docs-grid">
          
          {/* NAVIGATION SIDEBAR */}
          <aside className="docs-sidebar">
            <div className="sidebar-group">
              <h3>Guides</h3>
              <a href="#whatsapp-integration" className="sidebar-item active">Connecting WhatsApp API</a>
              <a href="#codebase-extension" className="sidebar-item">Extending to 5+ Pages</a>
              <a href="#webhook-security" className="sidebar-item">Webhook Security (SHA-256)</a>
              <a href="#json-schema" className="sidebar-item">JSON Workflow Schema</a>
              <a href="#workflow-logic" className="sidebar-item">How Workflows Resolve</a>
            </div>
            
            <div className="sidebar-info-card">
              <h4>Need Help?</h4>
              <p>Contact our support team to request a fully hosted connection with WhatsApp Cloud API instances.</p>
              <a href="/contact" className="sidebar-btn">Request Setup</a>
            </div>
          </aside>

          {/* MAIN ARTICLES */}
          <article className="docs-content">
            
            {/* ARTICLE 1: WHATSAPP CONNECTION */}
            <section id="whatsapp-integration" className="docs-section">
              <h2><MessageCircle className="section-title-icon" /> Connecting to Real WhatsApp API</h2>
              <p className="section-desc">
                Since this application is a visual designer, it outputs a clean JSON configuration representing the nodes and connections. Here is the step-by-step process to attach it to the real WhatsApp Cloud API:
              </p>

              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-marker">1</div>
                  <div className="timeline-content">
                    <h4>Create Meta Developer Account</h4>
                    <p>Go to the <a href="https://developers.facebook.com/" target="_blank" rel="noreferrer">Meta for Developers Portal <ExternalLink size={12} /></a> and create a new App under the "Business" category. Add the <strong>WhatsApp</strong> product to your app.</p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-marker">2</div>
                  <div className="timeline-content">
                    <h4>Get Permanent Access Token & Phone ID</h4>
                    <p>Meta provides a temporary 24-hour token for testing. For production, register your business phone number and generate a permanent System User access token from your Facebook Business Manager settings.</p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-marker">3</div>
                  <div className="timeline-content">
                    <h4>Deploy Backend Webhook</h4>
                    <p>WhatsApp requires a secure HTTP Webhook endpoint (`https`) to send user messages to. You can host our backend script (located in `/backend`) on platforms like Heroku, Render, Vercel, or AWS.</p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-marker">4</div>
                  <div className="timeline-content">
                    <h4>Register Webhook URL in Meta App</h4>
                    <p>In Meta Developer Portal, set your Webhook URL to `https://your-backend-domain.com/api/webhook` and verify it using a secret Verification Token. Subscribe to the `messages` webhook topic.</p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-marker">5</div>
                  <div className="timeline-content">
                    <h4>Sync Flow ID</h4>
                    <p>Once you click <strong>Save Flow</strong> inside the Trial workspace, copy the generated Flow ID from the Left bar. Input it as `REACT_APP_FLOW_ID` in your backend configuration environment to load the layout nodes dynamically.</p>
                  </div>
                </div>
              </div>
            </section>

            <hr className="divider" />

            {/* ARTICLE 2: EXTENDING TO 5+ PAGES */}
            <section id="codebase-extension" className="docs-section">
              <h2><Layers className="section-title-icon" /> How to Extend More Pages (5+ Pages)</h2>
              <p className="section-desc">
                We have built a clean custom client-side router context provider for this project, keeping it fast and lightweight without bloated external library installation. Adding pages is easy:
              </p>

              <div className="guide-card">
                <h3>Step-by-Step Extension Recipe</h3>
                <ol className="recipe-list">
                  <li>
                    <strong>Create new Page files:</strong> Create a new file in <code>src/pages/</code> (e.g. <code>About.js</code>) and style it in <code>About.css</code>.
                  </li>
                  <li>
                    <strong>Import the page:</strong> Open <code>src/App.js</code> and import the new component.
                  </li>
                  <li>
                    <strong>Define Route Path:</strong> Add a conditional branch matching the path string in the App rendering function.
                  </li>
                  <li>
                    <strong>Add Link to Navbar:</strong> Open <code>src/components/Navbar.js</code> and add a <code>&lt;Link to="/your-path"&gt;</code> item.
                  </li>
                </ol>
              </div>

              {/* Code Codeblocks with Copy Function */}
              <div className="code-block-wrapper">
                <div className="code-block-header">
                  <span>Create Page File (src/pages/About.js)</span>
                  <button onClick={() => handleCopy(extensionCode1, "code1")} className="copy-btn">
                    {copiedId === "code1" ? <Check size={14} className="copied" /> : <Clipboard size={14} />}
                    <span>{copiedId === "code1" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <pre><code>{extensionCode1}</code></pre>
              </div>

              <div className="code-block-wrapper">
                <div className="code-block-header">
                  <span>Configure Route (src/App.js)</span>
                  <button onClick={() => handleCopy(extensionCode2, "code2")} className="copy-btn">
                    {copiedId === "code2" ? <Check size={14} className="copied" /> : <Clipboard size={14} />}
                    <span>{copiedId === "code2" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <pre><code>{extensionCode2}</code></pre>
              </div>

              <div className="code-block-wrapper">
                <div className="code-block-header">
                  <span>Add Link to Header (src/components/Navbar.js)</span>
                  <button onClick={() => handleCopy(extensionCode3, "code3")} className="copy-btn">
                    {copiedId === "code3" ? <Check size={14} className="copied" /> : <Clipboard size={14} />}
                    <span>{copiedId === "code3" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <pre><code>{extensionCode3}</code></pre>
              </div>
            </section>

            <hr className="divider" />

            {/* ARTICLE: WEBHOOK SECURITY */}
            <section id="webhook-security" className="docs-section">
              <h2><MessageCircle className="section-title-icon" /> Webhook Security (SHA-256 Signature Verification)</h2>
              <p className="section-desc">
                WhatsApp sends webhook events with an <code>X-Hub-Signature-256</code> header containing the SHA-256 signature of the payload, generated using your Meta App Secret. To prevent spoofing and verify authenticity:
              </p>
              
              <div className="code-block-wrapper">
                <div className="code-block-header">
                  <span>Verify Webhook Signature (Express/Node.js)</span>
                  <button onClick={() => handleCopy(securityCode, "code_sec")} className="copy-btn">
                    {copiedId === "code_sec" ? <Check size={14} className="copied" /> : <Clipboard size={14} />}
                    <span>{copiedId === "code_sec" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <pre><code>{securityCode}</code></pre>
              </div>
            </section>

            <hr className="divider" />

            {/* ARTICLE: JSON WORKFLOW SCHEMA */}
            <section id="json-schema" className="docs-section">
              <h2><Code className="section-title-icon" /> JSON Workflow Schema</h2>
              <p className="section-desc">
                When you design a chatbot diagram, it is saved in the database as a structured JSON object. Developers can parse this schema to execute conversational routing:
              </p>
              
              <div className="code-block-wrapper">
                <div className="code-block-header">
                  <span>Exported JSON Payload Schema</span>
                  <button onClick={() => handleCopy(jsonSchemaCode, "code_json")} className="copy-btn">
                    {copiedId === "code_json" ? <Check size={14} className="copied" /> : <Clipboard size={14} />}
                    <span>{copiedId === "code_json" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <pre><code>{jsonSchemaCode}</code></pre>
              </div>
            </section>

            <hr className="divider" />

            {/* ARTICLE 3: HOW WORKFLOWS RESOLVE */}
            <section id="workflow-logic" className="docs-section">
              <h2><Code className="section-title-icon" /> How Workflows Resolve</h2>
              <p className="section-desc">
                When a message is received from a user, the backend loops through the exported flow nodes:
              </p>
              
              <div className="logic-grid">
                <div className="logic-card">
                  <h4>1. Entry Matching</h4>
                  <p>Matches starting keywords (e.g. "hi", "support", "sales") against the Trigger node values.</p>
                </div>
                <div className="logic-card">
                  <h4>2. Session State Tracking</h4>
                  <p>Saves which node the user is currently interacting with so options menu selects resolve correctly.</p>
                </div>
                <div className="logic-card">
                  <h4>3. Fallback Intent</h4>
                  <p>If no user input matches, the chatbot queries the AI engine trained on your chatbot profile description.</p>
                </div>
              </div>
            </section>

          </article>
        </div>
      </main>
    </div>
  );
}
