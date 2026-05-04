import React, { useState, useRef } from 'react';
import Navbar from './components/layout/Navbar';
import CarCard from './components/ui/CarCard';
import TeamCard from './components/ui/TeamCard';
import PredictionAccordion from './components/ui/PredictionAccordion';
import { useCarPrediction } from './hooks/useCarPrediction';
import { type CarFeatures, type ShowcaseCar, type TeamMember } from './types/car';

const defaultFeatures: CarFeatures = {
    wheelBase: 99.8, length: 176.6, width: 66.2, curbWeight: 2337,
    engineSize: 109, bore: 3.19, stroke: 3.4, horsepower: 102,
    peakRpm: 5500, cityMpg: 24, highwayMpg: 30, normalizedLosses: 115,
    symboling: 3, make: 'audi', fuelType: 'gas', driveWheels: 'fwd',
    engineType: 'ohc', numOfCylinders: 'four'
};

const showcaseData: ShowcaseCar[] = [
    { brand: 'Audi A4 Premium', year: '2024', price: '$42,500', img: '/assets/audi.png' },
    { brand: 'BMW X5 xDrive', year: '2023', price: '$68,200', img: '/assets/bmw.png' },
    { brand: 'Honda Civic Sport', year: '2024', price: '$26,900', img: '/assets/honda.png' },
    { brand: 'Audi Q5 Prestige', year: '2022', price: '$38,400', img: '/assets/audi.png' },
    { brand: 'BMW M3 Competition', year: '2024', price: '$82,100', img: '/assets/bmw.png' },
    { brand: 'Honda Accord Touring', year: '2023', price: '$34,850', img: '/assets/honda.png' },
];

const teamData: TeamMember[] = [
    {
        name: 'Zyad Refaat',
        role: 'Machine Learning Engineer',
        image: '/assets/zyad.png',
        linkedin: 'https://www.linkedin.com/in/zyad-refaat',
        github: 'https://github.com/zyadrefaat2023-gif/Egypt',
        phone: '01224296829'
    },
    {
        name: 'Mohamed Talaat',
        role: 'Lead System Architect',
        image: '/assets/mohamed.png',
        linkedin: 'https://www.linkedin.com/in/mohamed-talaat-',
        github: 'https://github.com/mohamedtalaat2003',
        phone: '01096883659'
    }
];

