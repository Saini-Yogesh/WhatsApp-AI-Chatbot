const API_BASE = "http://localhost:7000/api";

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
