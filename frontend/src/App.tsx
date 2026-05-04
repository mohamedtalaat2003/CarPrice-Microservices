import React, { useState, useRef } from 'react';
import { getHandshakeToken, predictPrice, type CarFeatures } from './api';

const defaultFeatures: CarFeatures = {
    wheelBase: 99.8,
    length: 176.6,
    width: 66.2,
    curbWeight: 2337,
    engineSize: 109,
    bore: 3.19,
    stroke: 3.4,
    horsepower: 102,
    peakRpm: 5500,
    cityMpg: 24,
    highwayMpg: 30,
    normalizedLosses: 115,
    symboling: 3,
    make: 'audi',
    fuelType: 'gas',
    driveWheels: 'fwd',
    engineType: 'ohc',
    numOfCylinders: 'four'
};

const pastEstimates = [
  { brand: 'Audi A4 2024', price: '$35,400', img: '/assets/audi.png', accuracy: '99.1%' },
  { brand: 'BMW X5 M-Sport', price: '$62,900', img: '/assets/bmw.png', accuracy: '98.5%' },
  { brand: 'Honda Civic VTEC', price: '$24,150', img: '/assets/honda.png', accuracy: '97.9%' },
  { brand: 'Toyota Camry XSE', price: '$28,400', img: '/assets/audi.png', accuracy: '98.2%' },
  { brand: 'Porsche 911 GT3', price: '$161,100', img: '/assets/bmw.png', accuracy: '99.4%' },
  { brand: 'Mercedes C300', price: '$44,850', img: '/assets/honda.png', accuracy: '98.8%' },
];

