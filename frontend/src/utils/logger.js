const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:7000";
const API_BASE = `${BASE_URL}/api`;

export const logActivity = async (action, details = {}) => {
  try {
    const payload = {
      action,
      path: window.location.pathname,
      user: "Anonymous", // User mentioned to record anonymously
    };

    await fetch(`${API_BASE}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};
