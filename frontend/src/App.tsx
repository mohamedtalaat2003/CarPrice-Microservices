import { useState, useRef } from 'react';
import { type CarFeatures, getHandshakeToken, predictPrice } from './api';

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
  { brand: 'Audi A4 Premium', price: '$35,400', img: '/assets/audi.png' },
  { brand: 'BMW X5 xDrive', price: '$62,900', img: '/assets/bmw.png' },
  { brand: 'Honda Civic Sport', price: '$24,150', img: '/assets/honda.png' },
  { brand: 'Toyota Camry XSE', price: '$28,400', img: '/assets/audi.png' }, // reusing assets for demo
  { brand: 'Porsche 911 GT3', price: '$161,100', img: '/assets/bmw.png' },
  { brand: 'Mercedes C-Class', price: '$44,850', img: '/assets/honda.png' },
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
      setError(err.message || 'Error occurred during valuation.');
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
      <nav className="container">
        <div className="logo">VALUATE PRO</div>
        <div style={{ display: 'flex', gap: '2rem', fontWeight: 600, fontSize: '0.9rem' }}>
          <span>HOME</span>
          <span>ANALYTICS</span>
          <span>RESOURCES</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <h1>CAR PRICE PREDICTION REIMAGINED.</h1>
              <p>Get instant, professional valuations with the world's most advanced automotive AI.</p>
              <button onClick={() => predictorRef.current?.scrollIntoView({ behavior: 'smooth' })} className="btn-blue">TRY IT NOW</button>
            </div>
            <div className="hero-image">
              <img src="/assets/hero.png" alt="Futuristic Analytics" style={{ border: '10px solid rgba(255,255,255,0.1)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="container stats-grid">
          <div className="stat-item"><h3>98.4%</h3><p>ACCURACY</p></div>
          <div className="stat-item"><h3>50ms</h3><p>LATENCY</p></div>
          <div className="stat-item"><h3>22</h3><p>BRANDS</p></div>
          <div className="stat-item"><h3>10K+</h3><p>USERS</p></div>
        </div>
      </section>

      {/* Past Predictions */}
      <section className="recent container">
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '3rem' }}>Past Predictions</h2>
        <div className="card-grid">
          {pastEstimates.map((item, i) => (
            <div key={i} className="car-card">
              <img src={item.img} alt={item.brand} />
              <h4>{item.brand}</h4>
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Engine: 2.8L, Sport Package</p>
              <div className="car-price">{item.price}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Predictor */}
      <section className="predictor" ref={predictorRef}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '3rem', fontWeight: 800, marginBottom: '4rem' }}>Expert Valuation Engine</h2>
          <div className="form-container">
            <form onSubmit={handlePredict}>
              
              {/* Group 1: Basic */}
              <div className="accordion">
                <div className="accordion-header" onClick={() => setActiveSection('basic')}>
                  <span>Basic Details</span>
                  <span>{activeSection === 'basic' ? '−' : '+'}</span>
                </div>
                {activeSection === 'basic' && (
                  <div className="accordion-content">
                    <div className="input-box">
                      <label>Make</label>
                      <select name="make" value={features.make} onChange={handleChange}>
                        <option value="audi">Audi</option>
                        <option value="bmw">BMW</option>
                        <option value="toyota">Toyota</option>
                        <option value="porsche">Porsche</option>
                        <option value="honda">Honda</option>
                      </select>
                    </div>
                    <div className="input-box">
                      <label>Fuel Type</label>
                      <select name="fuelType" value={features.fuelType} onChange={handleChange}>
                        <option value="gas">Gas</option>
                        <option value="diesel">Diesel</option>
                      </select>
                    </div>
                    <div className="input-box">
                      <label>Drive Type</label>
                      <select name="driveWheels" value={features.driveWheels} onChange={handleChange}>
                        <option value="fwd">FWD</option>
                        <option value="rwd">RWD</option>
                        <option value="4wd">4WD</option>
                      </select>
                    </div>
                    <div className="input-box">
                      <label>Symboling (-3 to 3)</label>
                      <input type="number" name="symboling" value={features.symboling} onChange={handleChange} />
                    </div>
                  </div>
                )}
              </div>

              {/* Group 2: Engine */}
              <div className="accordion">
                <div className="accordion-header" onClick={() => setActiveSection('engine')}>
                  <span>Engine & Performance</span>
                  <span>{activeSection === 'engine' ? '−' : '+'}</span>
                </div>
                {activeSection === 'engine' && (
                  <div className="accordion-content">
                    <div className="input-box">
                      <label>Horsepower</label>
                      <input type="number" name="horsepower" value={features.horsepower} onChange={handleChange} />
                    </div>
                    <div className="input-box">
                      <label>Engine Size (CC)</label>
                      <input type="number" name="engineSize" value={features.engineSize} onChange={handleChange} />
                    </div>
                    <div className="input-box">
                      <label>Cylinders</label>
                      <select name="numOfCylinders" value={features.numOfCylinders} onChange={handleChange}>
                        <option value="four">Four</option>
                        <option value="six">Six</option>
                        <option value="eight">Eight</option>
                        <option value="five">Five</option>
                        <option value="twelve">Twelve</option>
                      </select>
                    </div>
                    <div className="input-box">
                      <label>Peak RPM</label>
                      <input type="number" name="peakRpm" value={features.peakRpm} onChange={handleChange} />
                    </div>
                  </div>
                )}
              </div>

              {/* Group 3: Dimensions */}
              <div className="accordion">
                <div className="accordion-header" onClick={() => setActiveSection('dimensions')}>
                  <span>Dimensions & Efficiency</span>
                  <span>{activeSection === 'dimensions' ? '−' : '+'}</span>
                </div>
                {activeSection === 'dimensions' && (
                  <div className="accordion-content">
                    <div className="input-box">
                      <label>Curb Weight (lbs)</label>
                      <input type="number" name="curbWeight" value={features.curbWeight} onChange={handleChange} />
                    </div>
                    <div className="input-box">
                      <label>Wheel Base</label>
                      <input type="number" name="wheelBase" value={features.wheelBase} onChange={handleChange} />
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

              <button type="submit" className="btn-blue" style={{ width: '100%', marginTop: '2rem' }} disabled={loading}>
                {loading ? 'ANALYZING MARKET...' : 'GENERATE EXPERT VALUATION'}
              </button>
            </form>

            {price && (
              <div style={{ marginTop: '3rem', textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '2rem', border: '3px solid #3b82f6', boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.25)' }}>
                <h3 style={{ textTransform: 'uppercase', color: '#64748b', fontSize: '0.9rem', letterSpacing: '2px' }}>Predicted Market Price</h3>
                <div style={{ fontSize: '5rem', fontWeight: 900, color: '#1e293b' }}>
                  ${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <p style={{ color: '#3b82f6', fontWeight: 700 }}>AI Accuracy: 98.4% Confidence</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer style={{ padding: '4rem 0', textAlign: 'center', background: 'white', borderTop: '1px solid var(--border)' }}>
        <p style={{ fontWeight: 800 }}>© 2026 VALUATE PRO - AUTOMOTIVE INTELLIGENCE AGENCY</p>
      </footer>
    </div>
  );
};

export default App;
