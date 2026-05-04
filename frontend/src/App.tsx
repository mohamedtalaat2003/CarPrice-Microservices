import { useState, useRef } from 'react';
import { type CarFeatures, getHandshakeToken, predictPrice } from './api';

const defaultFeatures: CarFeatures = {
    make: 'audi',
    fuelType: 'gas',
    aspiration: 'std',
    numOfDoors: 'four',
    bodyStyle: 'sedan',
    driveWheels: 'fwd',
    engineLocation: 'front',
    wheelBase: 99.8,
    length: 176.6,
    width: 66.2,
    height: 54.3,
    curbWeight: 2337,
    engineType: 'ohc',
    numOfCylinders: 'four',
    engineSize: 109,
    fuelSystem: 'mpfi',
    bore: 3.19,
    stroke: 3.4,
    compressionRatio: 10,
    horsepower: 102,
    peakRpm: 5500,
    cityMpg: 24,
    highwayMpg: 30
};

const pastEstimates = [
  { brand: 'Audi A4 Premium', price: '$35,400', img: '/assets/audi.png' },
  { brand: 'BMW X5 xDrive', price: '$62,900', img: '/assets/bmw.png' },
  { brand: 'Honda Civic Sport', price: '$24,150', img: '/assets/honda.png' },
];

const App = () => {
  const [features, setFeatures] = useState<CarFeatures>(defaultFeatures);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  
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
      <nav className="container">
        <div className="logo">AUTOVAL.AI</div>
        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>ENTERPRISE DATA SOLUTIONS</div>
      </nav>

      {/* Hero */}
      <section className="hero container">
        <div className="hero-grid">
          <div className="hero-content">
            <h1>Precision Pricing. In One Click.</h1>
            <p>Harness industrial-grade AI to decode car market values. With a 98.4% precision rate, we provide the most reliable data for buyers and sellers worldwide.</p>
            <button onClick={() => predictorRef.current?.scrollIntoView({ behavior: 'smooth' })} className="btn-main">Get Valuation</button>
          </div>
          <div className="hero-image">
            <img src="/assets/hero.png" alt="Data Analytics" />
          </div>
        </div>
      </section>

      {/* Analytics Banner */}
      <section className="stats-banner">
        <div className="container stats-grid">
          <div className="stat-item">
            <h2>98.4%</h2>
            <p>Model Precision</p>
          </div>
          <div className="stat-item">
            <h2>12K+</h2>
            <p>Daily Valuations</p>
          </div>
          <div className="stat-item">
            <h2>50+</h2>
            <p>Parameters Tracked</p>
          </div>
        </div>
      </section>

      {/* Recent Cases */}
      <section className="recent container">
        <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '3rem', letterSpacing: '-1px' }}>Latest Market Analytics</h2>
        <div className="card-grid">
          {pastEstimates.map((item, i) => (
            <div key={i} className="card">
              <img src={item.img} alt={item.brand} />
              <h3>{item.brand}</h3>
              <div className="card-price">{item.price}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Predictor */}
      <section className="predictor" ref={predictorRef}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '3rem', fontWeight: 900, marginBottom: '4rem' }}>Configure Analytics</h2>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <form onSubmit={handlePredict}>
              
              <div className="accordion-item">
                <div className="accordion-header" onClick={() => setActiveTab('basic')}>
                  <span>Basic Details</span>
                  <span>{activeTab === 'basic' ? '−' : '+'}</span>
                </div>
                {activeTab === 'basic' && (
                  <div className="accordion-body">
                    <div className="input-box">
                      <label>Vehicle Make</label>
                      <select name="make" value={features.make} onChange={handleChange}>
                        <option value="audi">Audi</option>
                        <option value="bmw">BMW</option>
                        <option value="toyota">Toyota</option>
                      </select>
                    </div>
                    <div className="input-box">
                      <label>Fuel Specification</label>
                      <select name="fuelType" value={features.fuelType} onChange={handleChange}>
                        <option value="gas">Gasoline</option>
                        <option value="diesel">Diesel</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="accordion-item">
                <div className="accordion-header" onClick={() => setActiveTab('engine')}>
                  <span>Performance & Engine</span>
                  <span>{activeTab === 'engine' ? '−' : '+'}</span>
                </div>
                {activeTab === 'engine' && (
                  <div className="accordion-body">
                    <div className="input-box">
                      <label>Horsepower Output</label>
                      <input type="number" name="horsepower" value={features.horsepower} onChange={handleChange} />
                    </div>
                    <div className="input-box">
                      <label>Displacement (CC)</label>
                      <input type="number" name="engineSize" value={features.engineSize} onChange={handleChange} />
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" className="btn-main" style={{ width: '100%', marginTop: '2rem' }} disabled={loading}>
                {loading ? 'Processing...' : 'Generate Market Analytics'}
              </button>
            </form>

            {price && (
              <div style={{ marginTop: '3rem', textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '2rem', border: '2px solid #10b981' }}>
                <h3 style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', color: '#64748b' }}>Estimated Market Value</h3>
                <div style={{ fontSize: '4rem', fontWeight: 900, color: '#065f46' }}>
                  ${price.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer style={{ padding: '4rem 0', textAlign: 'center', background: 'white', borderTop: '1px solid var(--border)' }}>
        <p style={{ fontWeight: 700 }}>© 2026 AUTOVAL.AI - Advanced Intelligence Agency</p>
      </footer>
    </div>
  );
};

export default App;
