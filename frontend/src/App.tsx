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
  { brand: 'Audi A4', price: '$35,400', img: '/assets/audi.png', desc: 'Luxury Sedan with 2.0L Engine' },
  { brand: 'BMW X5', price: '$62,900', img: '/assets/bmw.png', desc: 'Premium SUV with AWD capabilities' },
  { brand: 'Honda Civic', price: '$24,150', img: '/assets/honda.png', desc: 'Efficiency leader with standard features' },
];

const App = () => {
  const [features, setFeatures] = useState<CarFeatures>(defaultFeatures);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
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

  return (
    <div>
      <nav>
        <div className="container">
          <div className="logo">CARPRICE.AI</div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div className="hero-content">
            <h1>Predict Your Car's Value with Precision.</h1>
            <p>Our advanced Machine Learning algorithms analyze over 50 technical parameters to give you the most accurate market valuation in real-time.</p>
            <button onClick={scrollToPredictor} className="btn-primary">Try Prediction Now</button>
          </div>
          <div className="hero-image">
            <img src="/assets/hero.png" alt="Data Analysis" />
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="stats">
        <div className="container">
          <h2 className="section-title">Verified Predictions</h2>
          <div className="car-grid">
            {pastPredictions.map((car, i) => (
              <div key={i} className="car-card">
                <img src={car.img} alt={car.brand} />
                <div className="car-info">
                  <h3>{car.brand}</h3>
                  <p>{car.desc}</p>
                  <div className="car-price">{car.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Predictor Form */}
      <section className="predictor" ref={predictorRef}>
        <div className="container">
          <h2 className="section-title">Configure Your Vehicle</h2>
          <div className="card">
            <form onSubmit={handlePredict}>
              <div className="form-grid">
                <div className="input-group">
                  <label>Brand / Make</label>
                  <select name="make" value={features.make} onChange={handleChange}>
                    <option value="audi">Audi</option>
                    <option value="bmw">BMW</option>
                    <option value="toyota">Toyota</option>
                    <option value="honda">Honda</option>
                    <option value="volvo">Volvo</option>
                    {/* Add more as needed */}
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
                  <label>Horsepower</label>
                  <input type="number" name="horsepower" value={features.horsepower} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label>Engine Size</label>
                  <input type="number" name="engineSize" value={features.engineSize} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label>City MPG</label>
                  <input type="number" name="cityMpg" value={features.cityMpg} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label>Highway MPG</label>
                  <input type="number" name="highwayMpg" value={features.highwayMpg} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label>Weight (Curb)</label>
                  <input type="number" name="curbWeight" value={features.curbWeight} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label>Body Style</label>
                  <select name="bodyStyle" value={features.bodyStyle} onChange={handleChange}>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="hatchback">Hatchback</option>
                  </select>
                </div>
              </div>
              
              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '2rem' }} disabled={loading}>
                {loading ? 'Analyzing Data...' : 'Generate Prediction'}
              </button>
            </form>

            {error && <div style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>{error}</div>}
            
            {price && (
              <div className="result">
                <h3>Prediction Result</h3>
                <div style={{ fontSize: '3rem', fontWeight: 800, color: '#059669' }}>
                  ${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                <p>Estimated Market Value based on current data.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer style={{ padding: '3rem 0', textAlign: 'center', background: 'white', borderTop: '1px solid var(--border)' }}>
        <p>© 2026 CARPRICE.AI - Powered by Azure & Machine Learning</p>
      </footer>
    </div>
  );
};

export default App;
