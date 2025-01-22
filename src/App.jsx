import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import ArtistsCarousel from "./components/ArtistsCarousel";
import About from "./components/About";
import ArtistsPage from "./ArtistsPage";
import ArtistBio from "./ArtistBio";
import ApplyForm from "./ApplyForm";
import Login from "./components/Login";
import IndustryProsPage from "./IndustryProsPage";
import industryPros from "./industryPros";
import IndustryProBio from "./IndustryProBio";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Account from "./components/Account";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const ScrollToHashElement = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  return null;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable refetching on window focus
      retry: 1, // Only retry failed requests once
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <SpeedInsights />
          <Analytics />
          <ScrollToHashElement />
          <div className="min-h-screen bg-covenPurple flex flex-col">
            <Navigation />
            <main className="flex-grow">
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <HeroSection />
                      <ArtistsCarousel />
                      <About />
                    </>
                  }
                />
                <Route
                  path="/artists"
                  element={
                    <ProtectedRoute>
                      <ArtistsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/industry-pros"
                  element={
                    <ProtectedRoute>
                      <IndustryProsPage industryPros={industryPros} />
                    </ProtectedRoute>
                  }
                />
                <Route path="/apply" element={<ApplyForm />}>
                  <Route path="artist" element={<ApplyForm />} />
                  <Route path="industry" element={<ApplyForm />} />
                  <Route path="instrumentalist" element={<ApplyForm />} />
                </Route>
                <Route
                  path="/login"
                  element={<Login title="Sign Up or Login" />}
                />
                <Route
                  path="/artists/:artistId"
                  element={
                    <ProtectedRoute>
                      <ArtistBio />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pros/:proName"
                  element={<IndustryProBio industryPros={industryPros} />}
                />
                <Route
                  path="/account"
                  element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
