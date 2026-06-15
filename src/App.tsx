import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Team from './pages/Team';
import Contact from './pages/Contact';
import AdminDemo from './pages/AdminDemo';

// Helper component to scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="app-wrapper">
        <Navbar />
        <main className="main-content-layout">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminDemo />} />
            {/* Fallback route */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>

      <style>{`
        .app-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .main-content-layout {
          flex-grow: 1;
          background-color: var(--bg-secondary);
        }
      `}</style>
    </Router>
  );
};

export default App;
