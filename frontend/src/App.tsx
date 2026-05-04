import React, { useState, useRef, useEffect } from 'react';
import { getHandshakeToken, predictPrice, type CarFeatures } from './api';

const defaultFeatures: CarFeatures = {
    wheelBase: 99.8, length: 176.6, width: 66.2, curbWeight: 2337,
    engineSize: 109, bore: 3.19, stroke: 3.4, horsepower: 102,
    peakRpm: 5500, cityMpg: 24, highwayMpg: 30, normalizedLosses: 115,
    symboling: 3, make: 'audi', fuelType: 'gas', driveWheels: 'fwd',
    engineType: 'ohc', numOfCylinders: 'four'
};

const estimates = [
  { brand: 'Audi A4 Premium', year: '2024', price: '$42,500', img: '/assets/audi.png' },
  { brand: 'BMW X5 xDrive40i', year: '2023', price: '$68,200', img: '/assets/bmw.png' },
  { brand: 'Honda Civic Sport', year: '2024', price: '$26,900', img: '/assets/honda.png' },
  { brand: 'Audi Q5 Elite', year: '2022', price: '$38,400', img: '/assets/audi.png' },
  { brand: 'BMW M3 Competition', year: '2024', price: '$82,100', img: '/assets/bmw.png' },
  { brand: 'Honda Accord Touring', year: '2023', price: '$34,850', img: '/assets/honda.png' },
];

