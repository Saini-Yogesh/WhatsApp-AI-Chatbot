import React, { useState, useEffect } from "react";
import "../LeftBar/LeftBar.css";

const LeftBar = () => {
  const [businessId, setBusinessId] = useState(localStorage.getItem("businessId") || "");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [aiResponses, setAiResponses] = useState(JSON.parse(localStorage.getItem("aiResponses")) || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAiResponses = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${id}`);
      if (!response.ok) throw new Error("Failed to fetch AI responses");

      const data = await response.json();
      setAiResponses(data.aiResponses || []);
      localStorage.setItem("aiResponses", JSON.stringify(data.aiResponses || []));
    } catch (err) {
      setError("Error fetching AI responses. Please try again.");
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchAiResponses(businessId);
    }
  }, [businessId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAiResponses([]);

    try {
      const response = await fetch("http://localhost:8000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName: name, businessDescription: description }),
      });

      if (!response.ok) throw new Error("Failed to submit business details");

      const data = await response.json();
      setBusinessId(data.user._id);
      localStorage.setItem("businessId", data.user._id);

      if (data.user._id) {
        await fetchAiResponses(data.user._id);
      } else {
        setError("User ID not found. Could not fetch AI responses.");
      }
    } catch (err) {
      setError(err.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="left-bar">
      <h2>Business Details</h2>
      <form onSubmit={handleSubmit} className="business-form">
        <input
          type="text"
          placeholder="Business Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Business Description"
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
          <h3>AI Responses</h3>
          <ul>
            {aiResponses.map((response, index) => (
              <li key={index}>
                <strong>Q:</strong> {response.question}
                <br />
                <strong>A:</strong> {response.answer}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LeftBar;
