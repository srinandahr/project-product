import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import DSA from './pages/DSA';
import Projects from './pages/Projects';

export default function App() {
  return (
    <Router>
      <div className="bg-purple-100 min-h-screen">
        <nav className="bg-purple-700 text-white p-4 flex flex-wrap gap-4 justify-center">
          <Link to="/" className="font-semibold hover:text-yellow-300">Dashboard</Link>
          <Link to="/jobs" className="font-semibold hover:text-yellow-300">Jobs</Link>
          <Link to="/dsa" className="font-semibold hover:text-yellow-300">DSA</Link>
          <Link to="/projects" className="font-semibold hover:text-yellow-300">Projects</Link>
        </nav>

        <div className="p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/dsa" element={<DSA />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
