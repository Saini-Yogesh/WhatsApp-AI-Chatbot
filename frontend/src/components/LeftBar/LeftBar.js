import React, { useState } from "react";
import axios from "axios";
import "../LeftBar/LeftBar.css";

const LeftBar = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setBusinessData(null);

    try {
      const response = await axios.post(
        "https://your-backend-api.com/business",
        { name, description }
      );
      setBusinessData(response.data);
    } catch (err) {
      setError("Failed to submit business details. Please try again.");
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

      {businessData && (
        <div className="business-info">
          <h3>Submitted Data:</h3>
          <p><strong>Name:</strong> {businessData.name}</p>
          <p><strong>Description:</strong> {businessData.description}</p>
        </div>
      )}
    </div>
  );
};

export default LeftBar;
