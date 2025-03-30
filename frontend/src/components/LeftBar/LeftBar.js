import React, { useState, useEffect } from "react";
import "../LeftBar/LeftBar.css";
import getFormattedNodes from "../FlowGenerator/FlowGenerator";

const LeftBar = ({ flow_id, business_id }) => {
  const [businessId, setBusinessId] = useState(business_id);
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
    if (businessId) {
      fetchBusinessDetails(businessId);
    }
  }, [businessId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:7000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: businessId, // Use "id" to match backend expectation
          businessName: name,
          businessDescription: description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit business details");
      }

      const data = await response.json();

      let updatedBusinessId = businessId;
      if (!businessId && data.user?._id) {
        updatedBusinessId = data.user._id; // Store the new businessId
        setBusinessId(updatedBusinessId);
      }

      // ✅ Wait for AI-generated flow before proceeding
      const AIGeneraterFlow = await handleFlowGeneration(name, description);

      // ✅ Save generated flow to backend
      await saveNodesToDB(flow_id, AIGeneraterFlow);

      // ✅ Fetch updated business details
      fetchBusinessDetails(updatedBusinessId);
    } catch (err) {
      setError(err.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  async function handleFlowGeneration(name, description) {
    try {
      const AIGeneraterFlow = await getFormattedNodes(name, description); // ✅ Wait for the promise
      console.log(AIGeneraterFlow);
      return AIGeneraterFlow; // ✅ Return the generated flow
    } catch (error) {
      console.error("Error generating nodes:", error);
      return null; // Return null if an error occurs
    }
  }

  // Function to save AI-generated flow to the backend
  async function saveNodesToDB(businessId, flowData) {
    if (!flowData || !businessId) return;

    try {
      const res = await fetch("http://localhost:7000/api/flows/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: businessId,
          nodes: flowData.nodes, // Ensure correct format
          edges: flowData.edges, // Include edges if applicable
        }),
      });

      const responseData = await res.json();
      if (responseData.id) {
        console.log(responseData);
        // setFlowId(responseData.id); // Store flow ID for future updates
      }

      console.log("Flow saved successfully:", responseData);
      window.location.href = window.location.href;
    } catch (error) {
      console.error("Error saving flow:", error);
    }
  }

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
