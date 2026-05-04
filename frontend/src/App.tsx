import React, { useState, useRef } from 'react';
import { getHandshakeToken, predictPrice, type CarFeatures } from './api';

const defaultFeatures: CarFeatures = {
    wheelBase: 99.8, length: 176.6, width: 66.2, curbWeight: 2337,
    engineSize: 109, bore: 3.19, stroke: 3.4, horsepower: 102,
    peakRpm: 5500, cityMpg: 24, highwayMpg: 30, normalizedLosses: 115,
    symboling: 3, make: 'audi', fuelType: 'gas', driveWheels: 'fwd',
    engineType: 'ohc', numOfCylinders: 'four'
};

const carShowcase = [
  { name: 'Audi A4 Elite', price: '$42,500', img: '/assets/audi.png' },
  { name: 'BMW X5 Tech', price: '$68,200', img: '/assets/bmw.png' },
  { name: 'Honda Civic AI', price: '$26,900', img: '/assets/honda.png' },
];

const App = () => {
  const [features, setFeatures] = useState<CarFeatures>(defaultFeatures);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeSec, setActiveSec] = useState<string | null>('basic');
  
  const predictorRef = useRef<HTMLDivElement>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrice(null);
    try {
      const token = await getHandshakeToken();
      const res = await predictPrice(token, features);
      setPrice(res);
    } catch (err: any) {
      setError(err.message || 'System error.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    setFeatures(p => ({ ...p, [name]: type === 'number' ? Number(value) : value }));
  };

  return (
    <div className="container">
      <nav>
        <div className="logo">ELITEVAL.AI</div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <h1>UNVEIL THE REAL VALUE.</h1>
        <p>Industrial-grade machine learning architecture providing instant, professional vehicle valuations with 83.3% precision.</p>
        <button className="btn-main" onClick={() => predictorRef.current?.scrollIntoView({ behavior: 'smooth' })}>START VALUATION</button>
        
        <div className="stats">
          <div className="stat-item"><h3>83.3%</h3><p>PRECISION</p></div>
          <div className="stat-item"><h3>1.2M</h3><p>DATASET</p></div>
          <div className="stat-item"><h3>LIVE</h3><p>MARKET</p></div>
        </div>
      </section>

      {/* Showcase */}
      <div className="card-grid">
        {carShowcase.map((car, i) => (
          <div key={i} className="car-card">
            <img src={car.img} alt={car.name} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: '0.9rem' }}>{car.name}</h4>
              <span style={{ color: '#10b981', fontWeight: 900 }}>{car.price}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Predictor */}
      <div className="form-wrap" ref={predictorRef}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '4rem' }}>Parameters</h2>
        <form onSubmit={handlePredict}>
          <div className="accordion-item">
            <div className="accordion-trigger" onClick={() => setActiveSec(activeSec === 'basic' ? null : 'basic')}>
              <span>01 CONFIGURATION</span>
              <span>{activeSec === 'basic' ? '−' : '+'}</span>
            </div>
            {activeSec === 'basic' && (
              <div style={{ padding: '2rem 0' }}>
                <div className="input-box">
                  <select name="make" value={features.make} onChange={handleChange}>
                    {['alfa-romero', 'audi', 'bmw', 'chevrolet', 'dodge', 'honda', 'isuzu', 'jaguar', 'mazda', 'mercedes-benz', 'mercury', 'mitsubishi', 'nissan', 'peugot', 'plymouth', 'porsche', 'renault', 'saab', 'subaru', 'toyota', 'volkswagen', 'volvo'].map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
                  </select>
                </div>
                <div className="input-box">
                  <select name="fuelType" value={features.fuelType} onChange={handleChange}>
                    <option value="gas">GASOLINE</option>
                    <option value="diesel">DIESEL</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="accordion-item">
            <div className="accordion-trigger" onClick={() => setActiveSec(activeSec === 'engine' ? null : 'engine')}>
              <span>02 PERFORMANCE</span>
              <span>{activeSec === 'engine' ? '−' : '+'}</span>
            </div>
            {activeSec === 'engine' && (
              <div style={{ padding: '2rem 0' }}>
                <div className="input-box">
                  <input type="number" placeholder="Horsepower" name="horsepower" value={features.horsepower} onChange={handleChange} />
                </div>
                <div className="input-box">
                  <input type="number" placeholder="Engine Size" name="engineSize" value={features.engineSize} onChange={handleChange} />
                </div>
              </div>
            )}
          </div>

          <button type="submit" className="btn-main" style={{ width: '100%', marginTop: '3rem' }} disabled={loading}>
            {loading ? 'PROCESSING...' : 'GET AI VALUATION'}
          </button>
        </form>

        {error && <div style={{ color: '#ef4444', marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}

        {price && (
          <div style={{ marginTop: '5rem', textAlign: 'center', padding: '4rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '2rem', border: '1px solid var(--accent)' }}>
            <h3 style={{ fontSize: '0.7rem', letterSpacing: '2px', color: '#94a3b8' }}>ESTIMATED MARKET VALUE</h3>
            <div style={{ fontSize: '5rem', fontWeight: 700, color: 'white', letterSpacing: '-2px' }}>${price.toLocaleString()}</div>
            <p style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '0.8rem' }}>83.3% Accuracy</p>
          </div>
        )}
      </div>

      {/* Contact Us */}
      <section className="contact">
        <h2 style={{ fontSize: '2rem' }}>Contact Us</h2>
        <div className="contact-grid">
          <div className="contact-card">
            <img src="/assets/zyad.png" alt="Zyad" />
            <h4>Zyad Refaat</h4>
            <p>ML Engineer</p>
            <div className="contact-links">
              <a href="https://www.linkedin.com/in/zyad-refaat">LinkedIn</a>
              <a href="https://github.com/zyadrefaat2023-gif/Egypt">GitHub</a>
            </div>
          </div>
          <div className="contact-card">
            <img src="/assets/mohamed.png" alt="Mohamed" />
            <h4>Mohamed Talaat</h4>
            <p>Lead Developer</p>
            <div className="contact-links">
              <a href="https://www.linkedin.com/in/mohamed-talaat-">LinkedIn</a>
              <a href="https://github.com/mohamedtalaat2003">GitHub</a>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ padding: '4rem 0', textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>
        © 2026 ELITEVAL.AI - PROFESSIONAL ANALYTICS
      </footer>
    </div>
  );
};

export default App;
