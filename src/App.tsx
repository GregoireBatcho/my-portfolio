import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './LanguageContext.js';
import Header from './components/Header.js';
import FooterPanel from './components/FooterPanel.js';
import Home from './views/Home.js';
import About from './views/About.js';
import Projects from './views/Projects.js';
import Experience from './views/Experience.js';
import Contact from './views/Contact.js';
import Admin from './views/Admin.js';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#0b0b0a] text-[#e5e5e0] flex flex-col antialiased selection:bg-copper-500/25 selection:text-white">
          
          {/* Global blur background panels */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-copper-600/3 filter blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#8f3f1e]/2 filter blur-[120px]" />
          </div>

          {/* Floating navigation bar */}
          <Header />

          {/* Core content body */}
          <main className="flex-1 relative z-10 w-full flex flex-col justify-start">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
              {/* Catch-all redirected fallback to dashboard home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Shared design signoff footer */}
          <FooterPanel />

        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}
