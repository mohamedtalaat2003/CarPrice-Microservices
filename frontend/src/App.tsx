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

const pastPredictions = [
  { brand: 'Audi A4 Sport', price: '$35,400', img: '/assets/audi.png', desc: 'Verified market value' },
  { brand: 'BMW X5 xDrive', price: '$62,900', img: '/assets/bmw.png', desc: 'Premium market estimate' },
  { brand: 'Honda Civic LX', price: '$24,150', img: '/assets/honda.png', desc: 'Standard market value' },
];

const App = () => {
  const [features, setFeatures] = useState<CarFeatures>(defaultFeatures);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>('basic');
  
  const predictorRef = useRef<HTMLDivElement>(null);

  const scrollToPredictor = () => {
    predictorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFeatures(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

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
      setError(err.message || 'An error occurred during prediction.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div>
      <nav>
        <div className="container">
          <div className="logo">CARPRICE.AI</div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <h1>Know Your Car's True Worth in Seconds.</h1>
              <p>Why guess when you can know? Our advanced AI analyzes thousands of market data points to give you the most accurate price for your vehicle instantly.</p>
              <button onClick={scrollToPredictor} className="btn-primary">Get Your Estimate</button>
            </div>
            <div className="hero-image">
              <img src="/assets/hero.png" alt="Data Science Analyst" />
            </div>
          </div>
        </div>
      </section>

      {/* Analytics */}
      <section className="stats">
        <div className="container">
          <h2 className="section-title">Latest Verified Estimates</h2>
          <div className="car-grid">
            {pastPredictions.map((car, i) => (
              <div key={i} className="car-card">
                <img src={car.img} alt={car.brand} />
                <div className="car-info">
                  <h3>{car.brand}</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{car.desc}</p>
                  <div className="car-price">{car.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Predictor */}
      <section className="predictor" ref={predictorRef}>
        <div className="container">
          <h2 className="section-title">Valuation Engine</h2>
          <div className="form-card">
            <form onSubmit={handlePredict}>
              
              {/* Basic Details */}
              <div className="accordion-section">
                <div className="accordion-header" onClick={() => toggleSection('basic')}>
                  <span>Basic Details</span>
                  <span>{openSection === 'basic' ? '−' : '+'}</span>
                </div>
                {openSection === 'basic' && (
                  <div className="accordion-content">
                    <div className="input-group">
                      <label>Make</label>
                      <select name="make" value={features.make} onChange={handleChange}>
                        <option value="audi">Audi</option>
                        <option value="bmw">BMW</option>
                        <option value="toyota">Toyota</option>
                        <option value="honda">Honda</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Fuel Type</label>
                      <select name="fuelType" value={features.fuelType} onChange={handleChange}>
                        <option value="gas">Gasoline</option>
                        <option value="diesel">Diesel</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Engine */}
              <div className="accordion-section">
                <div className="accordion-header" onClick={() => toggleSection('engine')}>
                  <span>Engine & Performance</span>
                  <span>{openSection === 'engine' ? '−' : '+'}</span>
                </div>
                {openSection === 'engine' && (
                  <div className="accordion-content">
                    <div className="input-group">
                      <label>Horsepower</label>
                      <input type="number" name="horsepower" value={features.horsepower} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <label>Engine Size</label>
                      <input type="number" name="engineSize" value={features.engineSize} onChange={handleChange} />
                    </div>
                  </div>
                )}
              </div>

              {/* Efficiency */}
              <div className="accordion-section">
                <div className="accordion-header" onClick={() => toggleSection('efficiency')}>
                  <span>Dimensions & Efficiency</span>
                  <span>{openSection === 'efficiency' ? '−' : '+'}</span>
                </div>
                {openSection === 'efficiency' && (
                  <div className="accordion-content">
                    <div className="input-group">
                      <label>Curb Weight</label>
                      <input type="number" name="curbWeight" value={features.curbWeight} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <label>City MPG</label>
                      <input type="number" name="cityMpg" value={features.cityMpg} onChange={handleChange} />
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '2rem' }} disabled={loading}>
                {loading ? 'Calculating...' : 'Calculate Market Value'}
              </button>
            </form>

            {error && <div style={{ color: 'red', marginTop: '1.5rem', textAlign: 'center', fontWeight: 600 }}>{error}</div>}
            
            {price && (
              <div className="result-box">
                <h3 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.9rem' }}>Estimated Value</h3>
                <div className="price-value">
                  ${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                <p style={{ color: '#065f46', fontWeight: 600 }}>Market prediction successful.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}>
        <p>© 2026 CARPRICE.AI - Advanced Intelligence for Automotive Markets</p>
      </footer>
    </div>
  );
};

export default App;
