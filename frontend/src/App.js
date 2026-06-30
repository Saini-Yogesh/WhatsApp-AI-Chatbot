import React, { Suspense, lazy } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Toaster } from "react-hot-toast";
import { RouterProvider, useRouter } from "./components/Router";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Trial from "./pages/Trial";
import Docs from "./pages/Docs";
import Contact from "./pages/Contact";

// Lazy load heavy admin analytics dashboard
const AdminLogs = lazy(() => import("./pages/AdminLogs"));

// Inner component to access the router state
function AppContent() {
  const { path } = useRouter();
  const isTrial = path === "/trial";

  // Route resolver switcher
  const renderPage = () => {
    switch (path) {
      case "/":
        return <Home />;
      case "/trial":
        return <Trial />;
      case "/docs":
        return <Docs />;
      case "/contact":
        return <Contact />;
      case "/adminlogs":
        return (
          <Suspense fallback={<div style={{ color: "white", padding: "20px" }}>Loading Dashboard Analytics...</div>}>
            <AdminLogs />
          </Suspense>
        );
      default:
        // Redirect to Landing Home Page for any unmatched path
        return <Home />;
    }
  };

  return (
    <div className={`App ${isTrial ? "app-trial" : ""}`}>
      <Navbar />
      <div className="page-content">
        {renderPage()}
      </div>
      <SpeedInsights />
    </div>
  );
}

function App() {
  return (
    <RouterProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <AppContent />
    </RouterProvider>
  );
}

export default App;
