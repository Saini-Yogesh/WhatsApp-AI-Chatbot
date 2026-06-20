import React, { useState, useEffect } from "react";
import { logActivity } from "../../utils/logger";
import { toast } from "react-hot-toast";
import "../LeftBar/LeftBar.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const LeftBar = ({ flow_id, business_id }) => {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [aiResponses, setAiResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBusinessDetails = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/users/${id}`);
      if (!response.ok) throw new Error("Failed to fetch business details");

      let data = await response.json();
      data = data.user;

      setName(data.businessName || "");
      setDescription(data.businessDescription || "");
      setAiResponses(data.aiResponses || []);
      setLoading(false);
      logActivity("FETCH_BUSINESS_DETAILS_SUCCESS", { business_id: id });
    } catch (err) {
      toast.error("Error fetching chatbot details. Please try again.");
      setError("Error fetching chatbot details. Please try again.");
      setLoading(false);
      logActivity("FETCH_BUSINESS_DETAILS_ERROR", { business_id: id, error: err.message });
    }
  };

  useEffect(() => {
    const pendingToastSuccess = localStorage.getItem("toast_success_message");
    if (pendingToastSuccess) {
      toast.success(pendingToastSuccess);
      localStorage.removeItem("toast_success_message");
    }
    const pendingToastError = localStorage.getItem("toast_error_message");
    if (pendingToastError) {
      toast.error(pendingToastError);
      localStorage.removeItem("toast_error_message");
    }
    if (business_id) {
      fetchBusinessDetails(business_id);
    }
  }, [business_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/api/users/register`, {
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
      
      logActivity("UPDATE_BUSINESS_DETAILS", { name, description });
      localStorage.setItem("toast_success_message", "Business details updated successfully!");
      window.location.reload();
    } catch (err) {
      logActivity("ERROR_BUSINESS_DETAILS", { error: err.message });
      toast.error(err.message || "Submission failed. Please try again.");
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
      {/* eslint-disable-next-line */}
      <h1></h1>
    </div>
  );
};

export default LeftBar;
