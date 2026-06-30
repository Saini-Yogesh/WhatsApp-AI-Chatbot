import React, { createContext, useContext, useState, useEffect } from "react";

// Context for Router
const RouterContext = createContext(null);

// Router Provider component
export function RouterProvider({ children }) {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (to) => {
    if (window.location.pathname !== to) {
      window.history.pushState(null, "", to);
      setPath(to);
      // Scroll to top on navigation
      window.scrollTo(0, 0);
    }
  };

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

// Hook to access router
export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within a RouterProvider");
  }
  return context;
}

// Link component for navigation
export function Link({ to, children, className, activeClassName, ...props }) {
  const { path, navigate } = useRouter();
  
  const handleClick = (e) => {
    // Keep default behavior for external links or if modified click (cmd/ctrl click)
    if (
      to.startsWith("http") || 
      to.startsWith("//") || 
      e.defaultPrevented || 
      e.button !== 0 || 
      e.metaKey || 
      e.altKey || 
      e.ctrlKey || 
      e.shiftKey
    ) {
      return;
    }
    
    e.preventDefault();
    navigate(to);
  };

  const isActive = path === to || (to !== "/" && path.startsWith(to));
  const combinedClassName = `${className || ""} ${isActive && activeClassName ? activeClassName : ""}`.trim();

  return (
    <a href={to} onClick={handleClick} className={combinedClassName} {...props}>
      {children}
    </a>
  );
}
