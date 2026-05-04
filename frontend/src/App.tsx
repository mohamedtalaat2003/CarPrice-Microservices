import React, { useState, useRef } from 'react';
import { getHandshakeToken, predictPrice, type CarFeatures } from './api';

const defaultFeatures: CarFeatures = {
    wheelBase: 99.8, length: 176.6, width: 66.2, curbWeight: 2337,
    engineSize: 109, bore: 3.19, stroke: 3.4, horsepower: 102,
    peakRpm: 5500, cityMpg: 24, highwayMpg: 30, normalizedLosses: 115,
    symboling: 3, make: 'audi', fuelType: 'gas', driveWheels: 'fwd',
    engineType: 'ohc', numOfCylinders: 'four'
};

const showcase = [
  { brand: 'Audi A4 Premium', year: '2024', price: '$42,500', img: '/assets/audi.png' },
  { brand: 'BMW X5 xDrive', year: '2023', price: '$68,200', img: '/assets/bmw.png' },
  { brand: 'Honda Civic Sport', year: '2024', price: '$26,900', img: '/assets/honda.png' },
  { brand: 'Audi Q5 Prestige', year: '2022', price: '$38,400', img: '/assets/audi.png' },
  { brand: 'BMW M3 Competition', year: '2024', price: '$82,100', img: '/assets/bmw.png' },
  { brand: 'Honda Accord Touring', year: '2023', price: '$34,850', img: '/assets/honda.png' },
];

