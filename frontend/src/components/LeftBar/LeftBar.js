import React, { useState, useEffect } from "react";
import "../LeftBar/LeftBar.css";

const LeftBar = ({ flow_id, business_id }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [aiResponses, setAiResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBusinessDetails = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:7000/api/users/${id}`);
      if (!response.ok) throw new Error("Failed to fetch business details");

      let data = await response.json();
      data = data.user;

      setName(data.businessName || "");
      setDescription(data.businessDescription || "");
      setAiResponses(data.aiResponses || []);
      setLoading(false);
    } catch (err) {
      setError("Error fetching business details. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (business_id) {
      fetchBusinessDetails(business_id);
    }
  }, [business_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:7000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: business_id, // Use "id" to match backend expectation
          businessName: name,
          businessDescription: description,
          flow_id: flow_id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit business details");
      }
      window.location.reload();
    } catch (err) {
      setError(err.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="left-bar">
      <h2>Provide ChatBot  Details</h2>
      <form onSubmit={handleSubmit} className="business-form">
        <input
          type="text"
          placeholder="ChatBot Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="ChatBot Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {loading && <div className="loading-spinner"></div>}
      {error && <p className="error">{error}</p>}

      {aiResponses.length > 0 && (
        <div className="ai-responses">
          <h3>Recommended AI Flow</h3>
          <ul>
            {aiResponses?.map?.((response, index) => (
              <li key={index}>
                {response.question ? (
                  <>
                    <strong>Q:</strong> {response.question}
                    <br />
                    <strong>A:</strong> {response.answer}
                  </>
                ) : (
                  <>
                    <strong>Bot:</strong> {response.bot}
                    <br />
                    <strong>Options:</strong> {response.options?.join(" | ")}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LeftBar;
