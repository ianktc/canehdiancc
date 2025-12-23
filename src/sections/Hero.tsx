import { useEffect, useMemo, useState } from 'react';

const KEYWORDS = [
  'Canada',
  'civic tech',
  'urban planning',
  'public policy',
  'civil service',
  'housing',
  'GIS',
  'transportation',
];

const ROTATE_MS = 2000;

export default function Hero() {
  const keywords = useMemo(() => KEYWORDS, []);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (keywords.length === 0) return undefined;

    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % keywords.length);
    }, ROTATE_MS);

    return () => window.clearInterval(id);
  }, [keywords.length]);

  const currentKeyword = keywords[index] ?? '';

  return (
    <section className="hero">
      <div className="container">
        <h1>
          Can<span style={{ color: '#ff5c5c' }}>eh</span>dian Civic Careers in{' '}
        </h1>
        <h1><span className="rotating-word" aria-live="polite">{currentKeyword}</span></h1>
        <p>Maybe you're an urbanist, community organizer, social good advocate, policy whiz or civic technologist. 
          Maybe you studied journalism, nursing, computer science, anthropology or engineering and you're not 
          sure how to pursue a civic career in the space. <br></br><br></br> So where are all the jobs eh? 
          <br></br><br></br> Canehdian Civic Careers is a place to explore roles that blend civic interest 
          with <em>any</em> skillset, because serving your community can be immensely fulfilling! </p>
        <a href="#jobs" className="hero-cta">Browse Open Roles ↓</a>
      </div>
    </section>
  );
}
