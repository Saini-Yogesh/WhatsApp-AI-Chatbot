import Home from "./pages/Home";
import AdminLogs from "./pages/AdminLogs";

function App() {
  const path = window.location.pathname;

  if (path === "/adminlogs") {
    return <AdminLogs />;
  }

  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;
