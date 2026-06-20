import React, { Suspense, lazy } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Toaster } from 'react-hot-toast';
import Home from "./pages/Home";

const AdminLogs = lazy(() => import("./pages/AdminLogs"));

function App() {
  const path = window.location.pathname;

  if (path === "/adminlogs") {
    return (
      <Suspense fallback={<div style={{ color: 'white', padding: '20px' }}>Loading...</div>}>
        <Toaster position="top-right" reverseOrder={false} />
        <AdminLogs />
        <SpeedInsights />
      </Suspense>
    );
  }

  return (
    <div className="App">
      <Toaster position="top-right" reverseOrder={false} />
      <Home />
      <SpeedInsights />
    </div>
  );
}

export default App;
