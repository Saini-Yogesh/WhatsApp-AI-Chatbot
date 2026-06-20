import React, { Suspense, lazy } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Home from "./pages/Home";

const AdminLogs = lazy(() => import("./pages/AdminLogs"));

function App() {
  const path = window.location.pathname;

  if (path === "/adminlogs") {
    return (
      <Suspense fallback={<div style={{ color: 'white', padding: '20px' }}>Loading...</div>}>
        <AdminLogs />
        <SpeedInsights />
      </Suspense>
    );
  }

  return (
    <div className="App">
      <Home />
      <SpeedInsights />
    </div>
  );
}

export default App;
