import { useState } from 'react';
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

const makes = ["alfa-romero", "audi", "bmw", "chevrolet", "dodge", "honda", "isuzu", "jaguar", "mazda", "mercedes-benz", "mercury", "mitsubishi", "nissan", "peugot", "plymouth", "porsche", "renault", "saab", "subaru", "toyota", "volkswagen", "volvo"];
const bodyStyles = ["hardtop", "wagon", "sedan", "hatchback", "convertible"];
const engineTypes = ["dohc", "ohcv", "ohc", "l", "rotor", "ohcf"];
const cylinders = ["two", "three", "four", "five", "six", "eight", "twelve"];

function App() {
  const [features, setFeatures] = useState<CarFeatures>(defaultFeatures);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    <div className="app-container">
      <div className="header">
        <h1>AI Car Price Predictor</h1>
        <p>Enterprise Machine Learning Pipeline via Azure Microservices</p>
      </div>

      <div className="glass-panel">
        <form onSubmit={handlePredict}>
          
          <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Vehicle Details</h3>
          <div className="form-grid" style={{ marginBottom: '2rem' }}>
            <div className="form-group">
              <label>Make</label>
              <select name="make" value={features.make} onChange={handleChange}>
                {makes.map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Body Style</label>
              <select name="bodyStyle" value={features.bodyStyle} onChange={handleChange}>
                {bodyStyles.map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Fuel Type</label>
              <select name="fuelType" value={features.fuelType} onChange={handleChange}>
                <option value="gas">Gas</option>
                <option value="diesel">Diesel</option>
              </select>
            </div>
            <div className="form-group">
              <label>Drive Wheels</label>
              <select name="driveWheels" value={features.driveWheels} onChange={handleChange}>
                <option value="fwd">FWD</option>
                <option value="rwd">RWD</option>
                <option value="4wd">4WD</option>
              </select>
            </div>
          </div>

          <h3 style={{ marginBottom: '1rem', color: 'var(--secondary-color)' }}>Engine Specifications</h3>
          <div className="form-grid" style={{ marginBottom: '2rem' }}>
            <div className="form-group">
              <label>Engine Type</label>
              <select name="engineType" value={features.engineType} onChange={handleChange}>
                {engineTypes.map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Cylinders</label>
              <select name="numOfCylinders" value={features.numOfCylinders} onChange={handleChange}>
                {cylinders.map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Horsepower</label>
              <input type="number" name="horsepower" value={features.horsepower} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Engine Size</label>
              <input type="number" name="engineSize" value={features.engineSize} onChange={handleChange} />
            </div>
          </div>

          <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>Dimensions & Efficiency</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Curb Weight (lbs)</label>
              <input type="number" name="curbWeight" value={features.curbWeight} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>City MPG</label>
              <input type="number" name="cityMpg" value={features.cityMpg} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Highway MPG</label>
              <input type="number" name="highwayMpg" value={features.highwayMpg} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? <span className="loading-spinner"></span> : 'Predict Market Value'}
          </button>
        </form>

        {error && (
          <div style={{ marginTop: '1rem', color: '#ef4444', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {price !== null && !loading && (
          <div className="result-container">
            <h3>Estimated Market Value</h3>
            <div className="price-tag">
              ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