const App = () => {
  const [features, setFeatures] = useState<CarFeatures>(defaultFeatures);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('basic');
  
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
      setError(err.message || 'System error occurred.');
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
        <div className="container">
          <div className="logo">ELITEVAL.AI</div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <h1>Automotive Intelligence for the Professional Trade.</h1>
            <p>Deploying advanced ML models to deliver 83.3% accurate car valuations in seconds.</p>
            <button className="btn-blue" onClick={() => predictorRef.current?.scrollIntoView({ behavior: 'smooth' })}>Run AI Prediction</button>
          </div>
          <div className="hero-image">
            <img src="/assets/hero.png" alt="Analytics" style={{ width: '100%', borderRadius: '2rem' }} />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="container stats-grid">
          <div className="stat-item"><h3>83.3%</h3><p>MODEL ACCURACY</p></div>
          <div className="stat-item"><h3>1.2M</h3><p>DATA POINTS</p></div>
          <div className="stat-item"><h3>22</h3><p>MAKES SUPPORTED</p></div>
          <div className="stat-item"><h3>24/7</h3><p>MARKET REFRESH</p></div>
        </div>
      </section>

      {/* Showcase */}
      <section className="recent">
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '4rem' }}>Latest Market Valuations</h2>
          <div className="card-grid">
            {showcase.map((car, i) => (
              <div key={i} className="car-card">
                <img src={car.img} alt={car.brand} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontWeight: 700 }}>{car.brand}</h4>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>{car.year}</span>
                </div>
                <div className="car-price">{car.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Predictor */}
      <section className="predictor" ref={predictorRef}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '4rem' }}>Valuation Engine</h2>
          <div className="form-container">
            <form onSubmit={handlePredict}>
              
              <div className="accordion">
                <div className="accordion-header" onClick={() => setActiveAccordion(activeAccordion === 'basic' ? null : 'basic')}>
                  <span>PRIMARY CONFIGURATION</span>
                  <span>{activeAccordion === 'basic' ? '−' : '+'}</span>
                </div>
                {activeAccordion === 'basic' && (
                  <div className="accordion-content">
                    <div className="input-box">
                      <label>Vehicle Make</label>
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
                    <div className="input-box">
                      <label>Drive System</label>
                      <select name="driveWheels" value={features.driveWheels} onChange={handleChange}>
                        <option value="fwd">FRONT-WHEEL DRIVE</option>
                        <option value="rwd">REAR-WHEEL DRIVE</option>
                        <option value="4wd">4-WHEEL DRIVE</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="accordion">
                <div className="accordion-header" onClick={() => setActiveAccordion(activeAccordion === 'engine' ? null : 'engine')}>
                  <span>POWER & PERFORMANCE</span>
                  <span>{activeAccordion === 'engine' ? '−' : '+'}</span>
                </div>
                {activeAccordion === 'engine' && (
                  <div className="accordion-content">
                    <div className="input-box"><label>Horsepower</label><input type="number" name="horsepower" value={features.horsepower} onChange={handleChange} /></div>
                    <div className="input-box"><label>Engine Size (CC)</label><input type="number" name="engineSize" value={features.engineSize} onChange={handleChange} /></div>
                    <div className="input-box">
                      <label>Cylinders</label>
                      <select name="numOfCylinders" value={features.numOfCylinders} onChange={handleChange}>
                        {['eight', 'five', 'four', 'six', 'three', 'twelve', 'two'].map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                      </select>
                    </div>
                    <div className="input-box"><label>Peak RPM</label><input type="number" name="peakRpm" value={features.peakRpm} onChange={handleChange} /></div>
                  </div>
                )}
              </div>

              <div className="accordion">
                <div className="accordion-header" onClick={() => setActiveAccordion(activeAccordion === 'dimensions' ? null : 'dimensions')}>
                  <span>PHYSICAL SPECIFICATIONS</span>
                  <span>{activeAccordion === 'dimensions' ? '−' : '+'}</span>
                </div>
                {activeAccordion === 'dimensions' && (
                  <div className="accordion-content">
                    <div className="input-box"><label>Curb Weight (Lbs)</label><input type="number" name="curbWeight" value={features.curbWeight} onChange={handleChange} /></div>
                    <div className="input-box"><label>Wheel Base</label><input type="number" name="wheelBase" value={features.wheelBase} onChange={handleChange} /></div>
                    <div className="input-box"><label>Length</label><input type="number" name="length" value={features.length} onChange={handleChange} /></div>
                    <div className="input-box"><label>City MPG</label><input type="number" name="cityMpg" value={features.cityMpg} onChange={handleChange} /></div>
                  </div>
                )}
              </div>

              <button type="submit" className="btn-blue" style={{ width: '100%', marginTop: '3rem', padding: '1.5rem', fontSize: '1.2rem' }} disabled={loading}>
                {loading ? 'PROCESSING ML DATA...' : 'GENERATE VALUATION REPORT'}
              </button>
            </form>

            {error && <div style={{ marginTop: '2rem', color: 'red', textAlign: 'center' }}>{error}</div>}

            {price && (
              <div style={{ marginTop: '5rem', textAlign: 'center', padding: '5rem', background: '#f8fafc', borderRadius: '3rem', border: '3px solid var(--primary)' }}>
                <h3 style={{ fontSize: '0.85rem', letterSpacing: '2px', color: '#64748b', marginBottom: '1rem' }}>ESTIMATED MARKET VALUE</h3>
                <div style={{ fontSize: '5.5rem', fontWeight: 900, color: '#0f172a' }}>
                  ${price.toLocaleString()}
                </div>
                <p style={{ color: 'var(--primary)', fontWeight: 800 }}>Model Confidence: 83.3%</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Us */}
      <section className="contact">
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Contact Us</h2>
          <div className="contact-grid">
            <div className="contact-card">
              <img src="/assets/zyad.png" alt="Zyad Refaat" />
              <h4>Zyad Refaat</h4>
              <p>ML Engineer</p>
              <div className="contact-links">
                <a href="https://www.linkedin.com/in/zyad-refaat">LinkedIn</a> | 
                <a href="https://github.com/zyadrefaat2023-gif/Egypt">GitHub</a>
                <div style={{ marginTop: '0.5rem' }}>01224296829</div>
              </div>
            </div>
            <div className="contact-card">
              <img src="/assets/mohamed.png" alt="Mohamed Talaat" />
              <h4>Mohamed Talaat</h4>
              <p>Lead Developer</p>
              <div className="contact-links">
                <a href="https://www.linkedin.com/in/mohamed-talaat-">LinkedIn</a> | 
                <a href="https://github.com/mohamedtalaat2003">GitHub</a>
                <div style={{ marginTop: '0.5rem' }}>01096883659</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ padding: '4rem 0', textAlign: 'center', background: '#0f172a', color: 'white' }}>
        <div className="logo" style={{ marginBottom: '1rem' }}>ELITEVAL.AI</div>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>© 2026 PRECISION AUTOMOTIVE ANALYTICS SOLUTIONS</p>
      </footer>
    </div>
  );
};

export default App;
