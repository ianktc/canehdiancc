import { useEffect, useMemo, useState } from 'react';

const KEYWORDS = [
  'Canada',
  'civic tech',
  'GIS',
  'urban planning',
  'public policy',
  'civil service',
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
          <span className="rotating-word" aria-live="polite">{currentKeyword}</span>
        </h1>
        <a href="#jobs" className="hero-cta">Browse Open Roles ↓</a>
      </div>
    </section>
  );
}
