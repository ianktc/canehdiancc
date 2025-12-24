import { Link, Route, Routes } from 'react-router-dom';
import Hero from './sections/Hero';
import JobGrid from './sections/JobGrid';
import JobsPage from './pages/JobsPage';
import JobPostingPage from './pages/JobPostingPage';

function HomePage() {
  return (
    <main>
      <Hero />
      <JobGrid />
    </main>
  );
}

export default function App() {
  return (
    <>
      <header className="site-header">
        <div className="container">
          <div className="logo">
            <Link to="/" className='nav-link'>Canehdian Civic Careers</Link>
          </div>
          <nav className="nav">
            <Link to="/jobs" className="nav-link">Browse Jobs</Link>
          </nav>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobPostingPage />} />
      </Routes>
      <footer className="site-footer">
        <div className="container">© {new Date().getFullYear()} Canehdian Civic Careers</div>
      </footer>
    </>
  );
}
