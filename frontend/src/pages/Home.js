import React, { useEffect } from "react";
import { Link } from "../components/Router";
import {
  Play,
  ArrowRight,
  CheckCircle,
  Cpu,
  Zap,
  Terminal,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { logActivity } from "../utils/logger";
import FlowAnimation from "../components/FlowAnimation";
import "./Home.css";

export default function Home() {
  useEffect(() => {
    logActivity("LANDING_PAGE_ACCESSED");
    document.title = "WhatsAppFlows | Visual No-Code WhatsApp Chatbot Builder & AI Simulator";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Design, test, and deploy visual conversational workflows for WhatsApp Business API with zero coding. Draw question flows, simulate chats, and auto-generate Gemini AI answers.");
    }
  }, []);

  return (
    <div className="landing-page">
      {/* 1. HERO SECTION */}
      <header className="hero-section">
        <div className="hero-glow hero-glow-1"></div>
        <div className="hero-glow hero-glow-2"></div>

        <div className="hero-container">
          <div className="hero-content">
            <span className="hero-badge">
              <Zap size={14} className="badge-icon" /> Build without coding
            </span>
            <h1 className="hero-title">
              Visual <span className="highlight">WhatsApp Chatbot</span> Builder
            </h1>
            <p className="hero-subtitle">
              Design conversational user journeys visually. Automatically
              generate response flows, test your workflow in a secure
              playground, and deploy it to WhatsApp Business API.
            </p>
            <div className="hero-actions">
              <Link to="/trial" className="btn-glow-border">
                <span className="btn-glow-inner">
                  <span>Start Building Free</span>
                  <Play size={16} />
                </span>
              </Link>
              <Link to="/docs" className="btn btn-secondary">
                <span>How to Setup</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="hero-metrics">
              <div className="metric-item">
                <span className="metric-number">100%</span>
                <span className="metric-label">No-Code Canvas</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-item">
                <span className="metric-number">5 min</span>
                <span className="metric-label">Setup Time</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-item">
                <span className="metric-number">AI</span>
                <span className="metric-label">Powered Assist</span>
              </div>
            </div>
          </div>

          {/* INTERACTIVE MOCK CANVAS ANIMATION */}
          <FlowAnimation />
        </div>
      </header>

      {/* 2. THE THREE-STEP FLOW SECTION */}
      <section className="how-it-works">
        <div className="section-container">
          <div className="section-header">
            <h2>Three Simple Steps to Launch</h2>
            <p>
              Connect your business logic to a real messaging platform in
              minutes.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3>Sketch the Flow</h3>
              <p>
                Drag and drop nodes on our canvas to create message blocks,
                options, rules, and questions. Link them together visually.
              </p>
              <ul className="step-features">
                <li>
                  <CheckCircle size={16} className="feature-icon" /> Custom text
                  responses
                </li>
                <li>
                  <CheckCircle size={16} className="feature-icon" /> List menus
                  & options
                </li>
                <li>
                  <CheckCircle size={16} className="feature-icon" /> Interactive
                  button elements
                </li>
              </ul>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Train the AI Model</h3>
              <p>
                Fill in your business name and details. Our AI generator will
                automatically inspect your text blocks and draft
                context-specific answers.
              </p>
              <ul className="step-features">
                <li>
                  <CheckCircle size={16} className="feature-icon" /> Smart NLP
                  intent matching
                </li>
                <li>
                  <CheckCircle size={16} className="feature-icon" /> Custom
                  system instructions
                </li>
                <li>
                  <CheckCircle size={16} className="feature-icon" /> Instant
                  mockup previews
                </li>
              </ul>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <h3>Deploy to WhatsApp</h3>
              <p>
                Copy your generated Flow ID and connect it to your WhatsApp
                Cloud API webhook endpoints. Users' messages will match your
                diagram.
              </p>
              <ul className="step-features">
                <li>
                  <CheckCircle size={16} className="feature-icon" /> Secure API
                  endpoints
                </li>
                <li>
                  <CheckCircle size={16} className="feature-icon" /> Access
                  token management
                </li>
                <li>
                  <CheckCircle size={16} className="feature-icon" /> Real-time
                  activity charts
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. KEY FEATURES */}
      <section className="features-section">
        <div className="section-container">
          <div className="features-wrapper">
            <div className="features-intro">
              <h2>Features designed for developers & managers</h2>
              <p>
                Everything you need to orchestrate user interactions on WhatsApp
                without the headache of building backend flow managers from
                scratch.
              </p>

              <div className="features-list">
                <div className="feature-row">
                  <div className="feature-icon-wrapper">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h4>React-Flow Workspace</h4>
                    <p>
                      Highly responsive canvas supporting dragging, connection
                      snapping, and custom JSON export/import configurations.
                    </p>
                  </div>
                </div>
                <div className="feature-row">
                  <div className="feature-icon-wrapper">
                    <Cpu size={20} />
                  </div>
                  <div>
                    <h4>AI Suggested Answers</h4>
                    <p>
                      Provide a simple prompt description of your business and
                      watch the chatbot draft contextual flows automatically.
                    </p>
                  </div>
                </div>
                <div className="feature-row">
                  <div className="feature-icon-wrapper">
                    <Terminal size={20} />
                  </div>
                  <div>
                    <h4>Live Log Dashboard</h4>
                    <p>
                      Track user responses, successful triggers, database saves,
                      and errors dynamically on the Admin Dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="code-showcase">
              <div className="code-header">
                <div className="code-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="code-file">webhook_server.js</span>
              </div>
              <pre className="code-content">
                <code>
                  {`// Receiving user text in WhatsApp
app.post("/webhook", async (req, res) => {
  const message = req.body.entry[0].changes[0].value.messages[0];
  const userPhone = message.from;
  const userText = message.text.body;

  // Query your exported chatbot flow
  const nextNode = await resolveChatbotFlow({
    flowId: "${process.env.REACT_APP_FLOW_ID || "flow_abc123"}",
    input: userText,
    userId: userPhone
  });

  // Reply back using WhatsApp Cloud API
  await sendWhatsAppMessage(
    userPhone,
    nextNode.messageText,
    nextNode.options
  );

  return res.sendStatus(200);
});`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON SECTION */}
      <section className="comparison-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Why Choose WhatsAppFlows?</h2>
            <p>
              Compare our visual builder features with other standard industry
              alternatives.
            </p>
          </div>
          <div className="table-responsive">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Features</th>
                  <th>WhatsAppFlows</th>
                  <th>Meta Cloud API (Raw)</th>
                  <th>Basic SMS/Chatbot API</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Visual Flow Builder</td>
                  <td className="feat-yes">🟢 Drag & Drop Canvas</td>
                  <td className="feat-no">🔴 No (JSON/Code only)</td>
                  <td className="feat-no">🔴 No (Text/Node trees only)</td>
                </tr>
                <tr>
                  <td>AI suggested workflows</td>
                  <td className="feat-yes">🟢 Yes (Zustand + LLM templates)</td>
                  <td className="feat-no">🔴 No</td>
                  <td className="feat-no">🔴 No</td>
                </tr>
                <tr>
                  <td>Live Traffic & Error Logging</td>
                  <td className="feat-yes">🟢 Full Admin Dashboard</td>
                  <td className="feat-no">🔴 Meta Log Portal only</td>
                  <td className="feat-no">🔴 Limited Webhook logs</td>
                </tr>
                <tr>
                  <td>Setup Time</td>
                  <td className="feat-yes">🟢 Under 5 minutes</td>
                  <td className="feat-no">🔴 Several days (Meta configs)</td>
                  <td className="feat-no">🔴 A few hours</td>
                </tr>
                <tr>
                  <td>Media & Rich Messaging</td>
                  <td className="feat-yes">
                    🟢 Interactive lists, cards, media
                  </td>
                  <td className="feat-yes">🟢 Yes (Raw templates)</td>
                  <td className="feat-no">🔴 Text-only mostly</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="faq-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>
              Get answers to common integration and architectural inquiries.
            </p>
          </div>
          <div className="faq-grid">
            <div className="faq-card">
              <h4>Do I need coding experience to build workflows?</h4>
              <p>
                No! Our workspace builder is 100% visual. You can add question
                blocks, menus, options, and connections. If you want to connect
                it to your live WhatsApp backend, we provide copy-paste code
                blocks and templates to integrate in minutes.
              </p>
            </div>
            <div className="faq-card">
              <h4>Where is the workflow JSON configuration stored?</h4>
              <p>
                When you click 'Save Flow' inside the Trial page, the node
                positions and connection mappings are automatically synced to
                our database endpoints, generating a unique Flow ID. You can
                query this Flow ID to fetch the diagram dynamically.
              </p>
            </div>
            <div className="faq-card">
              <h4>Does it support automated customer support handoffs?</h4>
              <p>
                Yes. The workflow engine allows you to define routing rules. If
                a user clicks 'Talk to Agent', your custom webhook can trigger
                SMS/Email notifications or route the message to support desks
                like Zendesk or Salesforce.
              </p>
            </div>
            <div className="faq-card">
              <h4>
                Can I host this entire builder application on my own servers?
              </h4>
              <p>
                Absolutely. Since this is built using standard React and Node.js
                backend endpoints, you can clone the repository, set up local
                MongoDB configurations, and deploy it to AWS, Vercel, or GCP
                instances instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION SECTION */}
      <section className="cta-section">
        <div className="cta-glow"></div>
        <div className="cta-container">
          <h2>Ready to sketch your first flow?</h2>
          <p>
            Get instant access to the flow builder workspace. Create custom
            questions, text cards, and lists. Save your layout and inspect
            dashboard traffic.
          </p>
          <div className="cta-buttons">
            <Link to="/trial" className="btn-glow-border">
              <span className="btn-glow-inner">
                <span>Open Trial Workspace</span>
                <Play size={16} />
              </span>
            </Link>
            <Link to="/contact" className="btn btn-outline-white">
              <span>Request Custom API Setup</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <p>
            &copy; {new Date().getFullYear()} WhatsAppFlows. Built for
            high-conversion visual conversational systems.
          </p>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/trial">Trial Workspace</Link>
            <Link to="/docs">Documentation</Link>
            <Link to="/contact">Get API Access</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
