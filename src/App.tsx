import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useThemeStore, useUserStore } from "@stores/dashboardStore";
import { Layout } from "@components/Layout";
import { Dashboard } from "@components/Dashboard";
import { LeadsPage } from "@components/LeadsPage";
import { SourcesPage } from "@components/SourcesPage";
import { getInitials } from "@utils/helpers";
import "./App.css";

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const theme = useThemeStore((state) => state.theme);
  const setUser = useUserStore((state) => state.setUser);

  // Initialize user and theme
  useEffect(() => {
    // Set user
    setUser({
      id: "1",
      name: "Alex Rivera",
      email: "alex.rivera@company.com",
      role: "Sales Manager",
      initials: getInitials("Alex Rivera"),
    });

    // Apply theme
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme, setUser]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/sources" element={<SourcesPage />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </BrowserRouter>
  );
}