const App: React.FC = () => {
    const [features, setFeatures] = useState<CarFeatures>(defaultFeatures);
    const [activeAccordion, setActiveAccordion] = useState<string | null>('basic');
    const { loading, price, error, runPrediction } = useCarPrediction();
    const predictorRef = useRef<HTMLDivElement>(null);

    const handlePredict = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await runPrediction(features);
        } catch (err) {
            console.error('Prediction failed', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFeatures(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const toggleAccordion = (id: string) => {
        setActiveAccordion(prev => (prev === id ? null : id));
    };

    return (
        <div className="app-wrapper">
            <Navbar />

            {/* Hero Section */}
            <section className="hero">
                <div className="container hero-grid">
                    <div className="hero-content">
                        <h1>Precision Pricing Engine</h1>
                        <p>Stop guessing your car's worth. Our engine analyzes real-time market data to give you a fair, accurate price in seconds. Whether you’re buying or selling, we give you the confidence to make the right deal without leaving money on the table.</p>
                        <button 
                            className="btn-primary" 
                            onClick={() => predictorRef.current?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Launch Estimator
                        </button>
                    </div>
                    <div className="hero-image">
                        <img src="/assets/hero.png" alt="Intelligence Dashboard" style={{ width: '100%', borderRadius: '2.5rem' }} />
                    </div>
                </div>
            </section>

            {/* Stats Overview */}
            <section className="stats">
                <div className="container stats-grid">
                    <div className="stat-item"><h3>83.3%</h3><p>Model Confidence</p></div>
                    <div className="stat-item"><h3>1.2M+</h3><p>Data Parameters</p></div>
                    <div className="stat-item"><h3>22</h3><p>Major Brands</p></div>
                    <div className="stat-item"><h3>Live</h3><p>Market Data</p></div>
                </div>
            </section>

            {/* Showcase Showcase */}
            <section className="recent">
                <div className="container">
                    <h2 className="section-title">Market Benchmarks</h2>
                    <div className="card-grid">
                        {showcaseData.map((car, idx) => <CarCard key={idx} car={car} />)}
                    </div>
                </div>
            </section>

            {/* Prediction Engine */}
            <section className="predictor" ref={predictorRef}>
                <div className="container">
                    <h2 className="section-title">Valuation Engine</h2>
                    <div className="form-container">
                        <form onSubmit={handlePredict}>
                            
                            <PredictionAccordion 
                                title="01. CORE CONFIGURATION" 
                                isOpen={activeAccordion === 'basic'} 
                                onToggle={() => toggleAccordion('basic')}
                            >
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
                            </PredictionAccordion>

                            <PredictionAccordion 
                                title="02. ENGINE PERFORMANCE" 
                                isOpen={activeAccordion === 'engine'} 
                                onToggle={() => toggleAccordion('engine')}
                            >
                                <div className="input-box"><label>Horsepower</label><input type="number" name="horsepower" value={features.horsepower} onChange={handleChange} /></div>
                                <div className="input-box"><label>Engine CC</label><input type="number" name="engineSize" value={features.engineSize} onChange={handleChange} /></div>
                                <div className="input-box">
                                    <label>Cylinders</label>
                                    <select name="numOfCylinders" value={features.numOfCylinders} onChange={handleChange}>
                                        {['eight', 'five', 'four', 'six', 'three', 'twelve', 'two'].map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                                    </select>
                                </div>
                                <div className="input-box"><label>Peak RPM</label><input type="number" name="peakRpm" value={features.peakRpm} onChange={handleChange} /></div>
                            </PredictionAccordion>

                            <PredictionAccordion 
                                title="03. TECHNICAL SPECS" 
                                isOpen={activeAccordion === 'specs'} 
                                onToggle={() => toggleAccordion('specs')}
                            >
                                <div className="input-box"><label>Curb Weight (Lbs)</label><input type="number" name="curbWeight" value={features.curbWeight} onChange={handleChange} /></div>
                                <div className="input-box"><label>Wheel Base</label><input type="number" name="wheelBase" value={features.wheelBase} onChange={handleChange} /></div>
                                <div className="input-box"><label>Bore Ratio</label><input type="number" name="bore" value={features.bore} onChange={handleChange} /></div>
                                <div className="input-box"><label>City MPG</label><input type="number" name="cityMpg" value={features.cityMpg} onChange={handleChange} /></div>
                            </PredictionAccordion>

                            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '3rem' }} disabled={loading}>
                                {loading ? 'Computing Intelligence...' : 'Generate Market Report'}
                            </button>
                        </form>

                        {error && <div style={{ marginTop: '2rem', color: '#ef4444', textAlign: 'center', fontWeight: 600 }}>{error}</div>}

                        {price && (
                            <div className="result-card">
                                <h3 className="result-label">ESTIMATED MARKET VALUE</h3>
                                <div className="result-price">${price.toLocaleString()}</div>
                                <p className="result-confidence">Model Reliability Score: 83.3%</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Team/Contact Section */}
            <section className="contact">
                <div className="container">
                    <h2 className="section-title">Contact Support</h2>
                    <div className="contact-grid">
                        {teamData.map((member, idx) => <TeamCard key={idx} member={member} />)}
                    </div>
                </div>
            </section>

            <footer>
                <div className="container">
                    <div className="logo" style={{ color: 'white', marginBottom: '1.5rem' }}>ELITEVAL.ML</div>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>© 2026 Precision Automotive Analytics. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default App;
