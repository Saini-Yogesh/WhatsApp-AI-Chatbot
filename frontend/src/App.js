import { SpeedInsights } from '@vercel/speed-insights/react';
import Home from "./pages/Home";
import AdminLogs from "./pages/AdminLogs";

function App() {
  const path = window.location.pathname;

  if (path === "/adminlogs") {
    return (
      <>
        <AdminLogs />
        <SpeedInsights />
      </>
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