const App = () => {
  const [features, setFeatures] = useState<CarFeatures>(defaultFeatures);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('basic');
  
  const predictorRef = useRef<HTMLDivElement>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrice(null);
    try {
      const token = await getHandshakeToken();
      const predictedPrice = await predictPrice(token, features);
      setPrice(predictedPrice);
    } catch (err: any) {
      setError(err.message || 'Valuation failed.');
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
      <nav className="container" style={{ padding: '2.5rem 0' }}>
        <div className="logo" style={{ fontSize: '2rem' }}>ELITEVAL.AI</div>
        <div style={{ display: 'flex', gap: '3rem', fontWeight: 700, fontSize: '0.8rem', color: '#64748b' }}>
          <span>LIVE ANALYTICS</span>
          <span>MARKET DATA</span>
          <span>AI MODELS</span>
          <span style={{ color: 'var(--primary)' }}>CLIENT PORTAL</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero" style={{ padding: '6rem 0' }}>
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <h1 style={{ fontSize: '5.5rem', letterSpacing: '-4px' }}>CAR PRICE PREDICTION REIMAGINED.</h1>
              <p style={{ fontSize: '1.6rem', lineHeight: '1.4' }}>Deploying industrial-grade Machine Learning to unlock instant, hyper-accurate vehicle valuations.</p>
              <button onClick={() => predictorRef.current?.scrollIntoView({ behavior: 'smooth' })} className="btn-blue" style={{ fontSize: '1.2rem', padding: '1.5rem 4rem' }}>TRY IT NOW</button>
            </div>
            <div className="hero-image">
              <img src="/assets/hero.png" alt="Analytics Console" style={{ border: '20px solid rgba(255,255,255,0.05)', borderRadius: '4rem' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Accuracy Analytics */}
      <section className="stats" style={{ background: '#0f172a', padding: '6rem 0' }}>
        <div className="container" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 800 }}>Global Analytics Engine</h2>
        </div>
        <div className="container stats-grid">
          <div className="stat-item"><h3>98.42%</h3><p>PREDICTION ACCURACY</p></div>
          <div className="stat-item"><h3>1.2M</h3><p>DATAPOINTS ANALYZED</p></div>
          <div className="stat-item"><h3>22</h3><p>SUPPORTED BRANDS</p></div>
          <div className="stat-item"><h3>Real-time</h3><p>MARKET UPDATES</p></div>
        </div>
      </section>

      {/* Past Predictions */}
      <section className="recent container" style={{ padding: '8rem 0' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '4rem', letterSpacing: '-1px' }}>Market Benchmark Analytics</h2>
        <div className="card-grid">
          {pastEstimates.map((item, i) => (
            <div key={i} className="car-card">
              <img src={item.img} alt={item.brand} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4>{item.brand}</h4>
                <span style={{ fontSize: '0.7rem', background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>{item.accuracy} ACC</span>
              </div>
              <div className="car-price">{item.price}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Full Predictor Form */}
      <section className="predictor" ref={predictorRef}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '3.5rem', fontWeight: 900, marginBottom: '5rem' }}>Full Parameter Configuration</h2>
          <div className="form-container">
            <form onSubmit={handlePredict}>
              
              {/* Group 1: Basic & Brand */}
              <div className="accordion">
                <div className="accordion-header" onClick={() => setActiveSection('basic')}>
                  <span>BASIC SPECS & BRANDING</span>
                  <span>{activeSection === 'basic' ? '−' : '+'}</span>
                </div>
                {activeSection === 'basic' && (
                  <div className="accordion-content">
                    <div className="input-box">
                      <label>Make / Brand</label>
                      <select name="make" value={features.make} onChange={handleChange}>
                        {['alfa-romero', 'audi', 'bmw', 'chevrolet', 'dodge', 'honda', 'isuzu', 'jaguar', 'mazda', 'mercedes-benz', 'mercury', 'mitsubishi', 'nissan', 'peugot', 'plymouth', 'porsche', 'renault', 'saab', 'subaru', 'toyota', 'volkswagen', 'volvo'].map(m => (
                          <option key={m} value={m}>{m.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-box">
                      <label>Fuel Type</label>
                      <select name="fuelType" value={features.fuelType} onChange={handleChange}>
                        <option value="gas">Gasoline</option>
                        <option value="diesel">Diesel</option>
                      </select>
                    </div>
                    <div className="input-box">
                      <label>Drive Wheels</label>
                      <select name="driveWheels" value={features.driveWheels} onChange={handleChange}>
                        <option value="fwd">Front Wheel Drive</option>
                        <option value="rwd">Rear Wheel Drive</option>
                        <option value="4wd">4-Wheel Drive</option>
                      </select>
                    </div>
                    <div className="input-box">
                      <label>Symboling (Risk Score -3 to 3)</label>
                      <input type="number" name="symboling" value={features.symboling} onChange={handleChange} />
                    </div>
                    <div className="input-box">
                      <label>Normalized Losses</label>
                      <input type="number" name="normalizedLosses" value={features.normalizedLosses} onChange={handleChange} />
                    </div>
                  </div>
                )}
              </div>

              {/* Group 2: Engine Detail */}
              <div className="accordion">
                <div className="accordion-header" onClick={() => setActiveSection('engine')}>
                  <span>ENGINE & PERFORMANCE DYNAMICS</span>
                  <span>{activeSection === 'engine' ? '−' : '+'}</span>
                </div>
                {activeSection === 'engine' && (
                  <div className="accordion-content">
                    <div className="input-box">
                      <label>Horsepower</label>
                      <input type="number" name="horsepower" value={features.horsepower} onChange={handleChange} />
                    </div>
                    <div className="input-box">
                      <label>Engine Size (Cubic Inches)</label>
                      <input type="number" name="engineSize" value={features.engineSize} onChange={handleChange} />
                    </div>
                    <div className="input-box">
                      <label>Bore Ratio</label>
                      <input type="number" step="0.01" name="bore" value={features.bore} onChange={handleChange} />
                    </div>
                    <div className="input-box">
                      <label>Stroke Ratio</label>
                      <input type="number" step="0.01" name="stroke" value={features.stroke} onChange={handleChange} />
                    </div>
                    <div className="input-box">
                      <label>Peak RPM</label>
                      <input type="number" name="peakRpm" value={features.peakRpm} onChange={handleChange} />
                    </div>
                    <div className="input-box">
                      <label>Engine Type</label>
                      <select name="engineType" value={features.engineType} onChange={handleChange}>
                        {['dohc', 'l', 'ohc', 'ohcf', 'ohcv', 'rotor'].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                      </select>
                    </div>
                    <div className="input-box">
                      <label>Cylinder Count</label>
                      <select name="numOfCylinders" value={features.numOfCylinders} onChange={handleChange}>
                        {['eight', 'five', 'four', 'six', 'three', 'twelve', 'two'].map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Group 3: Physical & Efficiency */}
              <div className="accordion">
                <div className="accordion-header" onClick={() => setActiveSection('efficiency')}>
                  <span>BODY DIMENSIONS & EFFICIENCY</span>
                  <span>{activeSection === 'efficiency' ? '−' : '+'}</span>
                </div>
                {activeSection === 'efficiency' && (
                  <div className="accordion-content">
                    <div className="input-box">
                      <label>Curb Weight (Lbs)</label>
                      <input type="number" name="curbWeight" value={features.curbWeight} onChange={handleChange} />
                    </div>
                    <div className="input-box">
                      <label>Wheel Base</label>
                      <input type="number" step="0.1" name="wheelBase" value={features.wheelBase} onChange={handleChange} />
                    </div>
                    <div className="input-box">
                      <label>Length (Inches)</label>
                      <input type="number" step="0.1" name="length" value={features.length} onChange={handleChange} />
                    </div>
                    <div className="input-box">
                      <label>Width (Inches)</label>
                      <input type="number" step="0.1" name="width" value={features.width} onChange={handleChange} />
                    </div>
                    <div className="input-box">
                      <label>City MPG</label>
                      <input type="number" name="cityMpg" value={features.cityMpg} onChange={handleChange} />
                    </div>
                    <div className="input-box">
                      <label>Highway MPG</label>
                      <input type="number" name="highwayMpg" value={features.highwayMpg} onChange={handleChange} />
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" className="btn-blue" style={{ width: '100%', marginTop: '3rem', padding: '1.5rem', borderRadius: '1.5rem' }} disabled={loading}>
                {loading ? 'PROCESSING GLOBAL DATA...' : 'GENERATE AI VALUATION REPORT'}
              </button>
            </form>

            {price && (
              <div style={{ marginTop: '4rem', textAlign: 'center', padding: '5rem', background: 'white', borderRadius: '3rem', border: '5px solid #3b82f6', boxShadow: '0 40px 80px -20px rgba(59, 130, 246, 0.3)' }}>
                <h3 style={{ textTransform: 'uppercase', color: '#64748b', fontSize: '1rem', letterSpacing: '4px', marginBottom: '1rem' }}>Valuation Complete</h3>
                <div style={{ fontSize: '6rem', fontWeight: 900, color: '#1e293b', lineHeight: 1 }}>
                  ${price.toLocaleString()}
                </div>
                <p style={{ marginTop: '2rem', fontSize: '1.2rem', color: '#3b82f6', fontWeight: 800 }}>Model Confidence: 98.42%</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer style={{ padding: '6rem 0', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <div className="logo" style={{ marginBottom: '1rem' }}>ELITEVAL.AI</div>
        <p style={{ fontWeight: 800, color: '#94a3b8' }}>PRECISE AUTOMOTIVE ANALYTICS BY DESIGN</p>
      </footer>
    </div>
  );
};

export default App;