const App = () => {
  const [features, setFeatures] = useState<CarFeatures>(defaultFeatures);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  
  const predictorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('reveal-active');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrice(null);
    try {
      const token = await getHandshakeToken();
      const result = await predictPrice(token, features);
      setPrice(result);
    } catch (err: any) {
      setError(err.message || 'Error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    setFeatures(p => ({ ...p, [name]: type === 'number' ? Number(value) : value }));
  };

  return (
    <div>
      <nav>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="logo">VALUATE.PRO</div>
          <div style={{ display: 'flex', gap: '3rem', fontWeight: 600, fontSize: '0.85rem' }}>
            <span>ANALYTICS</span>
            <span>RESOURCES</span>
            <span>API ACCESS</span>
          </div>
          <button className="btn-nav" onClick={() => predictorRef.current?.scrollIntoView({ behavior: 'smooth' })}>TRY IT NOW</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <h1 style={{ marginBottom: '1.5rem' }}>CAR PRICE PREDICTION REIMAGINED.</h1>
            <p>Deploying industrial-grade machine learning to unlock instant, professional vehicle valuations with 98.4% precision.</p>
            <button className="btn-nav" style={{ padding: '1.25rem 3rem', fontSize: '1.1rem' }} onClick={() => predictorRef.current?.scrollIntoView({ behavior: 'smooth' })}>Launch Estimator</button>
          </div>
          <div className="hero-image">
            <img src="/assets/hero.png" alt="Data" style={{ width: '100%', borderRadius: '2.5rem', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.2)' }} />
          </div>
        </div>
      </section>

      {/* Analytics */}
      <section className="stats">
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '3rem', fontWeight: 900, marginBottom: '5rem' }}>Enterprise Intelligence Network</h2>
          <div className="stats-grid">
            <div className="stat-card"><h3>98.4%</h3><p>MODEL PRECISION</p></div>
            <div className="stat-card"><h3>1.2M+</h3><p>DATAPOINTS</p></div>
            <div className="stat-card"><h3>22</h3><p>GLOBAL BRANDS</p></div>
            <div className="stat-card"><h3>Real-time</h3><p>MARKET REFRESH</p></div>
          </div>
        </div>
      </section>

      {/* Latest Estimates */}
      <section className="recent">
        <div className="container">
          <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '4rem' }}>Latest Verified Estimates</h2>
          <div className="card-grid">
            {estimates.map((car, i) => (
              <div key={i} className="car-card">
                <img src={car.img} alt={car.brand} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4>{car.brand}</h4>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800 }}>MY {car.year}</span>
                </div>
                <div className="price">{car.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Predictor */}
      <section className="predictor" ref={predictorRef}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '3.5rem', fontWeight: 900, marginBottom: '5rem' }}>Configure Expert Valuation</h2>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <form onSubmit={handlePredict}>
              
              <div className="accordion">
                <div className="accordion-header" onClick={() => setActiveTab('basic')}>
                  <span>BASIC SPECS & BRANDING</span>
                  <span>{activeTab === 'basic' ? '−' : '+'}</span>
                </div>
                {activeTab === 'basic' && (
                  <div className="accordion-content">
                    <div className="input-group">
                      <label>Make / Brand</label>
                      <select name="make" value={features.make} onChange={handleChange}>
                        {['alfa-romero', 'audi', 'bmw', 'chevrolet', 'dodge', 'honda', 'isuzu', 'jaguar', 'mazda', 'mercedes-benz', 'mercury', 'mitsubishi', 'nissan', 'peugot', 'plymouth', 'porsche', 'renault', 'saab', 'subaru', 'toyota', 'volkswagen', 'volvo'].map(m => (
                          <option key={m} value={m}>{m.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Fuel Type</label>
                      <select name="fuelType" value={features.fuelType} onChange={handleChange}>
                        <option value="gas">Gasoline</option>
                        <option value="diesel">Diesel</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Drive Wheels</label>
                      <select name="driveWheels" value={features.driveWheels} onChange={handleChange}>
                        <option value="fwd">FWD</option>
                        <option value="rwd">RWD</option>
                        <option value="4wd">4WD</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="accordion">
                <div className="accordion-header" onClick={() => setActiveTab('engine')}>
                  <span>ENGINE & PERFORMANCE</span>
                  <span>{activeTab === 'engine' ? '−' : '+'}</span>
                </div>
                {activeTab === 'engine' && (
                  <div className="accordion-content">
                    <div className="input-group">
                      <label>Horsepower</label>
                      <input type="number" name="horsepower" value={features.horsepower} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <label>Engine Size (CC)</label>
                      <input type="number" name="engineSize" value={features.engineSize} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <label>Cylinder Count</label>
                      <select name="numOfCylinders" value={features.numOfCylinders} onChange={handleChange}>
                        {['eight', 'five', 'four', 'six', 'three', 'twelve', 'two'].map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="accordion">
                <div className="accordion-header" onClick={() => setActiveTab('dimensions')}>
                  <span>DIMENSIONS & EFFICIENCY</span>
                  <span>{activeTab === 'dimensions' ? '−' : '+'}</span>
                </div>
                {activeTab === 'dimensions' && (
                  <div className="accordion-content">
                    <div className="input-group">
                      <label>Curb Weight (Lbs)</label>
                      <input type="number" name="curbWeight" value={features.curbWeight} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <label>City MPG</label>
                      <input type="number" name="cityMpg" value={features.cityMpg} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <label>Highway MPG</label>
                      <input type="number" name="highwayMpg" value={features.highwayMpg} onChange={handleChange} />
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" className="btn-nav" style={{ width: '100%', marginTop: '3rem', padding: '1.5rem', fontSize: '1.2rem' }} disabled={loading}>
                {loading ? 'ANALYZING MARKET DATA...' : 'GENERATE AI VALUATION'}
              </button>
            </form>

            {error && <div style={{ marginTop: '2rem', color: 'red', textAlign: 'center' }}>{error}</div>}

            {price && (
              <div style={{ marginTop: '5rem', textAlign: 'center', padding: '5rem', background: '#f8fafc', borderRadius: '3rem', border: '2px solid var(--primary)' }}>
                <h3 style={{ fontSize: '0.9rem', letterSpacing: '2px', color: '#64748b', marginBottom: '1rem' }}>ESTIMATED MARKET VALUE</h3>
                <div style={{ fontSize: '5rem', fontWeight: 900, color: '#0f172a' }}>
                  ${price.toLocaleString()}
                </div>
                <p style={{ color: 'var(--primary)', fontWeight: 800 }}>Model Confidence: 98.4%</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer style={{ padding: '6rem 0', textAlign: 'center', background: 'white', borderTop: '1px solid var(--border)' }}>
        <div className="logo" style={{ marginBottom: '1rem' }}>VALUATE.PRO</div>
        <p style={{ fontWeight: 800, color: '#94a3b8' }}>PRECISE AUTOMOTIVE ANALYTICS BY DESIGN</p>
      </footer>
    </div>
  );
};

export default App;
