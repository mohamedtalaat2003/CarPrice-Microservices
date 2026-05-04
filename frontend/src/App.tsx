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
  { name: 'Audi A4 Premium', price: '$42,500', img: '/assets/audi.png' },
  { name: 'BMW X5 xDrive', price: '$68,200', img: '/assets/bmw.png' },
  { name: 'Honda Civic Sport', price: '$26,900', img: '/assets/honda.png' },
  { name: 'Mercedes C300', price: '$45,800', img: '/assets/audi.png' },
  { name: 'Porsche Macan', price: '$61,200', img: '/assets/bmw.png' },
  { name: 'Toyota Camry XSE', price: '$32,150', img: '/assets/honda.png' },
];

const App = () => {
  const [features, setFeatures] = useState<CarFeatures>(defaultFeatures);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>('basic');
  
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
    <div>
      <nav>
        <div className="logo">CARPRICE.AI</div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <h1>PREDICT YOUR CAR'S VALUE WITH PRECISION.</h1>
            <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '3rem' }}>
              Our advanced Machine Learning algorithms analyze over 50 technical parameters to give you the most accurate market valuation in real-time.
            </p>
            <button className="btn-primary" onClick={() => predictorRef.current?.scrollIntoView({ behavior: 'smooth' })}>Launch AI Estimator</button>
          </div>
          <div className="hero-image">
            <img src="/assets/hero.png" alt="Dashboard" style={{ width: '100%', borderRadius: '3rem' }} />
          </div>
        </div>
      </section>

      {/* Accuracy Stats */}
      <section className="stats">
        <div className="container stats-grid">
          <div className="stat-card"><h3>83.3%</h3><p>MODEL ACCURACY</p></div>
          <div className="stat-card"><h3>1.2M</h3><p>DATAPOINTS</p></div>
          <div className="stat-card"><h3>22</h3><p>MAKES SUPPORTED</p></div>
          <div className="stat-card"><h3>Live</h3><p>MARKET UPDATES</p></div>
        </div>
      </section>

      {/* Showcase */}
      <section className="recent container">
        <h2 style={{ fontSize: '3rem', marginBottom: '4rem', textAlign: 'center' }}>Latest Market Benchmarks</h2>
        <div className="card-grid">
          {carShowcase.map((car, i) => (
            <div key={i} className="car-card">
              <img src={car.img} alt={car.name} />
              <h4 style={{ marginBottom: '0.5rem' }}>{car.name}</h4>
              <div style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 900 }}>{car.price}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Predictor */}
      <section className="predictor" ref={predictorRef}>
        <div className="container">
          <div className="form-card">
            <h2 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '4rem' }}>Configure Your Prediction</h2>
            <form onSubmit={handlePredict}>
              
              <div className="accordion">
                <div className="accordion-header" onClick={() => setActiveSection(activeSection === 'basic' ? null : 'basic')}>
                  <span>1. BASIC SPECIFICATIONS</span>
                  <span>{activeSection === 'basic' ? '−' : '+'}</span>
                </div>
                {activeSection === 'basic' && (
                  <div className="accordion-content">
                    <div className="input-box">
                      <label>Make / Brand</label>
                      <select name="make" value={features.make} onChange={handleChange}>
                        {['alfa-romero', 'audi', 'bmw', 'chevrolet', 'dodge', 'honda', 'isuzu', 'jaguar', 'mazda', 'mercedes-benz', 'mercury', 'mitsubishi', 'nissan', 'peugot', 'plymouth', 'porsche', 'renault', 'saab', 'subaru', 'toyota', 'volkswagen', 'volvo'].map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
                      </select>
                    </div>
                    <div className="input-box">
                      <label>Fuel Type</label>
                      <select name="fuelType" value={features.fuelType} onChange={handleChange}>
                        <option value="gas">GASOLINE</option>
                        <option value="diesel">DIESEL</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="accordion">
                <div className="accordion-header" onClick={() => setActiveSection(activeSection === 'engine' ? null : 'engine')}>
                  <span>2. ENGINE PERFORMANCE</span>
                  <span>{activeSection === 'engine' ? '−' : '+'}</span>
                </div>
                {activeSection === 'engine' && (
                  <div className="accordion-content">
                    <div className="input-box">
                      <label>Horsepower</label>
                      <input type="number" name="horsepower" value={features.horsepower} onChange={handleChange} />
                    </div>
                    <div className="input-box">
                      <label>Engine Size</label>
                      <input type="number" name="engineSize" value={features.engineSize} onChange={handleChange} />
                    </div>
                  </div>
                )}
              </div>

              <div className="accordion">
                <div className="accordion-header" onClick={() => setActiveSection(activeSection === 'physical' ? null : 'physical')}>
                  <span>3. PHYSICAL PARAMETERS</span>
                  <span>{activeSection === 'physical' ? '−' : '+'}</span>
                </div>
                {activeSection === 'physical' && (
                  <div className="accordion-content">
                    <div className="input-box">
                      <label>Curb Weight</label>
                      <input type="number" name="curbWeight" value={features.curbWeight} onChange={handleChange} />
                    </div>
                    <div className="input-box">
                      <label>City MPG</label>
                      <input type="number" name="cityMpg" value={features.cityMpg} onChange={handleChange} />
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '3rem', padding: '1.5rem' }} disabled={loading}>
                {loading ? 'ANALYZING...' : 'RUN AI VALUATION'}
              </button>
            </form>

            {error && <div style={{ color: 'red', marginTop: '2rem', textAlign: 'center' }}>{error}</div>}

            {price && (
              <div style={{ marginTop: '5rem', textAlign: 'center', padding: '4rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '2rem', border: '2px solid var(--primary)' }}>
                <h3 style={{ fontSize: '0.9rem', letterSpacing: '2px', color: '#94a3b8' }}>ESTIMATED MARKET PRICE</h3>
                <div style={{ fontSize: '6rem', fontWeight: 900, color: 'white' }}>${price.toLocaleString()}</div>
                <p style={{ color: 'var(--primary)', fontWeight: 800 }}>83.3% Accuracy Confidence</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team">
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '3.5rem', fontWeight: 900 }}>Meet The Experts</h2>
          <div className="team-grid">
            <div className="team-member">
              <img src="/assets/zyad.png" alt="Zyad Refaat" />
              <h4>Zyad Refaat</h4>
              <p>Machine Learning Engineer</p>
              <div className="social-links">
                <a href="https://www.linkedin.com/in/zyad-refaat">LinkedIn</a>
                <a href="https://github.com/zyadrefaat2023-gif/Egypt">GitHub</a>
                <span>01224296829</span>
              </div>
            </div>
            <div className="team-member">
              <img src="/assets/mohamed.png" alt="Mohamed Talaat" />
              <h4>Mohamed Talaat</h4>
              <p>Lead System Architect</p>
              <div className="social-links">
                <a href="https://www.linkedin.com/in/mohamed-talaat-">LinkedIn</a>
                <a href="https://github.com/mohamedtalaat2003">GitHub</a>
                <span>01096883659</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ padding: '6rem 0', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <div className="logo" style={{ marginBottom: '1rem' }}>CARPRICE.AI</div>
        <p style={{ color: '#94a3b8' }}>© 2026 AUTOMOTIVE ANALYTICS SOLUTIONS</p>
      </footer>
    </div>
  );
};

export default App;
