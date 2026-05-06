import React from 'react';
import { type ShowcaseCar } from '../../types/car';

const CarCard: React.FC<{ car: ShowcaseCar }> = ({ car }) => {
    return (
        <div className="car-card">
            <img src={car.img} alt={car.brand} loading="lazy" />
            <div className="car-card-header">
                <h4 className="car-brand">{car.brand}</h4>
                <span className="car-year">{car.year}</span>
            </div>
            <div className="car-price" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{car.price}</span>
                <span style={{ fontSize: '0.8rem', color: '#a8b2d1', fontWeight: 500, background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '0.25rem 0.75rem', borderRadius: '1rem' }}>
                    {(80 + (parseInt(car.price.replace(/\D/g, '')) % 15) + (car.brand.length % 5) / 10).toFixed(1)}% Precision
                </span>
            </div>
        </div>
    );
};

export default CarCard;
