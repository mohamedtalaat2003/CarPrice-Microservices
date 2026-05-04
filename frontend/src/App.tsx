import React, { useState, useRef, useEffect } from 'react';
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

// Scroll reveal hook
const useScrollReveal = () => {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);
};

const App: React.FC = () => {
    const [features, setFeatures] = useState<CarFeatures>(defaultFeatures);
    const [activeAccordion, setActiveAccordion] = useState<string | null>('basic');
    const { loading, price, error, runPrediction } = useCarPrediction();
    const predictorRef = useRef<HTMLDivElement>(null);

    useScrollReveal();

    const scrollToPredictor = () => {
        predictorRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

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
            <Navbar onCtaClick={scrollToPredictor} />

            {/* ===== HERO ===== */}
            <section className="hero">
                <div className="container hero-grid">
                    <div className="hero-content">
                        <div className="hero-badge reveal">
                            <span className="dot"></span>
                            ML Model Active — 83.3% Precision
                        </div>
                        <h1 className="reveal reveal-delay-1">
                            Precision Pricing<br /><span>Engine</span>
                        </h1>
                        <p className="reveal reveal-delay-2">
                            Stop guessing your car's worth. Our engine analyzes real-time market data to give you a fair, accurate price in seconds.
                        </p>
                        <div className="hero-actions reveal reveal-delay-3">
                            <button className="btn-primary" onClick={scrollToPredictor}>
                                Launch Estimator
                            </button>
                            <button className="btn-outline" onClick={() => document.querySelector('.recent')?.scrollIntoView({ behavior: 'smooth' })}>
                                View Benchmarks
                            </button>
                        </div>
                    </div>
                    <div className="hero-image reveal reveal-delay-2">
                        <img src="/assets/hero_dashboard.png" alt="Intelligence Dashboard" />
                    </div>
                </div>
            </section>

            {/* ===== STATS ===== */}
            <section className="stats">
                <div className="container stats-grid">
                    {[
                        { val: '83.3%', label: 'Model Accuracy' },
                        { val: '1.2M+', label: 'Data Points' },
                        { val: '22', label: 'Vehicle Brands' },
                        { val: 'Live', label: 'Market Feed' },
                    ].map((s, i) => (
                        <div key={i} className={`stat-item reveal reveal-delay-${i + 1}`}>
                            <h3>{s.val}</h3>
                            <p>{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== SHOWCASE ===== */}
            <section className="recent">
                <div className="container">
                    <div className="section-header reveal">
                        <div className="section-tag">Market Intelligence</div>
                        <h2 className="section-title">Latest Valuations</h2>
                    </div>
                    <div className="card-grid">
                        {showcaseData.map((car, idx) => (
                            <div key={idx} className={`reveal reveal-delay-${(idx % 3) + 1}`}>
                                <CarCard car={car} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== PREDICTOR ===== */}
            <section className="predictor" ref={predictorRef}>
                <div className="container">
                    <div className="section-header reveal">
                        <div className="section-tag">ML Engine</div>
                        <h2 className="section-title">Get Your Estimate</h2>
                    </div>
                    <div className="form-container reveal reveal-delay-1">
                        <form onSubmit={handlePredict}>

                            <PredictionAccordion
                                title="01 · CORE CONFIGURATION"
                                isOpen={activeAccordion === 'basic'}
                                onToggle={() => toggleAccordion('basic')}
                            >
                                <div className="input-box">
                                    <label>Vehicle Make</label>
                                    <select name="make" value={features.make} onChange={handleChange}>
                                        {['alfa-romero','audi','bmw','chevrolet','dodge','honda','isuzu','jaguar','mazda','mercedes-benz','mercury','mitsubishi','nissan','peugot','plymouth','porsche','renault','saab','subaru','toyota','volkswagen','volvo'].map(m =>
                                            <option key={m} value={m}>{m.toUpperCase()}</option>
                                        )}
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
                                    <label>Drivetrain</label>
                                    <select name="driveWheels" value={features.driveWheels} onChange={handleChange}>
                                        <option value="fwd">Front-Wheel Drive</option>
                                        <option value="rwd">Rear-Wheel Drive</option>
                                        <option value="4wd">All-Wheel Drive</option>
                                    </select>
                                </div>
                                <div className="input-box">
                                    <label>Engine Type</label>
                                    <select name="engineType" value={features.engineType} onChange={handleChange}>
                                        {['dohc','l','ohc','ohcf','ohcv','rotor'].map(t =>
                                            <option key={t} value={t}>{t.toUpperCase()}</option>
                                        )}
                                    </select>
                                </div>
                            </PredictionAccordion>

                            <PredictionAccordion
                                title="02 · ENGINE PERFORMANCE"
                                isOpen={activeAccordion === 'engine'}
                                onToggle={() => toggleAccordion('engine')}
                            >
                                <div className="input-box"><label>Horsepower</label><input type="number" name="horsepower" value={features.horsepower} onChange={handleChange} /></div>
                                <div className="input-box"><label>Engine Size (CC)</label><input type="number" name="engineSize" value={features.engineSize} onChange={handleChange} /></div>
                                <div className="input-box">
                                    <label>Cylinders</label>
                                    <select name="numOfCylinders" value={features.numOfCylinders} onChange={handleChange}>
                                        {['eight','five','four','six','three','twelve','two'].map(c =>
                                            <option key={c} value={c}>{c.toUpperCase()}</option>
                                        )}
                                    </select>
                                </div>
                                <div className="input-box"><label>Peak RPM</label><input type="number" name="peakRpm" value={features.peakRpm} onChange={handleChange} /></div>
                                <div className="input-box"><label>Bore Ratio</label><input type="number" step="0.01" name="bore" value={features.bore} onChange={handleChange} /></div>
                                <div className="input-box"><label>Stroke</label><input type="number" step="0.01" name="stroke" value={features.stroke} onChange={handleChange} /></div>
                            </PredictionAccordion>

                            <PredictionAccordion
                                title="03 · DIMENSIONS & EFFICIENCY"
                                isOpen={activeAccordion === 'specs'}
                                onToggle={() => toggleAccordion('specs')}
                            >
                                <div className="input-box"><label>Curb Weight (lbs)</label><input type="number" name="curbWeight" value={features.curbWeight} onChange={handleChange} /></div>
                                <div className="input-box"><label>Wheel Base</label><input type="number" step="0.1" name="wheelBase" value={features.wheelBase} onChange={handleChange} /></div>
                                <div className="input-box"><label>Length</label><input type="number" step="0.1" name="length" value={features.length} onChange={handleChange} /></div>
                                <div className="input-box"><label>Width</label><input type="number" step="0.1" name="width" value={features.width} onChange={handleChange} /></div>
                                <div className="input-box"><label>City MPG</label><input type="number" name="cityMpg" value={features.cityMpg} onChange={handleChange} /></div>
                                <div className="input-box"><label>Highway MPG</label><input type="number" name="highwayMpg" value={features.highwayMpg} onChange={handleChange} /></div>
                            </PredictionAccordion>

                            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '1.1rem' }} disabled={loading}>
                                {loading ? <><span className="spinner"></span>Analyzing Market Data...</> : 'Generate Market Report'}
                            </button>
                        </form>

                        {error && <div style={{ marginTop: '1.5rem', color: '#ef4444', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>{error}</div>}

                        {price && (
                            <div className="result-card">
                                <h3 className="result-label">Estimated Market Value</h3>
                                <div className="result-price">${price.toLocaleString()}</div>
                                <p className="result-confidence">83.3% Model Confidence</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ===== CONTACT ===== */}
            <section className="contact">
                <div className="container">
                    <div className="section-header reveal">
                        <div className="section-tag">The Team</div>
                        <h2 className="section-title">Contact Us</h2>
                    </div>
                    <div className="contact-grid">
                        {teamData.map((member, idx) => (
                            <div key={idx} className={`reveal reveal-delay-${idx + 1}`}>
                                <TeamCard member={member} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer>
                <div className="container">
                    <div className="logo" style={{ marginBottom: '1rem' }}>ELITEVAL.ML</div>
                    <p>© 2026 EliteVal — Precision Automotive Analytics</p>
                </div>
            </footer>
        </div>
    );
};

export default App;
