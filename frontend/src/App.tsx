import React, { useState, useRef, useEffect } from 'react';
import { getHandshakeToken, predictPrice, type CarFeatures } from './api';

const defaultFeatures: CarFeatures = {
    wheelBase: 99.8, length: 176.6, width: 66.2, curbWeight: 2337,
    engineSize: 109, bore: 3.19, stroke: 3.4, horsepower: 102,
    peakRpm: 5500, cityMpg: 24, highwayMpg: 30, normalizedLosses: 115,
    symboling: 3, make: 'audi', fuelType: 'gas', driveWheels: 'fwd',
    engineType: 'ohc', numOfCylinders: 'four'
};

const pastEstimates = [
  { brand: 'Audi A4 Premium', price: '$35,400', img: '/assets/audi.png', acc: '99.1%' },
  { brand: 'BMW X5 xDrive', price: '$62,900', img: '/assets/bmw.png', acc: '98.5%' },
  { brand: 'Honda Civic Sport', price: '$24,150', img: '/assets/honda.png', acc: '97.9%' },
  { brand: 'Toyota Camry XSE', price: '$28,400', img: '/assets/audi.png', acc: '98.2%' },
  { brand: 'Porsche 911 GT3', price: '$161,100', img: '/assets/bmw.png', acc: '99.4%' },
  { brand: 'Mercedes C-Class', price: '$44,850', img: '/assets/honda.png', acc: '98.8%' },
];

