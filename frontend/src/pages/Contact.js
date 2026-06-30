import React, { useEffect, useState } from "react";
import { 
  Send, 
  CheckCircle, 
  ShieldCheck, 
  Zap, 
  Clock
} from "lucide-react";
import { logActivity } from "../utils/logger";
import "./Contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessName: "",
    whatsapp: "",
    volume: "1000",
    useCase: "",
    requestHosting: true
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    logActivity("CONTACT_PAGE_ACCESSED");
    document.title = "Get WhatsApp Business API Integration | WhatsAppFlows";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Request managed hosting, phone line verification, and CRM integrations for your visual chatbot workflows. Starter, Growth, and Enterprise SLAs.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API request to backend (log activity, then show success state)
    setTimeout(() => {
      logActivity("CONTACT_FORM_SUBMITTED", formData);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <div className="contact-page">
      <div className="contact-glow contact-glow-1"></div>
      <div className="contact-glow contact-glow-2"></div>
      
      <main className="contact-container">
        
        {/* INTRO COLUMN */}
        <div className="contact-info">
          <span className="contact-badge">Enterprise Solutions</span>
          <h1>Need a direct <span className="highlight">WhatsApp Connection</span>?</h1>
          <p className="contact-description">
            While our visual trial playground allows you to prototype user workflows, deploying them to live WhatsApp customer base requires meta approval, verified phone lines, and robust hosting.
          </p>
          
          <div className="benefits-list">
            <div className="benefit-item">
              <Zap className="benefit-icon animate-pulse-green" />
              <div>
                <h4>Direct WhatsApp Cloud API Connection</h4>
                <p>We deploy, verify, and host your node workflow directly to Meta's servers under your own custom phone number.</p>
              </div>
            </div>
            
            <div className="benefit-item">
              <ShieldCheck className="benefit-icon" />
              <div>
                <h4>Secure & Encrypted Database Integration</h4>
                <p>Automatically save user details, order forms, and customer inputs from your WhatsApp chatbot to Google Cloud databases.</p>
              </div>
            </div>

            <div className="benefit-item">
              <Clock className="benefit-icon" />
              <div>
                <h4>99.9% Uptime & SLA Guarantee</h4>
                <p>Fully managed server nodes that process thousands of conversations concurrently without lagging or dropping requests.</p>
              </div>
            </div>
          </div>
        </div>

        {/* FORM/SUCCESS COLUMN */}
        <div className="contact-form-wrapper">
          {isSuccess ? (
            <div className="success-card">
              <div className="success-icon-wrapper">
                <CheckCircle size={60} className="success-icon" />
              </div>
              <h2>Request Received!</h2>
              <p>Thank you for reaching out, <strong>{formData.name}</strong>. Our custom integrations expert will review your requirements for <strong>{formData.businessName}</strong> and contact you via email or WhatsApp within 24 hours.</p>
              <div className="success-details">
                <div className="detail-row">
                  <span>Selected Volume:</span>
                  <strong>{formData.volume === "100000+" ? "100k+" : formData.volume} msgs/mo</strong>
                </div>
                <div className="detail-row">
                  <span>WhatsApp Hosting:</span>
                  <strong>{formData.requestHosting ? "Requested 🟢" : "Not requested 🔴"}</strong>
                </div>
              </div>
              <button onClick={() => setIsSuccess(false)} className="btn btn-secondary w-full">
                Send Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <h3>Get in touch with an Expert</h3>
              <p className="form-sub">Fill out this quick form, and we'll configure your WhatsApp API endpoints.</p>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    placeholder="John Doe" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Work Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="john@company.com" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="businessName">Business Name</label>
                  <input 
                    type="text" 
                    id="businessName" 
                    name="businessName" 
                    placeholder="Acme Corp" 
                    value={formData.businessName} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="whatsapp">WhatsApp Phone Number</label>
                  <input 
                    type="tel" 
                    id="whatsapp" 
                    name="whatsapp" 
                    placeholder="+1 (555) 019-2834" 
                    value={formData.whatsapp} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="volume">Estimated Monthly Messages</label>
                  <select 
                    id="volume" 
                    name="volume" 
                    value={formData.volume} 
                    onChange={handleChange}
                  >
                    <option value="1000">Less than 5,000 / mo</option>
                    <option value="10000">5,000 to 25,000 / mo</option>
                    <option value="50000">25,000 to 100,000 / mo</option>
                    <option value="100000+">More than 100,000 / mo</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="useCase">Describe Your Use Case</label>
                  <textarea 
                    id="useCase" 
                    name="useCase" 
                    rows="3" 
                    placeholder="e.g. Lead generation, automated order booking, customer support chatbot with menu switches..."
                    value={formData.useCase} 
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="form-group full-width checkbox-group">
                  <input 
                    type="checkbox" 
                    id="requestHosting" 
                    name="requestHosting" 
                    checked={formData.requestHosting} 
                    onChange={handleChange} 
                  />
                  <label htmlFor="requestHosting">
                    I want WhatsAppFlows to host and verify my Meta WhatsApp Business Phone line.
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Submit Integration Request</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* PRICING TIER SECTION */}
      <section className="pricing-section">
        <div className="section-container-pricing">
          <div className="pricing-header">
            <h2>Hosted Integration Plans</h2>
            <p>Deploy your visual workflows directly to permanent Cloud API phone numbers with managed databases.</p>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card">
              <span className="price-tier">Starter</span>
              <div className="price-value">$49<span>/mo</span></div>
              <p className="price-desc">Perfect for local businesses launching their first chatbot flow.</p>
              <ul className="price-features">
                <li><CheckCircle size={14} /> 1 Active Webhook Line</li>
                <li><CheckCircle size={14} /> Up to 5,000 messages/mo</li>
                <li><CheckCircle size={14} /> JSON Schema Export</li>
                <li><CheckCircle size={14} /> Standard Email Support</li>
              </ul>
            </div>
            
            <div className="pricing-card pricing-card-featured">
              <div className="featured-badge">Most Popular</div>
              <span className="price-tier">Growth</span>
              <div className="price-value">$199<span>/mo</span></div>
              <p className="price-desc">For growing firms needing active database saves and SLA uptimes.</p>
              <ul className="price-features">
                <li><CheckCircle size={14} /> 3 Active Webhook Lines</li>
                <li><CheckCircle size={14} /> Up to 50,000 messages/mo</li>
                <li><CheckCircle size={14} /> MongoDB / Firebase Storage</li>
                <li><CheckCircle size={14} /> Priority Chat Support</li>
                <li><CheckCircle size={14} /> Custom Admin Log Portal</li>
              </ul>
            </div>

            <div className="pricing-card">
              <span className="price-tier">Enterprise</span>
              <div className="price-value">Custom</div>
              <p className="price-desc">For large networks needing custom NLP training & dedicated VM servers.</p>
              <ul className="price-features">
                <li><CheckCircle size={14} /> Unlimited Webhook Lines</li>
                <li><CheckCircle size={14} /> Unlimited messages/mo</li>
                <li><CheckCircle size={14} /> Dedicated Node.js Servers</li>
                <li><CheckCircle size={14} /> CRM Sync (Hubspot/Salesforce)</li>
                <li><CheckCircle size={14} /> 99.9% Uptime Guarantee</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST AND COMPLIANCE */}
      <section className="trust-section">
        <div className="section-container-trust">
          <div className="trust-grid">
            <div className="trust-item">
              <ShieldCheck size={28} />
              <h4>GDPR & Data Encryption</h4>
              <p>We process all user details and WhatsApp logs using TLS 1.3 encryption. Your customer's messages are never saved in plain text.</p>
            </div>
            <div className="trust-item">
              <CheckCircle size={28} />
              <h4>Meta Cloud Compliant</h4>
              <p>All endpoints are fully updated to WhatsApp Cloud API v18.0 standards, ensuring direct delivery without middle-ware delays.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
