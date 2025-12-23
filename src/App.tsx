import Hero from './sections/Hero';
import JobGrid from './sections/JobGrid';

export default function App() {
  return (
    <>
      <header className="site-header">
        <div className="container">
          <div className="logo">Canehdian Civic Careers</div>
          <nav className="nav">
            <a href="#jobs" className="nav-link">Browse Jobs</a>
          </nav>
        </div>
      </header>
      <main>
        <Hero />
        <JobGrid />
      </main>
      <footer className="site-footer">
        <div className="container">© {new Date().getFullYear()} Canehdian Civic Careers</div>
      </footer>
    </>
  );
}