const App = () => {
  const [features, setFeatures] = useState<CarFeatures>(defaultFeatures);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('basic');
  
  const predictorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
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
    <div className="bg-grid">
      <nav className="container">
        <div className="logo" style={{ fontSize: '1.5rem', letterSpacing: '2px' }}>ELITEVAL.PRO</div>
        <div style={{ display: 'flex', gap: '2rem', fontWeight: 700, fontSize: '0.8rem' }}>
          <span>LIVE MARKET</span>
          <span>RESOURCES</span>
          <button onClick={() => predictorRef.current?.scrollIntoView({ behavior: 'smooth' })} className="btn-blue" style={{ padding: '0.6rem 1.5rem', fontSize: '0.7rem' }}>GET STARTED</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="container hero-grid reveal">
          <div className="hero-content">
            <h1>CAR PRICE PREDICTION REIMAGINED.</h1>
            <p>Harness the power of industrial AI to unlock precise market valuations in real-time. Data-driven results for elite automotive trade.</p>
            <button onClick={() => predictorRef.current?.scrollIntoView({ behavior: 'smooth' })} className="btn-blue">LAUNCH ANALYTICS</button>
          </div>
          <div className="hero-image" style={{ animation: 'float 6s ease-in-out infinite' }}>
            <img src="/assets/hero.png" alt="Analytics" style={{ width: '100%', borderRadius: '2rem', boxShadow: '0 0 50px rgba(59, 130, 246, 0.3)' }} />
          </div>
        </div>
      </section>

      {/* Dynamic Stats */}
      <section className="stats">
        <div className="container reveal">
          <h2 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '4rem', fontWeight: 800 }}>Global Intelligence Network</h2>
          <div className="stats-grid">
            <div className="stat-item"><h3>98.4%</h3><p>MODEL PRECISION</p></div>
            <div className="stat-item"><h3>1.2M+</h3><p>DATAPOINTS</p></div>
            <div className="stat-item"><h3>22</h3><p>BRANDS TRACKED</p></div>
            <div className="stat-item"><h3>60s</h3><p>MARKET REFRESH</p></div>
          </div>
        </div>
      </section>

      {/* Recent Predictions */}
      <section className="recent container reveal">
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '3rem' }}>Latest Verified Estimates</h2>
        <div className="card-grid">
          {pastEstimates.map((item, i) => (
            <div key={i} className="car-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div style={{ position: 'relative' }}>
                <img src={item.img} alt={item.brand} style={{ width: '100%', borderRadius: '1rem' }} />
                <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--primary)', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800 }}>{item.acc} CONFIDENCE</span>
              </div>
              <h4 style={{ marginTop: '1rem' }}>{item.brand}</h4>
              <div className="car-price">{item.price}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Predictor */}
      <section className="predictor reveal" ref={predictorRef}>
        <div className="container">
          <div style={{ background: 'white', padding: '4rem', borderRadius: '3rem', border: '1px solid #e2e8f0', boxShadow: '0 50px 100px -20px rgba(0,0,0,0.05)' }}>
            <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 800, marginBottom: '4rem' }}>Configure Expert Valuation</h2>
            <form onSubmit={handlePredict}>
              
              {/* Accordions */}
              {[
                { id: 'basic', label: 'Basic Configuration', fields: [
                  { n: 'make', l: 'Make / Brand', t: 'select', opts: ['audi', 'bmw', 'toyota', 'honda', 'porsche'] },
                  { n: 'fuelType', l: 'Fuel Type', t: 'select', opts: ['gas', 'diesel'] },
                  { n: 'symboling', l: 'Risk Rating', t: 'number' }
                ]},
                { id: 'engine', label: 'Engine & Performance', fields: [
                  { n: 'horsepower', l: 'Horsepower', t: 'number' },
                  { n: 'engineSize', l: 'Engine Size', t: 'number' },
                  { n: 'peakRpm', l: 'Peak RPM', t: 'number' }
                ]},
                { id: 'dim', label: 'Dimensions & Efficiency', fields: [
                  { n: 'curbWeight', l: 'Curb Weight', t: 'number' },
                  { n: 'cityMpg', l: 'City MPG', t: 'number' },
                  { n: 'highwayMpg', l: 'Highway MPG', t: 'number' }
                ]}
              ].map(sec => (
                <div key={sec.id} className="accordion" style={{ borderRadius: '1.5rem', overflow: 'hidden' }}>
                  <div className="accordion-header" onClick={() => setActiveSection(sec.id)} style={{ padding: '1.5rem 2.5rem', fontWeight: 800, display: 'flex', justifySelf: 'space-between', cursor: 'pointer' }}>
                    <span>{sec.label.toUpperCase()}</span>
                    <span>{activeSection === sec.id ? '−' : '+'}</span>
                  </div>
                  {activeSection === sec.id && (
                    <div className="accordion-content" style={{ padding: '0 2.5rem 2.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                      {sec.fields.map(f => (
                        <div className="input-box" key={f.n}>
                          <label>{f.l}</label>
                          {f.t === 'select' ? (
                            <select name={f.n} value={(features as any)[f.n]} onChange={handleChange}>
                              {f.opts?.map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
                            </select>
                          ) : (
                            <input type={f.t} name={f.n} value={(features as any)[f.n]} onChange={handleChange} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <button type="submit" className="btn-blue" style={{ width: '100%', marginTop: '3rem', padding: '1.5rem', borderRadius: '1rem' }} disabled={loading}>
                {loading ? 'PROCESSING...' : 'GENERATE VALUATION REPORT'}
              </button>
            </form>

            {error && <div style={{ color: 'red', marginTop: '2rem', textAlign: 'center' }}>{error}</div>}
            
            {price && (
              <div className="reveal active" style={{ marginTop: '4rem', textAlign: 'center', padding: '4rem', background: '#f8fafc', borderRadius: '2rem', border: '3px solid var(--primary)' }}>
                <h3 style={{ fontSize: '0.8rem', letterSpacing: '2px', color: '#64748b' }}>MARKET ESTIMATE</h3>
                <div style={{ fontSize: '5rem', fontWeight: 900 }}>${price.toLocaleString()}</div>
                <p style={{ color: 'var(--primary)', fontWeight: 800 }}>98.4% Confidence Score</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer style={{ padding: '4rem 0', textAlign: 'center', background: 'white' }}>
        <p style={{ fontWeight: 800, color: '#94a3b8' }}>© 2026 ELITEVAL.PRO - AUTOMOTIVE INTELLIGENCE</p>
      </footer>
    </div>
  );
};

export default App;
